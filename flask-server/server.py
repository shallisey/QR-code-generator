from flask import Flask
from flask import request
from flask_cors import CORS

import os
import uuid

import json

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    print("Someone connected to the home page")
    cmd = 'python3 main_qr.py url=https://shallisey.github.io/ fill_color=#D73F09 back_color=#000000'
    os.system(cmd)

    return {"Welcome to the app": "JSON stuff"}


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

        print("added to command")

    os.system(cmd)

    return {"success": filename}


@app.route('/file_cleanup')
def file_cleanup():
    cmd = 'python file_cleanup.py /Applications/CS361/QR-CODE-Project/react-flask-qrcode/flask-server/img'
    os.system(cmd)
    return {'Files deleted': ':)'}


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5656)
