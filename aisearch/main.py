from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from init_search import init
from vectordb.chroma import get_documents_for_search
from config import open_ai_key
import openai

# init on startup
print("initialising...")
init()
openai.api_key = open_ai_key
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

# get documents that match the question
@app.post("/search/")
def get_matches(data: UsersQuestion):
    docs = get_documents_for_search(data.text, 5)
    return docs

# get a direct answer to the question
@app.post("/question/")
def ask_question(data: UsersQuestion):
    docs = get_documents_for_search(data.text, 5)
    plain_docs = "\n###\n".join([doc["markdown"] for doc in docs])

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[
        {"role": "system", "content": """
        You are an helpful AI assistant. You are helpful, creative, clever, and very friendly.
        Your answer will depend on the following documtents:
        ###
         ${plain_docs}
        ###
        """},
        {"role": "system", "content": "If you cannot answer the question based on this content you will answer with 'Sorry. I cannot help you with your question'."},
        {"role": "user", "content": data.text},
        ])
    return {
        "answer": completion.choices[0].message.content,
        "documents": [doc["metadata"] for doc in docs]
    }



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