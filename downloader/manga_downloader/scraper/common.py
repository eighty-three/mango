import time, os, requests, urllib.request
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def get_session():
    retry_strategy = Retry(
        total=99,
        backoff_factor=5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=['HEAD', 'GET', 'OPTIONS']
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    http = requests.Session()
    http.mount('https://', adapter)
    http.mount('http://', adapter)
    http.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    })

    return http

def get_session_headers(custom_referer):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (custom_referer):
        headers['Referer'] = custom_referer

    return headers

def download_image(s, filename, dl_path, shortened_path, dl_link, custom_referer=0):
    # If target download already exists, just print the filename
    if (os.path.isfile(dl_path)):
        print('\033[2m', '# ' + str(shortened_path), '\033[0m', sep='')
    else :
        print(shortened_path, end='', flush=True)
    
        headers = get_session_headers(custom_referer)
        actual_image = s.get(dl_link, allow_redirects=True, headers=headers)
        open(filename, 'wb').write(actual_image.content)
        print('\r\033[1;32m', shortened_path, '\033[0m', sep='')

# for when I change my mind regarding what should be printed
def check_if_at_latest(latest, current, main_title):
    if (float(current) == float(latest)):
        fluff = ' currently at the latest saved chapter, '
        print('\r\033[1;33m', main_title, '\033[0m',\
                fluff,\
                '\033[1;33m', str(latest), '\033[0m', sep=''
        )
        return True
    else:
        return False

# for decimals e.g. c003.5 vs c003
def fix_chapter_number(chapter_number):
    ch_num_versioning = chapter_number.split('.')
    if (len(ch_num_versioning) > 1):
        fixed_chapter_number = str('c' + ch_num_versioning[0].zfill(3) + '.' + ch_num_versioning[1])
    else:
        fixed_chapter_number = str('c' + ch_num_versioning[0].zfill(3))

    return fixed_chapter_number




# For when Selenium is needed
# Need to separate some logic because not all sites where Selenium is necessary have the same html
# Soon...
def get_links(url):
    chapter_links = False
    while not chapter_links:
        try:
            opts = Options()
            opts.headless = True
            driver = webdriver.Chrome(executable_path='./chromedriver', options=opts)  
            driver.get(url)
            time.sleep(5)
            
            html = driver.page_source
            driver.close()
            
            # div containing chapter links
            content = BeautifulSoup(html, 'html.parser')
            chapter_links = get_chapter_links(content)
        except AttributeError:
            time.sleep(10) # Wait then try again
            pass
    return chapter_links

def get_chapter_links(content):
    try:
        main_div = content.select_one('div.listing-chapters_wrap > ul.version-chap')
        chapter_links = list(map(get_link_from_tag, main_div.select('li > a')))
    except AttributeError:
        main_div = content.select_one('label > select.single-chapter-select')
        chapter_links = list(map(get_link_from_tag, main_div.select('option')))

    return chapter_links

def get_link_from_tag(item):
    try:
        return item['href']
    except KeyError:
        return item['data-redirect']
