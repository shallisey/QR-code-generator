from flask import Flask, request, send_from_directory, abort
from flask_cors import CORS
import os
import os.path
import uuid

import json

app = Flask(__name__)
app.config['QR-code-images'] = os.getcwd() + '/img/'
CORS(app)


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
    print(os.path.exists(path_to_file))
    # Check if file is saved
    if os.path.exists(path_to_file):
        return {"success": filename}

    return {"error": "No file", "command": cmd}

@app.route('/file_cleanup')
def file_cleanup():
    cmd = 'python file_cleanup.py /Applications/CS361/QR-CODE-Project/react-flask-qrcode/flask-server/img'
    os.system(cmd)
    return {'Files deleted': ':)'}


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5656)
