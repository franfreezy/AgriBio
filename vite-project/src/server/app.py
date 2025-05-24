from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path
import sys
import os

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from utils.etl_processor import ETLProcessor

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ETL processor
UPLOAD_DIR = Path("uploads")
PROCESSED_DIR = Path("processed")
etl = ETLProcessor(str(UPLOAD_DIR), str(PROCESSED_DIR))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle file upload and ETL processing"""
    try:
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Get file type from filename
        file_type = "crop_survey"  # Default type, you can determine this based on file naming convention
        required_columns = etl.get_required_columns(file_type)
        
        # Process the file
        result = etl.process_file(str(file_path), required_columns)
        
        return result

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
