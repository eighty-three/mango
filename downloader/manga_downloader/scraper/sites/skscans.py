from pathlib import Path
import os
import time
from bs4 import BeautifulSoup
from manga_downloader.config.save_path import save_path
from manga_downloader.scraper.common import download_image, get_links, fix_chapter_number, check_if_at_latest

def series_downloader(s, data, starting_point):
    main_title = data['name']
    url = data['link']
    latest_chapter = data['latest']
    ret = latest_chapter
   
    series_path = save_path / main_title

    chapter_links = get_links(url)[starting_point:]

    for idx, link in enumerate(chapter_links, start=0):
        ch_num = str(link.rsplit('/', 1)[0].rsplit('/', 1)[1])

        if (check_if_at_latest(latest_chapter, ch_num, main_title)): break
        if (idx == 0): ret = ch_num

        chapter_number = fix_chapter_number(ch_num)

        # Fix this
        if (main_title == 'Volcanic Age'):
            chapter_title = 'v02 ' + chapter_number
        else:
            chapter_title = chapter_number

        chapter_path = series_path / chapter_title
        shortened = Path(main_title) / chapter_title # For displayed output in terminal

        chapter_downloader(s, link, chapter_path, shortened)
        time.sleep(5)
    return ret
    
def chapter_downloader(s, url, chapter_path, shortened):
    if not os.path.exists(chapter_path):
      os.makedirs(chapter_path)
    os.chdir(chapter_path)

    response = s.get(url)
    content = BeautifulSoup(response.content, 'html.parser')

    # div containing images
    main_div = content.select_one('div.reading-content')
    images = main_div.select('img')

    for idx, image in enumerate(images, start=0):
        link = str(image['src'])
        filename = str(idx).zfill(3) + '.jpg'
        dl_path = chapter_path / filename
        shortened_path = shortened / filename

        download_image(s, filename, dl_path, shortened_path, link, url)
