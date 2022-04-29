import sys
import uuid
from url import create_url_qrcode
from read import read_QR_code, ImageError



def main(file, *args):
    # Check arguments

    # print(file, args)
    kwargs = {x.split('=')[0]: x.split('=')[1] for x in sys.argv if '=' in x}
    # print(kwargs)

    if 'url' in kwargs:
        try:
            create_url_qrcode(kwargs=kwargs)
        except IndexError:
            print(
                "Invalid argument. Make sure you add a url to the end of your arguments")
    # elif sys.argv[1].lower() == '--wifi':
    #     print("Doing {arg} stuff".format(arg=sys.argv[1]))
    elif 'read' in kwargs:
        # print("Doing {arg} stuff".format(arg='read'))
        try:
            data = read_QR_code(kwargs=kwargs)
            return 0
        except IndexError:
            print(
                "Invalid argument. Make sure your path is correct")
            return 1
        except FileNotFoundError:
            print("File not found")
            return 1
        except ImageError:
            print("Something wrong when processing your QR code")
            return 1


    else:
        raise SyntaxError(
            'You did not enter enough arguments for the program\n'
            'For example:\n'
            '"python3 main_qr.py --url https://shallisey.github.io/"\tfor example')




if __name__ == '__main__':
    main(sys.argv[0], *sys.argv[1:])
