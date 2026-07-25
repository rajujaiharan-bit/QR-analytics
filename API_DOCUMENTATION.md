# REST API Documentation - QR Advertising Analytics Platform

## Overview
This backend REST API handles Dynamic QR generation, visitor scan logging, campaign side-by-side ROI comparison, real-time WebSockets, and user authentication.

Base URL: `http://localhost:5000/api`  
Dynamic QR Short URL Redirection Base: `http://localhost:5000/r/:shortCode`

---

## Authorization
Requests to protected endpoints must include a JWT Bearer Token in the HTTP Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Endpoint Catalog

### 1. Dynamic QR Redirection (Public)
`GET /r/:shortCode`
- Records scan metadata (IP, Geolocation, Device, Browser, OS, Referrer, Visitor Hash).
- Increments `totalScans` and unique visitor counters.
- Emits real-time Socket.io scan notification.
- Instantly redirects to `destinationUrl` or custom dynamic `LandingPage`.

### 2. Authentication
- `POST /api/auth/register` - Create new advertiser account.
- `POST /api/auth/login` - Authenticate & obtain JWT.
- `GET /api/auth/profile` - Fetch current user profile.
- `PUT /api/auth/profile` - Update profile & business information.

### 3. QR Code Management
- `POST /api/qr` - Generate dynamic QR code with custom colors, frames, logo URL.
- `POST /api/qr/bulk` - Batch generate dynamic QRs via CSV array.
- `GET /api/qr` - Retrieve user QR codes (filter by search, status, category, campaign, favorites).
- `GET /api/qr/:id` - Fetch single QR details & analytics.
- `PUT /api/qr/:id` - Dynamically update target URL, name, or status without reprinting.
- `POST /api/qr/:id/duplicate` - Duplicate existing QR configuration.
- `DELETE /api/qr/:id` - Remove QR code.

### 4. Campaign ROI Comparison
- `POST /api/campaigns` - Create advertising campaign (bottle print, flyer, packaging).
- `GET /api/campaigns` - Fetch campaigns with computed ROI metrics.
- `GET /api/campaigns/roi-comparison` - Side-by-side comparative ROI matrix (Cost, Scans, Unique Visitors, CPS, Reach Rating).

### 5. Custom Landing Pages
- `POST /api/landing-pages` - Build dynamic landing page.
- `GET /api/landing-pages` - List saved landing pages.
- `GET /api/landing-pages/:id` - Fetch single landing page.

### 6. Analytics & AI Insights
- `GET /api/analytics/dashboard` - Global KPIs, daily scan graphs, device split, AI insights.
- `GET /api/analytics/qr/:id` - Detailed single QR analytics (hourly peak graphs, city/country rankings, scan logs).

### 7. Data Export
- `GET /api/export/scans/csv` - Download complete CSV report of all scan audit events.
