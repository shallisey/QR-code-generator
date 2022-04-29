from PIL import Image, ImageColor
import cv2
from os.path import exists
import os
from pyzbar.pyzbar import decode
import uuid

from url import make_directory_exist

SAVE_DIR = '{curr_dir}/read/'.format(curr_dir=os.getcwd())

def read_QR_code(**kwargs):

    kwargs = kwargs['kwargs']

    # Pull up path to file
    path_to_file = kwargs['read']

    # print(exists(path_to_file))

    if not exists(path_to_file):
        raise FileNotFoundError


    # Open the file
    img = Image.open(path_to_file)

    # Decode image
    results = decode(img)

    if not results:
        raise ImageError

    make_directory_exist(SAVE_DIR)

    data = results[0].data.decode('utf-8')

    print("Data: {data}".format(data=data), sep='')

    return 0

class ImageError(Exception):
    pass

