import os
from data_providers.base import BaseDataProvider
from data_providers.mock import MockDataProvider
from data_providers.pocketbase import PocketBaseDataProvider

DATA_PROVIDER = os.environ.get("DATA_PROVIDER", "mock")
print("Using data provider: " + DATA_PROVIDER)

data_provider: BaseDataProvider

if DATA_PROVIDER == "mock":
    data_provider = MockDataProvider()
elif DATA_PROVIDER == "pocketbase":
    data_provider = PocketBaseDataProvider()
else:
    raise Exception("Invalid data provider: " + DATA_PROVIDER)
