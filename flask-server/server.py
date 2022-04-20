from flask import Flask
from flask import request
import os
import json

app = Flask(__name__)


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

    os.system(cmd)

    return {"result": cmd}


@app.route('/file_cleanup')
def file_cleanup():
    cmd = 'python file_cleanup.py /Applications/CS361/QR-CODE-Project/react-flask-qrcode/flask-server/img'
    os.system(cmd)
    return {'Files deleted': ':)'}


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5656)
