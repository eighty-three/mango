import time
from datetime import datetime
import sys
import os
from pathlib import Path
from bs4 import BeautifulSoup
import bs4
import psycopg2
from psycopg2 import Error

from manga_downloader.config.db import db_params
from manga_downloader.extractor import download_images

def main():
    try:
        connection = psycopg2.connect(**db_params)

    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        exit()
    
    cur = get_script_path()

    while True:
        cursor = connection.cursor()
        cursor.execute("SELECT * from manga")
        manga = cursor.fetchall()
        columns = [column[0] for column in cursor.description]

        for row in manga:
            item = dict(zip(columns, row))
            new_latest = download_images(item)
            os.chdir(cur)

            if (item['latest'] != new_latest):
                update_text = 'UPDATING {name} to {new_latest}'.format(
                        name = item['name'],
                        new_latest = new_latest
                    )
                print('\r\033[1;34m', update_text, '\033[0m', sep='')

                query = "UPDATE manga SET latest = {new_latest} WHERE series_id = {series_id}".format(
                        new_latest = str(new_latest),
                        series_id = str(item['series_id'])
                )

                cursor.execute(query)
                connection.commit()

        print_current_time()
        time.sleep(3600 * 6)
        
def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))

def print_current_time():
    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    print('===================')
    print(dt_string)
    print('===================')

if __name__ == '__main__':
    main()
