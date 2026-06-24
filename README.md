---

# 🍔 FoodVice – Food Discovery & Community Platform

FoodVice is a **full-stack food discovery and community application** built as a semester project. It combines restaurant discovery, social engagement, and AI-powered recommendations into one platform. Designed with **clean architecture** on the backend, it demonstrates scalable system design and modern development practices.

---
## 🔗 Live Link

https://food-vice-d9gy.vercel.app

---

## 🚀 Key Features
- **Restaurant Discovery with Google Maps** – Interactive map-based search with filters for cuisine, rating, and distance.  
- **AI Recommendations** – Personalized food and restaurant suggestions powered by integrated AI services.  
- **Chatbot Assistant** – Conversational interface to guide users in exploring restaurants and communities.  
- **Food Reels** – Short food-related videos with likes, comments, shares, and saves.  
- **Community Forums** – Join communities, create threads, share recipes, and discuss food culture.  
- **Moderation Module** – Tools for moderators to approve/reject posts, manage communities, and maintain quality.  
- **Admin Module** – Administrative dashboards for managing users, restaurants, and system analytics.  
- **Profiles & Reviews** – User trust scores, badges, saved restaurants, and review tracking.  

---

## 🛠️ Tech Stack
- **Frontend:** React + TypeScript, Vite, TailwindCSS  
- **Backend:** Node.js, Express.js, Clean Architecture  
- **Database:** MongoDB with GeoSpatial Queries
- **Storage:** Firebase
- **Authentication:** JWT, Google OAuth  
- **APIs:** Google Maps API,Groq API
- **Deployment:** Vercel (Frontend), Railway (Backend)  

---

## 📂 Project Structure

### Frontend
```
frontend/
│── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level views (Explore, Reels, Community, Profile)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API calls and integrations
│   ├── context/          # Global state management
│   └── assets/           # Images, icons, styles
│── public/
│── package.json
```

### Backend (Clean Architecture)
```
backend/
│── src/
│   ├── domain/           # Core business logic (entities, repositories, services)
│   ├── application/      # Use cases (AI recommendations, moderation workflows)
│   ├── infrastructure/   # Database, external APIs, Express server
│   ├── adapters/         # Controllers, routes, middleware
│   └── config/           # Environment, constants
│── tests/                # Unit and integration tests
│── package.json
```

---

## 🏰 Architecture Diagram

<img width="782" height="1351" alt="Architecture Diagram drawio" src="https://github.com/user-attachments/assets/42403810-98d7-45d2-968f-098c721ad8f6" />

---

## 💡 Key decisions

### Why Clean Architecture?

Adopted Clean Architecture to prevent controllers becoming bloated with buisness logic, enabling infrastructure swaps without touching the business logic, loose coupling as use cases become easily testable without the database and clear ownership as each file serves a single purpose


### Why cursor pagination over offset?

As FoodVice restaurant,review and reel listings will grow to thousands of entries.Offset-based pagination  degrades as offset grows, moreover the result remain stable as new insertions mid pagination can shift pages and since UI is also based on infinite scroll and load more style so cursor pagination makes more sense.

---


## 📸 Screenshots

### Sign-Up Page  

<img width="1911" height="975" alt="Screenshot 2026-06-08 105642" src="https://github.com/user-attachments/assets/5312c10f-b831-4955-a421-691768df8b1e" />

### Home Page

<img width="584" height="973" alt="Screenshot 2026-06-08 105317" src="https://github.com/user-attachments/assets/db82fe87-980f-493d-a405-f6265a7d085d" />


### User Profile  

<img width="934" height="971" alt="Screenshot 2026-06-08 105523" src="https://github.com/user-attachments/assets/6502975f-e5a9-4a71-a2c7-cb7a2c48d3c2" />

### Community Section  

<img width="1911" height="972" alt="Screenshot 2026-06-08 105408" src="https://github.com/user-attachments/assets/713b2e27-c7f9-43ea-8261-2099e068559b" />

<img width="1903" height="971" alt="Screenshot 2026-06-08 105424" src="https://github.com/user-attachments/assets/c1cf8a4e-5e98-4675-a102-2b021ec11894" />




### Reels Section  

<img width="1912" height="971" alt="Screenshot 2026-06-08 105356" src="https://github.com/user-attachments/assets/72803a2b-c81e-4812-8fba-512fd4d63a90" />

### Restaurant Discovery  

<img width="1903" height="971" alt="Screenshot 2026-06-08 105330" src="https://github.com/user-attachments/assets/8553e1ba-c6b7-4fa3-8f4c-4b59e2f6c484" />

<img width="1907" height="970" alt="Screenshot 2026-06-08 105339" src="https://github.com/user-attachments/assets/c671f836-9f52-4e82-bcca-084dbf62cc2b" />

---

## 📖 How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/codesbymusab/FoodVice.git
   ```
2. Install dependencies:
   ```bash
   cd food-vice
   cd food-vice/frontend && npm install
   cd food-vice/backend && npm install
   ```
3. Run frontend:
   ```bash
   npm run dev
   ```
4. Run backend:
   ```bash
   npm start
   ```
5. Open the app at `http://localhost:5173`.

---

## 🎯 Future Improvements
- **Mobile App Version** (Flutter) for cross-platform access.  
- **Advanced AI Recommendations** using collaborative filtering and sentiment analysis.  
- **Analytics Dashboard** for admins to track engagement and restaurant performance.  
- **Gamification** – badges, levels, and rewards for active users.  
- **Notifications** - reale time notifications of activities,replies and gamification
---

## 👨‍💻 Contributors
- **Muhammad Musab** – Developer & Architect  
- **Muhammad Sanaan** - Contributor

---

## 📜 License
This project is open-source and available under the MIT License.

---
