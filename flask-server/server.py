import subprocess
import sys

from flask import Flask, request, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from WiFi import wifi_data, make_WiFi_QR
import os
import os.path
import uuid
import requests
import time
import fcntl
import qrcode
from subprocess import call
from read import read_QR_code

import json

TIMESLEEP = 5
SHOWCASE = False
IMG_FOLDERS = ['/img', '/upload', '/read']

app = Flask(__name__)
app.config['QR-code-images'] = os.getcwd() + '/img/'
app.config['url_microservice'] = os.getcwd() + '/url_validator_microservice/'
app.config['check_file'] = 'URLCheck.txt'
app.config['url_response'] = 'URLResponse.txt'
app.config['UPLOAD'] = os.getcwd() + '/upload/'

CORS(app)

ALLOWED_EXTENSIONS = {'png'}

URL = "http://localhost:8888/decrypt"


@app.route('/')
def index():
    print("Someone connected to the home page")
    cmd = 'python3 main_qr.py url=https://shallisey.github.io/ fill_color=#D73F09 back_color=#000000'
    os.system(cmd)

    return {"Welcome to the app": "JSON stuff"}


@app.route('/get-image/<img>', methods=['GET'])
def get_image(img):

    try:
        return send_from_directory(directory=app.config['QR-code-images'],
                                   path=app.config['QR-code-images'],
                                   filename=img, as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/create/URL-QR-Code', methods=['POST'])
def create_URL_QR_code():
    data = request.json
    cmd = "python3 main_qr.py"
    for key in data:
        cmd += f' {key}={data[key]}'

    if 'filename' not in data:
        filename = f'{uuid.uuid4().hex}.png'
        cmd += f' filename={filename}'
    else:
        filename = data['filename']
        cmd += f' filename={filename}'

    os.system(cmd)

    path_to_file = os.getcwd() + '/img/' + filename
    # Check if file is saved
    if os.path.exists(path_to_file):
        return {"success": filename}

    return {"error": "No file", "command": cmd}


@app.route('/url_checker', methods=['POST'])
def url_checker():
    if 'url' not in request.json:
        return {'Error': 'No url sent'}

    # Check if http:// or https:// are at the beginning of the url
    url = prepend_for_url(request.json['url'])

    # Write the URL to the file
    path_to_check = app.config['url_microservice'] + app.config['check_file']
    url_check = open(path_to_check, 'w')
    url_check.truncate(0)
    url_check.seek(0)
    url_check.write(url)
    url_check.close()

    time.sleep(.2)

    # Read from the URLResponse file
    path_to_response = app.config['url_microservice'] + app.config[
        'url_response']

    status_code = read_from_response_file(path_to_response)

    return {"status_code": status_code}


@app.route('/create/WIFI-QR-Code', methods=['POST'])
def create_WIFI_QR_code():
    data = request.json
    if 'ssid' not in data or 'authType' not in data:
        return {'Error': 'This is not WiFi data'}

    # Decrypt password
    encrypted_password = data['password']
    if encrypted_password is not None:
        # Send off encrypted password and receive encrypted password
        decrypted_password = requests.post(URL, encrypted_password, headers={
            "Content-Type": "text/plain"}).text
    else:
        decrypted_password = encrypted_password

    # Create WiFi string for the QR code data
    qr_code_data_for_wifi = wifi_data(ssid=data['ssid'],
                                      authentication_type=data['authType'],
                                      password=decrypted_password)

    if False in qr_code_data_for_wifi:
        return qr_code_data_for_wifi

    filename = uuid.uuid4().hex + '.png'

    data['wifi'] = qr_code_data_for_wifi[True]
    data['filename'] = filename

    # Input data into qrCode
    # If everything works with this function the file will be written in /img folder
    make_WiFi_QR(kwargs=data)

    path_to_file = os.getcwd() + '/img/' + filename
    # Check if file is saved
    if os.path.exists(path_to_file):
        return {"success": filename}

    return {"Error": "File does not exist"}


@app.route('/upload', methods=['POST'])
def upload():

    # Sending a file as {file: <file_format>}
    if 'file' not in request.files:
        return {"Error": "Something happened???"}

    # Grab the file that was sent from the client
    file = request.files['file']
    if file.filename == '':
        return {"Error": "Did you actually send a file?"}

    if file and allowed_file(file.filename):
        # This was recommended by Flask. Can't trust user input
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD'], filename))
        file_path = os.path.join(app.config['UPLOAD'], filename)

        try:
            # Going to run the main_qr.py with the subprocess and capture the output
            # This will write the file to the /upload folder
            result = subprocess.check_output(['python3', 'main_qr.py',
                                              "read={path}".format(
                                                  path=file_path)])

            result = result.decode('utf-8').strip('\n')

            return {"Success": "You hit it", "Data": result}
        except subprocess.CalledProcessError as readexe:
            print(
                "Error in the processing of your QR Code\nreturncode: {returncode}\noutput: {out}".format(
                    returncode=readexe.returncode, out=readexe.output))
            return {
                "Error": {"message": "Error in the processing of your QR Code",
                          "returncode": readexe.returncode,
                          "output": readexe.output, "ERR": readexe.stderr}}


@app.route('/file_cleanup')
def file_cleanup():
    # Go through the folders that contain images either created or uploaded and
    # Delete the files
    for folder in IMG_FOLDERS:
        cmd = f'python file_cleanup.py {os.getcwd()}{folder}'
        os.system(cmd)
    return {'Files deleted': ':)'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[
        1].lower() in ALLOWED_EXTENSIONS


def read_from_response_file(path_to_response: str) -> int:
    """
    Read from the URLResponse.txt file inside url_validator

    Use some locks to
    """
    file_read_something = False
    while not file_read_something:
        response_file = open(path_to_response, 'r+')

        # Using fcntl to lock files for race conditions
        # fcntl.flock(response_file,
        #             fcntl.LOCK_EX | fcntl.LOCK_NB)  # Lock the file
        status_code = response_file.readline()
        if SHOWCASE and status_code != '':
            print("Opening URLResonse.txt....")
            time.sleep(TIMESLEEP)
        response_file.truncate(0)
        # fcntl.flock(response_file,
        #             fcntl.LOCK_UN)  # Unlock the file for others to use
        response_file.close()
        if SHOWCASE and status_code != '':
            print("Closing URLResonse.txt....")

        if status_code == '':
            continue
        else:

            file_read_something = True
            return int(status_code)


def prepend_for_url(url_from_request):
    """
    This function will take the URL from the request from the client and 
    will check if http:// needs to be prepended to that url.
    """
    url_from_request = request.json['url']
    http_prepend = 'http://'
    https_prepend = 'https://'

    # prepend http:// to the link
    if len(url_from_request) < len(http_prepend) or (
            url_from_request[0: len(http_prepend)] != http_prepend and url_from_request[
                0: len(https_prepend)] != https_prepend):
        url_from_request = http_prepend + url_from_request

    return url_from_request


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5656)
