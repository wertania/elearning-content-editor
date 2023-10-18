from dotenv import load_dotenv
import os
load_dotenv()

dataprovider_user = os.getenv('DATAPROVIDER_USER')
dataprovider_password = os.getenv('DATAPROVIDER_PASSWORD')
dataprovider_url = os.getenv('DATAPROVIDER_URL')
base_language = os.getenv('BASE_LANGUAGE')
_debug = os.getenv('DEBUG')
# parse to bool
if _debug is not None:
    _debug = _debug.lower() == 'true'
debug = _debug or False

if dataprovider_password is None or dataprovider_user is None or dataprovider_url is None:
    print("Please set DATAPROVIDER_USER, DATAPROVIDER_PASSWORD, and DATAPROVIDER_URL environment variables")
    exit(1)
