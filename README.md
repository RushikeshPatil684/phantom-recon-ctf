# Phantom Recon CTF Challenge

A web-based CTF challenge featuring a hacker-themed interface with terminal unlocking and Nmap command validation.

## Project Structure

```
phantom-recon-ctf/
├── frontend/                 # Static site (Render Static Site)
│   ├── index.html
│   └── assets/
│       ├── css/
│       └── js/
│
├── backend/                  # Flask API (Render Web Service)
│   ├── app.py               # Flask app entry point
│   ├── validator.py         # Nmap validation logic
│   ├── config.py            # PASSWORD + FLAG
│   ├── requirements.txt     # Flask dependencies
│   └── .gitignore
│
└── README.md
```

## Deployment

### Backend (Render Web Service)

1. **Root Directory**: `backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `python app.py`
4. **Environment**: Python 3
5. **Port**: Automatically set by Render via `PORT` environment variable

The backend will run on `0.0.0.0` and use the port provided by Render.

### Frontend (Render Static Site)

1. **Root Directory**: `frontend`
2. **Build Command**: (leave empty or use `echo "Static site"`)
3. **Publish Directory**: `frontend`

**Important**: Update the frontend JavaScript to point to your Render backend URL:

In `frontend/assets/js/terminal.js`, update:
```javascript
const API_BASE_URL = 'https://your-backend-service.onrender.com';
```

## API Endpoints

- `GET /api/ping` - Health check
- `POST /api/unlock` - Unlock terminal with password
- `POST /api/validate` - Validate Nmap command and return flag

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000` by default.

### Frontend

Open `frontend/index.html` in a browser or serve with a static file server.

## Challenge Flow

1. Player decodes Base64 password from frontend source
2. Player unlocks terminal with password
3. Player reconstructs correct Nmap command from hidden fragments
4. Player enters correct command to receive flag

## License

CTF Challenge - Educational Use Only
