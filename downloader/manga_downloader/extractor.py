import sys, time, re
from manga_downloader.scraper.common import get_session
from manga_downloader.scraper.supported_sites import supported_sites

def download_images(data, starting_point=0):
    s = get_session()

    scraper = supported_sites[data['scraper']]['scraper']
    latest_chapter = scraper.series_downloader(s, data, starting_point)

    return latest_chapter

def get_scraper(link):
    scraper = None
    for key, value in supported_sites.items():
        if (value['site'] is not None):
            site = value['site']
            if (re.search(site, link)):
                scraper = key
                break

    if (scraper == None):
        print('Site not supported')
        exit()
    else:
        return scraper
    
if __name__ == '__main__':
    data = {}
    data['link'] = sys.argv[1]
    data['name'] = sys.argv[2]
    data['latest'] = 0
    data['scraper'] = get_scraper(data['link'])

    if (len(sys.argv) > 3):
        starting_point = sys.argv[3]
        download_images(data, int(starting_point))
    else:
        download_images(data)
