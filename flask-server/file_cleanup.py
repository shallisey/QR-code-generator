import os
import sys

dir = os.getcwd()

if len(sys.argv) == 2:
    dir = sys.argv[1]

for filename in os.scandir(dir):
    if filename.name == '580b585b2edbce24c47wifi.pngb2488.png':
        continue
    if filename.name.lower().endswith(('.png', '.jpg', '.jpeg')):
        print(filename.path)
        os.remove(filename.path)
