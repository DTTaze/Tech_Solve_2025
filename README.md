# TECHSOLVE 2025

Protect the environment

## Installation

1. Install this project with npm

```bash
  cd .\BACKEND\
  npm install
```

```bash
  cd .\FRONTEND\
  npm install
```

2. Setup secret files
   - Create `config.json` which is based on `config.json.example` in folder config
   - Create `.env` which is based on `.env.example` in folder BACKEND
3. Create a project on google console cloud

## Environment Variables

To run this project, you will need to copy `.env.example` and config it to match with your setting. Finally, change its name to `.env`

## Deployment

<h4>To deploy this project with docker</h4>
<h5>You need to open docker first</h5>
Then check your current path and go to BACKEND if you are in TECHSOLVE_2025

```bash
  cd .\BACKEND\
  npm run du
```

<h5>Using this when you want to remove volume</h5>

```bash
  cd .\BACKEND\
  npm run ddv
```

<h4>To deploy this project in localhost</h4>

**FRONTEND**

```bash
  cd .\FRONTEND\
  npm run dev
```

**BACKEND**

```bash
  cd .\BACKEND\
  npm start
```

**Open your browser and navigate to:**
[FRONTEND](http://localhost:5173)
[BACKEND](http://localhost:6060)
[DATABASE](http://localhost:8080)
