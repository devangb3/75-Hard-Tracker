# Deployment Instructions

## URLs

- **Frontend:**  
  [https://hard-tracker-frontend-75-424176252593.us-west1.run.app/](https://hard-tracker-frontend-75-424176252593.us-west1.run.app/)

- **Backend:**  
  [https://hard-tracker-backend-75-424176252593.us-west1.run.app/](https://hard-tracker-backend-75-424176252593.us-west1.run.app/)

---

## Steps to Deploy

### 1. Update API Base URL

Edit the following file:

- `frontend/src/services/api.js`

Set:
```js
const API_BASE_URL = "https://hard-tracker-backend-75-424176252593.us-west1.run.app";
```

---

### 2. Deploy Frontend

Run:
```sh
gcloud run deploy hard-tracker-frontend-75 \
  --source . \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated
```

---

### 3. Deploy Backend

Replace `YOUR_MONGO_DB_CONNECTION_STRING` with your actual MongoDB connection string.

Run:
```sh
gcloud run deploy hard-tracker-backend-75 \
  --source . \
  --platform managed \
  --region us-west1 \
  --allow-unauthenticated \
  --set-env-vars="MONGO_URI=YOUR_MONGO_DB_CONNECTION_STRING"
```

---


