import qrcode
import os
import uuid

SAVE_DIR = '{curr_dir}/img/'.format(curr_dir=os.getcwd())


# def create_url_qrcode(url: str, unique_id: str):


def create_url_qrcode(**kwargs):
    """

    """
    kwargs = kwargs['kwargs']

    url = kwargs.get('url')

    filename = kwargs.get('filename') if kwargs.get(
        'filename') else uuid.uuid4().hex + '.png'
    back_color = kwargs.get('back_color') if kwargs.get(
        'back_color') else '#000000'
    fill_color = kwargs.get('fill_color') if kwargs.get(
        'fill_color') else '#FFFFFF'
    version = kwargs.get('version') if kwargs.get('version') else 1
    error_correction = kwargs.get('error_connection') if kwargs.get(
        'error_connection') else qrcode.constants.ERROR_CORRECT_H
    box_size = kwargs.get('box_size') if kwargs.get('box_size') else 10
    border = kwargs.get('border') if kwargs.get('border') else 1

    try:
        # print(url, filename, back_color, fill_color, version, error_correction,
        #       box_size, border)

        qr = qrcode.QRCode(version=version, error_correction=error_correction,
                           box_size=box_size, border=border, )

        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color=fill_color, back_color=back_color)

        # Make sure the path does exist
        make_directory_exist(SAVE_DIR)

        img.save('{path}{filename}'.format(path=SAVE_DIR,
                                           filename=filename))  # try:  # # Compose the filename  # for the file.filename = unique_id + '.png'        Create our qrcode base       qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)          Add our url to the qrcode and fill it out       qr.add_data(url)       qr.make(fit=True)          This will make our image with the default colors       img = qr.make_image(fill_color="black", back_color="white")          Create the directory where we will save these QR codes       make_directory_exist(SAVE_DIR)          Save the image to the given file path       img.save("{dir_path}{filename}".format(dir_path=SAVE_DIR, filename=filename))   except Exception as e:       err = open(  #     'error.txt', 'a')  # err.write(  #     'Error: {error}\nfilename: {filename}\nURL: {url}\n\n'.format(error=e,  #                                                                   filename=unique_id + '.png',  #                                                                   url=url))  # err.close()


    except Exception as e:
        err = open('error.txt', 'a')
        err.write(
            'Error: {error}\nfilename: {filename}\nURL: {url}\n\n'.format(
                error=e, filename=filename, url=url))
        err.close()


def make_directory_exist(directory_path: str) -> None:
    """
    This will create a directory if one does not exist.
    :param directory_path:
    :return:
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
