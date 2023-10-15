import requests
import w3storage
import io
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhjOTIwNjVDNTgxMDUyNDI0NjNmOUFDNDYxREJkNkMwNTlkMDRlOWUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTcxMjgwODY3MjEsIm5hbWUiOiJST1NQTCJ9.eq5f2IsDCV7AJ5A5uY5ks1vDGVUBrlXt3bClzOq3I4A"
w3 = w3storage.API(token=TOKEN)
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content
image_bytes = query({
    "inputs": "Harry Potter and the Sorcerer's Stone",
})
imagecid = w3.post_upload(io.BytesIO(image_bytes))
imagecid_url = "https://"+imagecid+".ipfs.w3s.link"