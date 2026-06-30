# 🌍 CivicOS: AI-Powered Community Intelligence Layer

<div align="center">
  <img src="https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/Gemini-2.5_Flash-blue?style=for-the-badge" alt="AI Agent"/>
  <img src="https://img.shields.io/badge/Java-Spring_Boot-green?style=for-the-badge" alt="Backend"/>
  <img src="https://img.shields.io/badge/React-TypeScript-blue?style=for-the-badge" alt="Frontend"/>
  <img src="https://img.shields.io/badge/PostgreSQL-PostGIS-336791?style=for-the-badge" alt="DB"/>
</div>

<br>

**CivicOS** transforms traditional map infrastructure into a living, intelligent digital twin of the city. By combining hyper-local civic reporting, crowdsourced verification, and an advanced 8-Agent AI Architecture powered by **Google Gemini 2.5 Flash**, CivicOS helps citizens navigate smarter and authorities resolve issues faster.

---

## 🚀 The Dual Ecosystem

CivicOS is built as a complete, end-to-end ecosystem featuring two distinct applications:

### 1. 📱 Citizens App (Mobile-First Web App)
A high-fidelity navigation and reporting interface designed with Google Maps-style paradigms.
- **Smart Navigation:** Intelligent routing that actively avoids high-risk infrastructure zones.
- **Civic Reporting:** Users can quickly capture photos and report potholes, flooding, garbage, etc.
- **Community Verification:** Gamified system where users earn "Community Hero" points for verifying nearby issues.
- **Predictive AI Heatmaps:** WebGL-powered predictive overlay forecasting future infrastructure decay.

### 2. 🏛️ Authority Command Center (Desktop Dashboard)
A sleek, dark-mode B2B command center for municipal authorities and city planners.
- **Live AI Intel Feed:** Real-time stream of incoming issues categorized by severity and AI Confidence.
- **City Health Metrics:** Aggregated impact analysis showing resolution rates and critical bottlenecks.
- **Gemini Resolution Engine:** One-click AI generation of step-by-step dispatch plans, cost estimates, and required resources for any given issue.

---

## 🧠 AI Agent Architecture (Powered by Gemini)

CivicOS utilizes an event-driven AI pipeline in the Spring Boot backend:

1. **Categorization Agent:** Analyzes incoming text/image reports to assign Severity (Low to Critical).
2. **Priority & Impact Agent:** Calculates an `aiConfidence` score and estimates population impact.
3. **Verification Agent:** Dynamically calculates Trust Scores based on crowdsourced upvotes/downvotes.
4. **Resolution Agent (Dashboard):** Generates specialized repair workflows for city dispatch teams based on infrastructure data.

---

## 🛠️ Tech Stack

* **Frontend (Citizens):** React, TypeScript, Vite, Zustand, TailwindCSS, MapLibre GL
* **Frontend (Command Center):** React, TypeScript, TailwindCSS, Recharts, Lucide Icons
* **Backend:** Java 21, Spring Boot 3, Spring Data JPA
* **Database:** PostgreSQL with PostGIS extension for geospatial querying
* **AI:** Google Gemini 2.5 Flash API
* **Infrastructure:** Docker & Docker Compose

---

## 🚦 How to Run Locally

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Maven / Java 21

### 1. Start the Database
The project includes a massive pre-generated dataset of 5,000 synthetic civic issues across India for testing.
```bash
docker-compose up -d
```
*(This will start PostgreSQL/PostGIS and automatically seed the database on port 5432).*

### 2. Start the Unified Server (Spring Boot + Built React Apps)
The entire React frontend (both Citizens App and Authority Dashboard) has been compiled and injected directly into the Spring Boot static resources. You only need to run the backend!

Ensure you have your Gemini API key ready in `backend/src/main/resources/application.yml` (or via environment variables).
```bash
cd backend
./mvnw spring-boot:run
```

**That's it! Access the ecosystem:**
*   **Landing Page:** `http://localhost:8080/`
*   **Citizens App:** `http://localhost:8080/citizens/`
*   **Authority Command Center:** `http://localhost:8080/admin/`

*(Note: The frontends are heavily fortified with offline fallbacks. Even if the database or Gemini API goes down during a live demo, the UI will seamlessly switch to local mock data without crashing!)*

---

## 🏆 Hackathon Alignment (Community Hero)
This project was built specifically for the **Hyperlocal Problem Solver** track, demonstrating profound agentic depth and creative usage of Google Technologies (Gemini, Maps UI paradigms) to solve real-world municipal reporting fragmentation.
