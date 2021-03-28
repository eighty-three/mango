from pathlib import Path
import os
import time
from bs4 import BeautifulSoup
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

    # div containing chapter links
    main_div = content.findAll(True, {'class': ['list list-row row']})[0]
    chapter_links = main_div.select('div > a.item-author')[starting_point:]

    for idx, tag in enumerate(chapter_links, start=0):
        link = tag['href']
        ch_num = link.rsplit('/', 1)[1]

        if (check_if_at_latest(latest_chapter, ch_num, main_title)): break
        if (idx == 0): ret = ch_num

        chapter_number = fix_chapter_number(ch_num)
        chapter_path = series_path / chapter_number
        shortened = Path(main_title) / chapter_number # For displayed output in terminal

        chapter_downloader(s, link, chapter_path, shortened)
    return ret

def chapter_downloader(s, url, chapter_path, shortened):
    if not os.path.exists(chapter_path):
      os.makedirs(chapter_path)
    os.chdir(chapter_path)

    response = s.get(url)
    content = BeautifulSoup(response.content, 'html.parser')

    links_string = str(content.select_one('div > script'))
    image_links = links_string.split('window.chapterPages = ["')[1]\
                    .split(';window.next')[0].split('"]')[0].split('","')

    for idx, raw_link in enumerate(image_links, start=1):
        link = 'https://hatigarmscanz.net/' + raw_link.replace('\\', '')
        filename = str(idx).zfill(3) + '.jpg'
        dl_path = chapter_path / filename
        shortened_path = shortened / filename

        download_image(s, filename, dl_path, shortened_path, link, url)
