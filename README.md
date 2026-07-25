# QR Advertising Analytics Platform 🚀

A modern, production-ready SaaS application for dynamic QR code generation, physical product packaging tracking, campaign side-by-side ROI comparison, real-time scan analytics, and custom landing page building.

---

## Quickstart & Local Setup in VS Code

### Prerequisites
- Node.js (v18+)
- npm or yarn

---

## 1-Click Turnkey Execution (No MongoDB Required!)

The backend features an **Automated In-Memory MongoDB Fallback**. If you do not have a local MongoDB daemon running, the backend automatically starts an in-memory database and populates sample bottle print campaigns and dynamic QRs out of the box!

### Step 1: Install Dependencies & Start Backend
Open a terminal in VS Code:
```bash
cd backend
npm install
npm run dev
```
*Backend API runs at: `http://localhost:5000`*

### Step 2: Install Dependencies & Start Frontend
Open a second terminal tab in VS Code:
```bash
cd frontend
npm install
npm run dev
```
*Frontend web app runs at: `http://localhost:5173`*

---

## Pre-loaded Demo Accounts

- **Demo Advertiser Account**:
  - Email: `demo@qrads.com`
  - Password: `Password123!`
- **Admin Account**:
  - Email: `admin@qrads.com`
  - Password: `Password123!`

*(You can also use the 1-Click Fast Fill buttons on the Login page!)*

---

## Key Features

1. **Dynamic QR Code Redirection (`/r/:shortCode`)**:
   - Change the destination URL anytime without reprinting physical labels.
   - Automatically logs IP, Geolocation (City/Country), Device, OS, Browser, Referrer, and Timestamp.

2. **Campaign ROI Comparative Dashboard**:
   - Compare multiple advertising channels side-by-side (Bottle Prints vs Packaging Boxes vs Airport Lounges vs Flyers).
   - View Cost Per Scan (CPS), Conversion Rate %, Total Budget, and Reach Ratings.

3. **QR Code Design Studio & Generator**:
   - Custom foreground/background color pickers.
   - Frame styles (Square, Rounded, Dots, Gradient).
   - Embedded brand logo inside QR canvas.
   - Download in PNG, SVG, PDF format.
   - Bulk CSV QR Generator.

4. **Custom Landing Page Builder**:
   - Modular builder for custom promo pages.
   - Interactive live mobile phone preview.

5. **AI Advertising Insights Engine**:
   - Natural language statistical recommendations (peak scan hours, regional surges, mobile optimization tips).

6. **Real-time Live Scan Counter**:
   - Live Socket.io updates whenever a customer scans a QR code.

7. **Admin System Dashboard**:
   - Manage user accounts, role assignments (Admin vs User), and storage metrics.

---

## Docker Compose Support

To run the entire platform (MongoDB + Backend + Frontend) using Docker:
```bash
docker-compose up --build
```
