# Setup

## Backend
Open PowerShell:
```powershell
cd D:\Dream-Education\backend
.\venv\Scripts\Activate.ps1
python app.py
```
If you don't have a virtual environment yet:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Frontend
Open a second terminal:
```powershell
cd D:\Dream-Education\frontend
npm install
npm run dev
```

Back up your existing database before running any schema/seed scripts. Compare these reconstructed files with your local project before replacing anything.
