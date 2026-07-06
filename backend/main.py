from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from reviewer import review_resume
from pdf_extractor import extract_text_from_pdf
import uvicorn

app = FastAPI(title="Resume Reviewer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/review")
async def review(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    if text.startswith("ERROR"):
        raise HTTPException(status_code=422, detail=text)
    result = review_resume(text)
    return result.model_dump()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
