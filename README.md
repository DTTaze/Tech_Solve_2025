# TECHSOLVE 2025

A brief description of what this project does and who it's for

## Installation

1. Install this project with npm

```bash
  cd .\BACKEND\
  npm install
```

2. Setup secret files
   - Create `config.json` which is based on `config.json.example` in folder config
   - Create `.env` which is based on `config.json.example` in folder BACKEND
3. Create a project on google console cloud
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file, copy the .env.example file and change these properties

`NODE_ENV = development`

`DB_HOST = mysql`

`DB_NAME = techsolve25`

## Deployment

**To deploy this project with docker**
You need to open docker first, then check your current path and go to BACKEND if you are in TECHSOLVE_2025

```bash
  cd .\BACKEND\
  npm run dockerup
```

**Open your browser and navigate to: http://localhost:6060**
