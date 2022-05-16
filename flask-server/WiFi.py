import qrcode
import uuid
import os
from PIL import ImageColor

SAVE_DIR = '{curr_dir}/img/'.format(curr_dir=os.getcwd())

def wifi_data(ssid: str, authentication_type: str, password=None) -> dict[
    bool, str]:
    """
    This will build the string that will be input into a qr code for WiFi.
    """

    if authentication_type[0:3] == 'WPA':
        authentication_type = "WPA"

    if authentication_type in ['WPA', 'WEP']:
        if password is None:
            return {False: 'Password cannot be None while an authentication type is selected'}

        return {
            True: 'WIFI:T:{authentication_type};S:{ssid};P:{password};H:false;;'.format(
                authentication_type=authentication_type, ssid=ssid, password=password)}

    elif authentication_type == 'nopass':
        if password is not None:
            return {False: 'A password was entered while also selecting an '
                           'authentication type of None. Do not enter a password if there is no authentication type.'}

        return {
            True: 'WIFI:T:nopass;S:{ssid};H:false;;'.format(
                    ssid=ssid)
        }

    else:
        return {
            False: 'Authentication type is off\nAuthType: {type}'.format(type={authentication_type})
        }

def make_WiFi_QR(**kwargs):

    kwargs = kwargs['kwargs']

    data_for_wifi = kwargs.get('wifi')

    filename = kwargs.get('filename') if kwargs.get(
        'filename') else uuid.uuid4().hex + '.png'
    back_color = kwargs.get('back_color') if kwargs.get(
        'back_color') else '#FFFFFF'
    fill_color = kwargs.get('fill_color') if kwargs.get(
        'fill_color') else '#000000'
    version = kwargs.get('version') if kwargs.get('version') else 1
    error_correction = kwargs.get('error_connection') if kwargs.get(
        'error_connection') else qrcode.constants.ERROR_CORRECT_H
    box_size = kwargs.get('box_size') if kwargs.get('box_size') else 10
    border = kwargs.get('border') if kwargs.get('border') else 1

    try:
        qr = qrcode.QRCode(version=version, error_correction=error_correction,
                           box_size=box_size, border=border)

        qr.add_data(data_for_wifi)

        # Convert the hex values to an RGB tuple
        # with ImageColor.getcolor("hex_value", "RGB")
        fill_color_RGB = ImageColor.getcolor(fill_color, "RGB")
        back_color_RGB = ImageColor.getcolor(back_color, "RGB")

        img = qr.make_image(fill_color=fill_color_RGB, back_color=back_color_RGB)

        img.save('{path}{filename}'.format(path=SAVE_DIR, filename=filename))

        img.close()

    except Exception as e:
        err = open('error.txt', 'a')
        err.write(
            'Error: {error}\nfilename: {filename}\nWIFI: {wifi}\n\n'.format(error=e,
                filename=filename, wifi=data_for_wifi))
        err.close()

