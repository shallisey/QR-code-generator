import subprocess
import sys

from flask import Flask, request, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from WiFi import wifi_data, make_WiFi_QR
import os
import os.path
import uuid
import qrcode
from subprocess import call
from read import read_QR_code


import json

app = Flask(__name__)
app.config['QR-code-images'] = os.getcwd() + '/img/'
app.config['UPLOAD'] = os.getcwd() + '/upload/'

CORS(app)

ALLOWED_EXTENSIONS = {'png'}


@app.route('/')
def index():
    print("Someone connected to the home page")
    cmd = 'python3 main_qr.py url=https://shallisey.github.io/ fill_color=#D73F09 back_color=#000000'
    os.system(cmd)

    return {"Welcome to the app": "JSON stuff"}


@app.route('/get-image/<img>', methods=['GET'])
def get_image(img):
    print(app.config['QR-code-images']+img,)

    try:
        return send_from_directory(directory=app.config['QR-code-images'], path=app.config['QR-code-images'], filename=img, as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route('/create/URL-QR-Code', methods=['POST'])
def create_URL_QR_code():

    data = request.json
    print(data)
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

    path_to_file = os.getcwd()+'/img/'+filename
    # Check if file is saved
    if os.path.exists(path_to_file):
        return {"success": filename}

    return {"error": "No file", "command": cmd}


@app.route('/create/WIFI-QR-Code', methods=['POST'])
def create_WIFI_QR_code():
    data = request.json
    # print(data)
    if 'ssid' not in data or 'authType' not in data:
        return {
            'Error': 'This is not WiFi data'
        }


    # Create WiFi string for the QR code data
    qr_code_data_for_wifi = wifi_data(
        ssid=data['ssid'], authentication_type=data['authType'], password=data['password'])

    if False in qr_code_data_for_wifi:
        return qr_code_data_for_wifi

    filename = uuid.uuid4().hex + '.png'

    data['wifi'] = qr_code_data_for_wifi[True]
    data['filename'] = filename

    print("Data:", data)

    make_WiFi_QR(kwargs=data)

    path_to_file = os.getcwd() + '/img/' + filename
    # Check if file is saved
    if os.path.exists(path_to_file):
        return {"success": filename}


    return {"Error": "File does not exist"}


@app.route('/upload', methods=['POST'])
def upload():
    print('hit the read route')
    print(request.files)
    if 'file' not in request.files:
        return {"Error": "Something happened???"}

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
            result = subprocess.check_output(
                ['python3', 'main_qr.py', "read={path}".format(path=file_path)])

            result = result.decode('utf-8').strip('\n')

            return {"Success": "You hit it", "Data": result}
        except subprocess.CalledProcessError as readexe:
            print("Error in the processing of your QR Code\nreturncode: {returncode}\noutput: {out}".format(
                returncode=readexe.returncode, out=readexe.output))
            return {"Error": {"message": "Error in the processing of your QR Code",
                              "returncode": readexe.returncode,
                              "output": readexe.output,
                              "ERR": readexe.stderr}}


@app.route('/file_cleanup')
def file_cleanup():
    cmd = 'python file_cleanup.py /Applications/CS361/QR-CODE-Project/react-flask-qrcode/flask-server/img'
    os.system(cmd)
    return {'Files deleted': ':)'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5656)
