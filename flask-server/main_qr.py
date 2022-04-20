import sys
import uuid
from url import create_url_qrcode


def main(file, *args):
    # Check arguments

    print(file, args)
    kwargs = {x.split('=')[0]: x.split('=')[1] for x in sys.argv if '=' in x}
    print(kwargs)

    if 'url' in kwargs:
        print("Doing {arg} stuff".format(arg=sys.argv[1]))
        try:
            create_url_qrcode(kwargs=kwargs)
        except IndexError:
            print(
                "Invalid argument. Make sure you add a url to the end of your arguments")
    elif sys.argv[1].lower() == '--wifi':
        print("Doing {arg} stuff".format(arg=sys.argv[1]))
    elif sys.argv[1].lower() == '--read':
        print("Doing {arg} stuff".format(arg=sys.argv[1]))
    else:
        raise SyntaxError(
            'You did not enter enough arguments for the program\n'
            'For example:\n'
            '"python3 main_qr.py --url https://shallisey.github.io/"\tfor example')


if __name__ == '__main__':
    main(sys.argv[0], *sys.argv[1:])
