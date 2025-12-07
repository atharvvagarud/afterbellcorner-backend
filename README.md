 # After Bell Corner – Express.js Backend

This repository contains the backend API for **After Bell Corner**, a full-stack web application built for booking after-school classes.  

The backend is built using **Node.js**, **Express.js**, and **MongoDB Atlas**.

It handles:
- Fetching lessons  
- Creating orders  
- Updating lesson availability  
- Connecting securely to MongoDB  
- CORS-restricted API access for the Vue.js frontend

---

## 🚀 Live API (Render Deployment)

Base URL:  
**https://afterbellcorner-backend.onrender.com**

---

## 🔧 Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **CORS**
- **Render.com** (deployment)

---

## 🔐 CORS Configuration 

This backend is **not open to every domain** — it explicitly allows only:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://atharvvagarud.github.io"
];
```

## 📚 Author

Atharva Pravin Garud | BSc (Hons) Computer Science @ Middlesex University London
