from pathlib import Path
import os
from configparser import ConfigParser

def get_save_path():
    filename = 'config/config.ini'
    parser = ConfigParser()
    parser.read(filename)

    home = Path(os.path.expanduser('~'))
    custom_path = (parser.items('save_path'))[0][1]
    save_path = home / custom_path
    return save_path 

save_path = get_save_path()
