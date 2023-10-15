import io
import os
import re
from fpdf import FPDF
import google.generativeai as palm
from dotenv import load_dotenv
from gtts import gTTS
import requests
import w3storage

load_dotenv()

def generate(p):
    TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhjOTIwNjVDNTgxMDUyNDI0NjNmOUFDNDYxREJkNkMwNTlkMDRlOWUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTcxMjgwODY3MjEsIm5hbWUiOiJST1NQTCJ9.eq5f2IsDCV7AJ5A5uY5ks1vDGVUBrlXt3bClzOq3I4A"
    w3 = w3storage.API(token=TOKEN)
    symbol_pattern = r'[^\w\s]' 
    palm.configure(api_key="AIzaSyAUfPsa_F6RlaXH3-z3Nkd46R8fFvYzu1o")
    response =  palm.generate_text(prompt=p+"(write only text without any * # @ ! symbols))")
    text = re.sub(symbol_pattern, '', response.result)

    summary = palm.generate_text(prompt="Summarize in 20 words: "+text)
    summary = re.sub(symbol_pattern, '', summary.result)

    bookName = palm.generate_text(prompt="Give one book name for below book: "+text)
    bookName = re.sub(symbol_pattern, '', bookName.result)

    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.content
    image_bytes = query({
        "inputs": bookName,
    })
    imagecid = w3.post_upload(io.BytesIO(image_bytes))
    imagecid_url = "https://"+imagecid+".ipfs.w3s.link"

    print(f"Uploaded IMAGE with CID: {imagecid_url}")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 15)

    pdf.multi_cell(0, 10, txt=text)
    pdf_buffer = io.BytesIO()
    pdf_buffer.write(pdf.output(dest='S').encode('latin1'))
    pdf_buffer.seek(0)
    pdfcid = w3.post_upload(pdf_buffer)
    pdfcid_url = "https://"+pdfcid+".ipfs.w3s.link"
    print(f"Uploaded PDF with CID: {pdfcid_url}")

    myobj = gTTS(text=text, lang='en', slow=False)
    mp3_buffer = io.BytesIO()
    myobj.write_to_fp(mp3_buffer)
    mp3_buffer.seek(0)
    mp3cid = w3.post_upload(mp3_buffer)
    mp3cid_url = "https://"+mp3cid+".ipfs.w3s.link"
    print(f"Uploaded MP3 with CID: {mp3cid_url}")
    return pdfcid_url, mp3cid_url,imagecid_url, summary,bookName
