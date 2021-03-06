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
    main_div = content.select_one('ul.row-content-chapter')
    chapter_links = main_div.select('a')[starting_point:]

    for idx, chapter in enumerate(chapter_links, start=0):
        link = chapter['href']
        ch_num = str(link.split('chapter_')[1])

        if (check_if_at_latest(latest_chapter, ch_num, main_title)): break
        if (idx == 0): ret = ch_num

        chapter_number = fix_chapter_number(ch_num)
        # If there's an actual title or just the chapter number
        title = chapter['title'].split(':')
        if (len(title) > 1):
            chapter_title = chapter_number + ':' + str(title[1])
        else:
            chapter_title = chapter_number

        chapter_path = series_path / chapter_title
        shortened = Path(main_title) / chapter_title # For displayed output in terminal

        chapter_downloader(s, link, chapter_path, shortened)
    return ret
    
def chapter_downloader(s, url, chapter_path, shortened):
    if not os.path.exists(chapter_path):
      os.makedirs(chapter_path)
    os.chdir(chapter_path)

    response = s.get(url)
    content = BeautifulSoup(response.content, 'html.parser')

    # div containing images
    main_div = content.select_one('div.container-chapter-reader')
    images = main_div.select('img')

    for idx, image in enumerate(images, start=1):
        link = str(image['src'])
        filename = str(idx).zfill(3) + '.jpg'
        dl_path = chapter_path / filename
        shortened_path = shortened / filename

        download_image(s, filename, dl_path, shortened_path, link, url)
