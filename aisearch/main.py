from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from init_search import init
from vectordb.chroma import get_documents_for_search

# init on startup
print("initialising...")
init()
print("initialisation done")

app = FastAPI()

# CORS
origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# models
class UsersQuestion(BaseModel):
    text: str
    count: int = 1

# simple ping
@app.get("/ping")
def ping():
    return {"message": "online"}

# create a new document
@app.post("/question/")
def ask_question(data: UsersQuestion):
    docs = get_documents_for_search(data.text, 5)
    return docs

# initialisation trigger
initialised = False
initisation_running = False

@app.get("/init")
def init():
    if initialised:
        return {"message": "already initialised"}
    else:
        if initisation_running:
            return {"message": "initialisation already running"}
        else:
            init()
            initialised = True
    return {"message": "initialisation done"}