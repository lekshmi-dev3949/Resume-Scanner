import PyPDF2
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        if not text.strip():
            return "ERROR: Could not extract text. PDF may be image-based."
        return text.strip()
    except Exception as e:
        return f"ERROR: {str(e)}"
