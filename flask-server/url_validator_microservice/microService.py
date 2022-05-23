# Module allows us to verify the URL
import requests
import time

TIMESLEEP = 5
SHOWCASE = False

# Will process the request to verify whether URL is valid or not


def url_check():

    while True:
        # Open file with URL, grab the text from within and close file
        url_file = open('URLCheck.txt', 'r+')
        url = url_file.read()

        if url != '' and SHOWCASE:
            print("Check the URLCheck.txt....")
            time.sleep(TIMESLEEP)
            print("Deleted")

        url_file.truncate(0)
        url_file.close()

        # Checks to see if the file has been populated, if not just continues to loop until url is present
        if url == '':
            continue
        else:
            print(url)
            # Use requests module to get status code of URL passed in
            try:
                request = requests.get(
                    url, allow_redirects=False)
                status_code = request.status_code
                print(request.headers['Location'])
                # request.raise_for_status()
            except:
                status_code = 404

            print(status_code)
            # Open Response file, clear contents, write status code and close file
            url_response = open('URLResponse.txt', 'w')

            url_response.truncate(0)
            url_response.seek(0)
            url_response.write(str(status_code))

            url_response.close()
            if url != '' and SHOWCASE:
                print("Writing status code")


if __name__ == '__main__':
    # lets us know service is running
    print('URL verification service is running')
    url_check()
