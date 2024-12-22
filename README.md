# PLEASE USE PYTHON <= 3.12.8 !!!!
https://www.python.org/downloads/release/python-3128/

add .env to backend/ and the format is

```
GOOGLE_API_KEY="XXXXXXXXXXXXXXXXXXXXXXXX"
FLASK_APP=flask_app.py
```


after that
open terminal or cmd on the project dir

```
Windows 
cd backend
python3 -m venv venv
venv/Scripts/activate.ps1 ????
pip3 install -r requirements.txt
flask --app flask_app.py run

Linux and Mac
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
flask --app flask_app.py run
```

make sure its running and after that 
1. download nodejs
2. open cmd again to the project dir
```
windows, linux, mac
cd frontend
npm i
npm run start
```

done
