from pathlib import Path
import os
import time
from bs4 import BeautifulSoup
import bs4
from manga_downloader.config.save_path import save_path
from manga_downloader.scraper.common import download_image, fix_chapter_number, check_if_at_latest

def series_downloader(s, data, starting_point):
    main_title = data['name']
    url = data['link']
    latest_chapter = data['latest']
    ret = latest_chapter

    series_path = save_path / main_title

    response = s.get(url)
    content = BeautifulSoup(response.content, 'html.parser')

    chapter_links = content.select('item > description')[starting_point:]

    for idx, item in enumerate(chapter_links, start=0):
        tag = item.find(text=lambda tag: isinstance(tag, bs4.CData)).string.strip()
        url = BeautifulSoup(tag, 'html.parser').select_one('a')['href']
        ch_num = url.split('episode_no=')[1]
        vol_num = url.split('chapter-')[1].split('-')[0]
        vol = 'v0' + vol_num

        if (check_if_at_latest(latest_chapter, ch_num, main_title)): break
        if (idx == 0): ret = ch_num

        chapter_number = fix_chapter_number(ch_num)
        chapter_title = vol + ' ' + chapter_number

        chapter_path = series_path / chapter_title
        shortened = Path(main_title) / chapter_title # For displayed output in terminal

        chapter_downloader(s, url, chapter_path, shortened)
    return ret

def chapter_downloader(s, url, chapter_path, shortened):
    if not os.path.exists(chapter_path):
      os.makedirs(chapter_path)
    os.chdir(chapter_path)

    response = s.get(url)
    content = BeautifulSoup(response.content, 'html.parser')

    images = content.findAll(attrs={'class': '_images'})

    for idx, image in enumerate(images, start=0):
        link = str(image['data-url']).split('?')[0]
        filename = str(idx).zfill(3) + '.jpg'
        dl_path = chapter_path / filename
        shortened_path = shortened / filename

        download_image(s, filename, dl_path, shortened_path, link, url)
