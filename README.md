# FixItNow - Home Service Platform 🏠🔧

A full-stack home services marketplace built with Next.js 14.

---

## 🚀 Live Demo

Frontend : https://fix-it-now-frontend-omega.vercel.app/
Backend  : https://b7-a4-fix-it-now.vercel.app/

---

## 🔐 Demo Credentials

Admin      : admin@fixitnow.com / admin123
---

## ✨ Features

### Three User Roles

Customer     : Browse services, book technicians, payment, track bookings, leave reviews
Technician   : Profile management, availability scheduler, accept/decline jobs, update status
Admin        : Platform overview, user management (ban/unban), category management

### Core Features

- Responsive service grid 
- Advanced search & filter (category, location, rating, price)
- Interactive booking with date/time pickers
- Stripe payment integration
- Role-based dashboards with real-time updates
- Skeleton loaders & error boundaries

---

## 🛠️ Tech Stack

Framework  : Next.js 14 (App Router)
Language   : TypeScript
Styling    : Tailwind CSS + Shadcn/ui
State      :  React Query
Forms      : React Hook Form + Zod
Auth       : NextAuth.js (JWT)
Payment    : Stripe
Deployment : Vercel

---

## 📁 Project Structure

src/
├── app/
│   ├── (auth)/           # Login/Register
│   ├── (public)/         # Home, Services, Technicians
│   ├── (dashboard)/      # Customer, Technician, Admin
│   └── api/
├── components/ui, shared, dashboard
├── lib/actions, utils
├── middleware.ts
└── types/

---

## 🚦 Getting Started

### Installation

git clone https://github.com/yourusername/fixitnow-frontend.git
cd fixitnow-frontend
npm install
cp .env.example .env.local

### Environment Variables

NEXT_PUBLIC_BACKEND_API_URL=https://b7-a4-fix-it-now.vercel.app

### Run Development Server

npm run dev
# Open http://localhost:3000

### Production Build

npm run build && npm start

---

## 🔗 API Routes

Frontend Route                    | Backend API
----------------------------------|------------------------------------------
/                                 | GET /api/services
/services                         | GET /api/services, /api/technicians, /api/categories
/technicians/[id]                 | GET /api/technicians/:id
/auth/register                    | POST /api/auth/register
/auth/login                       | POST /api/auth/login
/dashboard/customer               | GET /api/bookings, /api/payments
/dashboard/customer/bookings/[id]/pay | POST /api/payments/create
/dashboard/technician             | GET /api/technician/profile, /api/technician/availability
/dashboard/technician/bookings    | GET/PATCH /api/technician/bookings
/dashboard/admin                  | GET /api/admin/users, /api/admin/bookings
/dashboard/admin/categories       | GET/POST /api/admin/categories

---

## 📊 Booking Status Flow

REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
    ↓          ↓                    ↑
DECLINED   CANCELLED           REVIEWED

Badges:
🟡 REQUESTED  | 🔵 ACCEPTED  | 🔴 DECLINED
🟣 PAID       | 🟢 IN_PROGRESS | ⚫ COMPLETED | ⚪ CANCELLED

---


---

## 📚 Documentation

Next.js    : https://nextjs.org/docs
Shadcn/ui  : https://ui.shadcn.com/docs
React Query: https://tanstack.com/query/latest

---

Live Demo : https://fix-it-now-frontend-omega.vercel.app/
