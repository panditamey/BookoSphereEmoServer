import os
import google.generativeai as palm
from dotenv import load_dotenv
import w3storage
from fpdf import FPDF
import io 
from gtts import gTTS 

load_dotenv()

def generate():
    TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhjOTIwNjVDNTgxMDUyNDI0NjNmOUFDNDYxREJkNkMwNTlkMDRlOWUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTcxMjgwODY3MjEsIm5hbWUiOiJST1NQTCJ9.eq5f2IsDCV7AJ5A5uY5ks1vDGVUBrlXt3bClzOq3I4A"
    w3 = w3storage.API(token=TOKEN)
    palm.configure(api_key="AIzaSyAUfPsa_F6RlaXH3-z3Nkd46R8fFvYzu1o")
    response =  palm.generate_text(prompt="Write a book on mumbai in 10 words with 5 chapters.")
    text = response.result
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 15)

    pdf.multi_cell(0, 10, txt=text)
    pdf_buffer = io.BytesIO()
    pdf_buffer.write(pdf.output(dest='S').encode('latin1'))
    pdf_buffer.seek(0)
    


    pdfcid = w3.post_upload(pdf_buffer)
    print(f"Uploaded PDF with CID: {pdfcid}")

    myobj = gTTS(text=text, lang='en', slow=False)
    mp3_buffer = io.BytesIO()
    myobj.write_to_fp(mp3_buffer)
    mp3_buffer.seek(0)
    mp3cid = w3.post_upload(mp3_buffer)
    print(f"Uploaded MP3 with CID: {mp3cid}")
    return pdfcid, mp3cid



generate()



