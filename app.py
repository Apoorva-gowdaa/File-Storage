from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

CORS(app)

# ======================================
# FOLDERS
# ======================================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ======================================
# HOME
# ======================================

@app.route("/")
def home():
    return jsonify({
        "message": "DriveSphere Backend Running"
    })

# ======================================
# CREATE FOLDER
# ======================================

@app.route("/create-folder", methods=["POST"])
def create_folder():

    data = request.get_json()

    folder_name = data.get("name")

    if not folder_name:
        return jsonify({
            "error": "Folder name required"
        }), 400

    folder_path = os.path.join(
        UPLOAD_FOLDER,
        folder_name
    )

    os.makedirs(folder_path, exist_ok=True)

    return jsonify({
        "message": "Folder created successfully"
    })

# ======================================
# GET FOLDERS
# ======================================

@app.route("/folders", methods=["GET"])
def get_folders():

    folders = []

    for item in os.listdir(UPLOAD_FOLDER):

        full_path = os.path.join(
            UPLOAD_FOLDER,
            item
        )

        if os.path.isdir(full_path):

            folders.append({
                "name": item
            })

    return jsonify(folders)

# ======================================
# UPLOAD FILE
# ======================================

@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({
            "error": "No file selected"
        }), 400

    file = request.files["file"]

    folder = request.form.get(
        "folder",
        ""
    )

    if folder == "":
        return jsonify({
            "error": "Folder required"
        }), 400

    folder_path = os.path.join(
        UPLOAD_FOLDER,
        folder
    )

    os.makedirs(
        folder_path,
        exist_ok=True
    )

    filename = secure_filename(
        file.filename
    )

    file.save(
        os.path.join(
            folder_path,
            filename
        )
    )

    return jsonify({
        "message": "File uploaded"
    })

# ======================================
# GET FILES
# ======================================

@app.route("/files", methods=["GET"])
def get_files():

    all_files = []

    for folder in os.listdir(
        UPLOAD_FOLDER
    ):

        folder_path = os.path.join(
            UPLOAD_FOLDER,
            folder
        )

        if os.path.isdir(folder_path):

            for file in os.listdir(
                folder_path
            ):

                file_path = os.path.join(
                    folder_path,
                    file
                )

                size = round(
                    os.path.getsize(
                        file_path
                    ) / 1024,
                    2
                )

                all_files.append({
                    "name": file,
                    "folder": folder,
                    "size": size
                })

    return jsonify(all_files)

# ======================================
# DOWNLOAD FILE
# ======================================

@app.route(
    "/download/<folder>/<filename>",
    methods=["GET"]
)
def download_file(
    folder,
    filename
):

    folder_path = os.path.join(
        UPLOAD_FOLDER,
        folder
    )

    return send_from_directory(
        folder_path,
        filename,
        as_attachment=True
    )

# ======================================
# DELETE FILE
# ======================================

@app.route(
    "/delete-file",
    methods=["POST"]
)
def delete_file():

    data = request.get_json()

    folder = data.get("folder")
    filename = data.get("filename")

    file_path = os.path.join(
        UPLOAD_FOLDER,
        folder,
        filename
    )

    if os.path.exists(file_path):

        os.remove(file_path)

        return jsonify({
            "message": "File deleted"
        })

    return jsonify({
        "error": "File not found"
    }), 404

# ======================================
# DELETE FOLDER
# ======================================

@app.route(
    "/delete-folder",
    methods=["POST"]
)
def delete_folder():

    data = request.get_json()

    folder = data.get("folder")

    folder_path = os.path.join(
        UPLOAD_FOLDER,
        folder
    )

    if os.path.exists(folder_path):

        try:

            for root, dirs, files in os.walk(
                folder_path,
                topdown=False
            ):

                for file in files:

                    os.remove(
                        os.path.join(
                            root,
                            file
                        )
                    )

                for d in dirs:

                    os.rmdir(
                        os.path.join(
                            root,
                            d
                        )
                    )

            os.rmdir(folder_path)

            return jsonify({
                "message": "Folder deleted"
            })

        except Exception as e:

            return jsonify({
                "error": str(e)
            })

    return jsonify({
        "error": "Folder not found"
    }), 404

# ======================================
# STORAGE STATS
# ======================================

@app.route(
    "/storage",
    methods=["GET"]
)
def storage_stats():

    total_size = 0
    total_files = 0
    total_folders = 0

    for folder in os.listdir(
        UPLOAD_FOLDER
    ):

        folder_path = os.path.join(
            UPLOAD_FOLDER,
            folder
        )

        if os.path.isdir(folder_path):

            total_folders += 1

            for file in os.listdir(
                folder_path
            ):

                total_files += 1

                file_path = os.path.join(
                    folder_path,
                    file
                )

                total_size += (
                    os.path.getsize(
                        file_path
                    ) / 1024
                )

    return jsonify({

        "totalFiles":
            total_files,

        "totalFolders":
            total_folders,

        "storageUsed":
            round(
                total_size,
                2
            )

    })

# ======================================
# RUN
# ======================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )