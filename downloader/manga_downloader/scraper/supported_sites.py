import sys, time, re
from manga_downloader.scraper.sites import gosu, manganelo, hatigarm, skscans, hmanhwa, webtoonxyz

supported_sites = {
    'gosu': {
        'site': None,
        'scraper': gosu
    },
    'hmanhwa': {
        'site': 'hmanhwa.com',
        'scraper': hmanhwa
    },
    'webtoonxyz': {
        'site': 'webtoon.xyz',
        'scraper': webtoonxyz
    },
    'skscans': {
        'site': 'skscans.com',
        'scraper': skscans
    },
    'hatigarm': {
        'site': 'hatigarmscanz.net',
        'scraper': hatigarm
    },
    'manganelo': {
        'site': 'manganelo.com',
        'scraper': manganelo
    }
}
