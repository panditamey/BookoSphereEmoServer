
import uvicorn
from fastapi import FastAPI, File, UploadFile
import numpy as np
import pickle
import pandas as pd
from pydantic import BaseModel
from utils.functions import *
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences
from keras.preprocessing import image
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from io import BytesIO
from PIL import Image
import requests
import cv2
import os

# Uncomment the below code to download the model files from google drive
# EMOTEXT_URL="https://drive.google.com/file/d/1w3C30gSNoTaNfUPqOBGaV271M4OCJy6s/view?usp=sharing"
# EMOIMAGE_URL="https://drive.google.com/file/d/13Wv7pHeCgJYlykDk83oP-bcF1WcuMUGD/view?usp=sharing"
# TOKENIZER_URL="https://drive.google.com/file/d/1KF9xlhb-qNkLNsxLnpyb63Z1QxvAyzUw/view?usp=drive_link"

# gdown.download(EMOTEXT_URL, 'emotionNLP.h5', quiet=False,fuzzy=True)
# gdown.download(EMOIMAGE_URL, 'imageModel.h5', quiet=False,fuzzy=True)
# gdown.download(TOKENIZER_URL, 'tokenizer.pkl', quiet=False,fuzzy=True)

class Prompt(BaseModel):
    prompt : str

app = FastAPI()
# origins = [
#     "http://localhost",
#     "http://localhost:8000",
# ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



nlpmodel_loaded=load_model('./emotionNLP.h5')
imagemodel_loaded=load_model('./imageModel.h5')
tokenizer = Tokenizer(oov_token='UNK')
le = LabelEncoder()

# Load the tokenizer from the file
with open('./tokenizer.pkl', 'rb') as tokenizer_file:
    loaded_tokenizer = pickle.load(tokenizer_file)

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.get('/')
def status():
    return {'Hello, I am working well!'}


@app.post('/textpredict')
def predicttext(prompt: Prompt):
    # print(prompt.prompt)
    sentence = normalized_sentence(prompt.prompt)
    sentence = loaded_tokenizer.texts_to_sequences([sentence])
    sentence = pad_sequences(sentence, maxlen=229, truncating='pre')
    val = nlpmodel_loaded.predict(sentence)
    classes = ["anger", "fear", "happy", "love", "sadness", "surprise"]
    res = classes[np.argmax(val)]
    return {"status": "success","emotion": res, "prompt": prompt.prompt}

@app.post('/imagepredict')
async def predictimage(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        with open(file.filename, 'wb') as f:
            f.write(contents)
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()
    classes=['Angry','Disgusted','Fearful','Happy','Sad','Neutral','Surprised']
    img=image.load_img(str(file.filename),target_size=(224,224))
    x=image.img_to_array(img)
    x=x/255
    img_data=np.expand_dims(x,axis=0)
    prediction = imagemodel_loaded.predict(img_data)
    predictions = list(prediction[0])
    max_num = max(predictions)
    index = predictions.index(max_num)
    print(classes[index])
    os.remove(str(file.filename))
    return {"status": "success","emotion":classes[index]}


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)
    
#uvicorn app:app --reload