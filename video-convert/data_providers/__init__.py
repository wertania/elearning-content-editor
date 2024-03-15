import os

from data_providers.base import BaseDataProvider
from data_providers.mock import MockDataProvider
from data_providers.pocketbase import PocketBaseDataProvider

DOCUMENT_DATASOURCE = os.environ.get("DOCUMENT_DATASOURCE", "mock")
print("Using data provider: " + DOCUMENT_DATASOURCE)

data_provider: BaseDataProvider

if DOCUMENT_DATASOURCE == "mock":
    data_provider = MockDataProvider()
elif DOCUMENT_DATASOURCE == "pocketbase":
    data_provider = PocketBaseDataProvider()
else:
    raise Exception("Invalid data provider: " + DOCUMENT_DATASOURCE)
