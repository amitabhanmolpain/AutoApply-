import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from parsers.resume_parser import ResumeParser

resume_bp = Blueprint("resume", __name__, url_prefix="/api/resume")

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc"}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

parser = ResumeParser()


def _allowed(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@resume_bp.route("/upload", methods=["POST"])
def upload_resume():
    """
    POST /api/resume/upload
    Body: multipart/form-data  { file: <resume.pdf|docx> }
    Returns: parsed resume JSON
    """
    if "file" not in request.files:
        return jsonify({"error": "No file in request. Send field named 'file'."}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    if not _allowed(file.filename):
        return jsonify({"error": "Only PDF and DOCX files are supported."}), 415

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    try:
        result = parser.parse(save_path)
        return jsonify({
            "success": True,
            "data": result.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up uploaded file after parsing
        if os.path.exists(save_path):
            os.remove(save_path)


@resume_bp.route("/parse-bytes", methods=["POST"])
def parse_bytes():
    """
    POST /api/resume/parse-bytes
    Body: multipart/form-data { file: <resume> }
    Parses directly from memory — no disk write.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file provided."}), 400

    file = request.files["file"]
    if not _allowed(file.filename):
        return jsonify({"error": "Only PDF and DOCX files are supported."}), 415

    try:
        file_bytes = file.read()
        result = parser.parse(file_path=file.filename, file_bytes=file_bytes)
        return jsonify({"success": True, "data": result.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500