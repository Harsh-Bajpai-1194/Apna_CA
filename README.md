# 🧾 Apna CA

Author - HARSH BAJPAI  
  
Created on 11-10-2025  
**Apna Chartered Accountant** is a simple **Full-Stack Web project** built using **HTML, CSS, JavaScript, MERN, Render and Vercel App**.  
It showcases a professional online CA service website with sections for services, a tax calculator, and a contact form.  
Perfect for beginners who want to practice basic web development concepts.

---

## 🌐 Live Preview

You can host this on **GitHub Pages**, **Vercel**, or **Netlify** for free.  
Example URL after deployment:
```
https://Harsh-Bajpai-1194.github.io/apna-CA/
```

---

## 📁 Project Structure
```
Apna_CA_MERN/
├── client/                      # Frontend (React)
│   ├── public/
│   │   └── assets/              # Moved from root assets/
│   │       └── home_page.png
│   ├── src/
│   │   ├── components/          # Reusable UI parts (navbars, footers)
│   │   ├── pages/               # Converted from templates/
│   │   │   ├── Dashboard.jsx    # formerly dashboard.html
│   │   │   ├── Home.jsx         # formerly index.html
│   │   │   ├── Login.jsx        # formerly login.html + login.js
│   │   │   ├── Main.jsx         # formerly main.html
│   │   │   ├── Profession.jsx   # formerly profession.html
│   │   │   └── Register.jsx     # formerly register.html
│   │   ├── App.css              # formerly static/index.css
│   │   ├── App.jsx              # Main React component & Routing
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── package.json             # Client dependencies
│   └── vite.config.js           # (If using Vite)
│
├── server/                      # Backend (Node/Express)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/             # Logic moved from app.py functions
│   ├── models/                  # MongoDB Schemas (Data structure)
│   ├── routes/                  # API endpoints (converted from @app.route)
│   ├── .env                     # Secrets (DB URI, JWT secret)
│   ├── index.js                 # Main server entry point (formerly app.py)
│   └── package.json             # Server dependencies
│
├── .gitignore
├── README.md
└── package.json                 # (Optional) Root script to run both client/server
```

---

## 🧩 Features
✅ Responsive landing page  
✅ Professional CA services section  
✅ Income Tax Calculator (for Indian slabs)  
✅ Contact form with JS validation  
✅ Smooth scroll and clean UI design  

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Harsh-Bajpai-1194/apna-ca.git
```

### 2️⃣ Open the project
```bash
cd apna-ca
```

### 3️⃣ Run locally
Run these commands in VS Code Terminal
```terminal
# 1. Go into the client folder
cd client

# 2. Install the dependencies (this installs Vite)
npm install

# 3. Go back to the root folder
cd ..

# 4. Try running the app again
npm run dev
```
Then open 👉 [http://localhost:5173/](http://localhost:5173/)

---

## 🧮 Tax Calculator Logic
Tax slabs used (simplified for FY 2024-25):

|   Income Range (₹)    |  Tax Rate  |
|-----------------------|------------|
| Up to ₹2,50,000       |    0%      |
| ₹2,50,001 – ₹5,00,000 |    5%      |
| ₹5,00,001 – ₹10,00,000|    20%     |
| Above ₹10,00,000      |    30%     |

The logic is implemented in `script.js`.

---

## 🖌️ UI Design
- **Primary Color:** Dark Green `#004d40`  
- **Accent:** Teal `#00796b`  
- **Font:** Poppins (Google Fonts)  
- **Style:** Clean, modern, responsive  

---

## 📬 Contact Form
The contact form currently shows an alert message on submit.  
You can connect it to **EmailJS** or **Google Sheets API** to store or send real responses.

---

## 🧠 Future Enhancements
- GST Calculator  
- Chart.js income visualization  
- Login/Register (frontend mock)  
- Dark mode toggle  
- Hosting with real domain  

---

## 💻 Technologies Used
- **HTML5** – Structure  
- **CSS3** – Layout & Styling  
- **JavaScript (Vanilla)** – Interactivity  

---

## 👨‍💼 About
Created by **Harsh Bajpai**  
For demo, practice, and portfolio purposes.

If you like this project, give it a ⭐ on GitHub!

---

### 📸 Preview
![Apna_CA_Website_Screenshot](./client/public/assets/home_page.png)
---


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
