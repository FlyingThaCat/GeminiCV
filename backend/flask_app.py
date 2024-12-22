import os
import random
import string
from flask import Flask, make_response, request, jsonify, send_file
import json
from werkzeug.utils import secure_filename
from flask_cors import CORS
from RAGutils import *
from dotenv import load_dotenv
load_dotenv()

ALLOWED_EXTENSIONS = set(['pdf'])
UPLOAD_FOLDER = '.data/'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024 # 10MB
CORS(app)
user_histories={}

if not os.path.exists("data"):
    os.makedirs("data")
if not os.path.exists("vector_db"):
    os.makedirs("vector_db")

def allowedFile(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def fileUpload():
    if len(os.listdir("data")) > 0:
        resp = jsonify({'message' : 'A file already exists in the data directory'})
        resp.status_code = 400
        return resp
    else:
        if 'file' not in request.files:
            resp = jsonify({'message' : 'No file part in the request'})
            resp.status_code = 400
            return resp
        file = request.files['file']
        if file.filename == '':
            resp = jsonify({'message' : 'No file selected for uploading'})
            resp.status_code = 400
            return resp
        if file and allowedFile(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            resp = jsonify({'message' : 'File successfully uploaded'})
            resp.status_code = 201
            load_pdf_create_vector("data")
            getUserInfo()
            generateResetCode()
            return resp
        else:
            resp = jsonify({'message' : 'Allowed file types pdf'})
            resp.status_code = 400
            return resp

@app.route("/chat_gemini", methods=["POST"])
def chat():
    data = request.get_json()
    current_user = data.get("username", "")
    user_input = data.get("input_text", "")
    if not user_input or not current_user:
        return jsonify({"error": "No input provided"}), 400
    
    if current_user not in user_histories:
        user_histories[current_user] = []
    
    response = get_response_final(user_input)
    user_histories[current_user].append(f"user: {user_input}")
    user_histories[current_user].append(f"model: {response}")
    
    return jsonify({
        "response": response,
        "history": user_histories[current_user]
    }), 200

@app.route("/history", methods=["GET"])
def main():
    current_user = request.args["username"]
    print(current_user)
    history = user_histories.get(current_user, "")
    return jsonify({"user": current_user, "history": history}), 200

@app.route("/status", methods=["GET"])
def status():
    # check if pdf is exist on data folder and check if vector_db had file
    if os.path.exists("data") and os.path.exists("vector_db"):
        # check if vector_db and data is empty if not return ready
        if len(os.listdir("data")) > 0 and len(os.listdir("vector_db")) > 0:
            return jsonify({"status": "Ready"}), 200
        else:
            return jsonify({"status": "Not Ready"}), 200
    return jsonify({"status": "Not Ready"}), 200

@app.route("/info", methods=["GET"])
def get_info():
    if not os.path.exists("data/info.json"):
        return jsonify({"status": "setup needed"}), 404
    with open("data/info.json", "r") as f:
        info = json.load(f)
    return jsonify(info), 200

@app.route("/")
def get_history():
    return jsonify({"Status" : "Success"}), 200

@app.route("/cv", methods=["GET"])
def get_cv():
    # check if pdf is exist on data folder and check if vector_db had file
    if os.path.exists("data") and os.path.exists("vector_db"):
        # check if vector_db and data is empty if not return ready
        if len(os.listdir("data")) > 0 and len(os.listdir("vector_db")) > 0:
            #find the file
            for file in os.listdir("data"):
                if file.endswith(".pdf"):
                    response = make_response(send_file("data/"+file, as_attachment=True))
                    response.headers['Content-Type'] = 'application/pdf'
                    response.headers['Content-Disposition'] = \
                        'inline; filename=%s.pdf' % 'yourfilename'
                    return response

@app.route("/reset", methods=["POST"])
def reset():
    # check form
    data = request.get_json()
    reset_code = data.get("reset_code", "")
    if not reset_code:
        return jsonify({"error": "No reset code provided"}), 400
    # check if reset code is correct
    with open("data/reset_code.txt", "r") as f:
        correct_reset_code = f.read()
    if reset_code != correct_reset_code:
        return jsonify({"error": "Reset code is incorrect"}), 400
    
    #remove data folder and vector_db folder content
    for file in os.listdir("data"):
        os.remove(os.path.join("data", file))
    for file in os.listdir("vector_db"):
        os.remove(os.path.join("vector_db", file))
    return jsonify({"message": "Reset successful"}), 200

def getUserInfo():
    info = get_response_final("namanya siapa, bidangnya apa, tentang dia, edukasinya, linkedinnya, githubnya, emailnya, teleponnya, dan apa instagramnya",type="user")
    # process the information
    info = info.replace("```json","").replace("```","")
    info = json.loads(info)
    # write the information to a file on the data folder
    with open("data/info.json", "w") as f:
        json.dump(info, f)

def generateResetCode() :
    # reset code by generating a random string
    reset_code =  ''.join(random.choices(string.ascii_uppercase + string.digits, k = 18))
    # write the reset code to a file
    with open("data/reset_code.txt", "w") as f:
        f.write(reset_code)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
