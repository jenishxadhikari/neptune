import io
import os
from pydub import AudioSegment
from datetime import datetime

from fastapi import FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from modules.build import build_fingerprint_from_youtube, insert_hashes_to_db
from modules.query import query_recording_api

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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

@app.post("/identify")
async def identify(audio: UploadFile = File(...)):
    # Save as mono WAV
    os.makedirs("recordings", exist_ok=True)
    audio_bytes = await audio.read()
    audio_stream = io.BytesIO(audio_bytes)
    try:
        sound = AudioSegment.from_file(audio_stream)
        sound = sound.set_channels(1)
        filename = f"recordings/{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
        sound.export(filename, format="wav")
    except Exception as e:
        return {"error": f"Audio conversion failed: {str(e)}"}

    # Database connection params (customize as needed)
    db_params = {
        "dbname": os.getenv("DATABASE_NAME"),
        "user": os.getenv("DATABASE_USER"),
        "password": os.getenv("DATABASE_PASSWORD"),
        "host": os.getenv("DATABASE_HOST"),
        "port": os.getenv("DATABASE_PORT")
    }

    # Query the database for matches
    try:
        result = query_recording_api(filename, db_params, top_n=5)
        return JSONResponse(result)
        # return JSONResponse({"message": "File received"})
    except Exception as e:
        return JSONResponse({"error": f"Query failed: {str(e)}"}, status_code=500)
    finally:
        # Remove the file after processing
        try:
            if os.path.exists(filename):
                os.remove(filename)
        except Exception as cleanup_error:
            # Optionally log this error
            pass

@app.post("/fingerprint")
async def fingerprint_audio(
    song_id: str = Form(...),
    youtube_url: str = Form(...)
):
    """
    Generates fingerprints from a YouTube URL and stores them in DB.
    """
    try:
        hashes = build_fingerprint_from_youtube(youtube_url)
        if not hashes:
            raise HTTPException(status_code=400, detail="No fingerprints generated")

        db_params = {
            "dbname": os.getenv("DATABASE_NAME"),
            "user": os.getenv("DATABASE_USER"),
            "password": os.getenv("DATABASE_PASSWORD"),
            "host": os.getenv("DATABASE_HOST"),
            "port": os.getenv("DATABASE_PORT")
        }

        insert_hashes_to_db(hashes, song_id, db_params)
        return JSONResponse({"status": "success", "inserted_hashes": len(hashes)})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
