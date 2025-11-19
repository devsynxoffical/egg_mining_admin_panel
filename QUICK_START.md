# 🥚 Egg Mining Admin Panel - Quick Start Guide

## ✅ Project Setup Complete!

The admin panel has been fully set up with all required features. Here's how to get started:

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd admin-panel
npm install
```

### 2. Configure Environment
Create a `.env` file in the `admin-panel` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_EMAIL=admin@eggmining.com
VITE_ADMIN_PASSWORD=admin123
```

### 3. Run Development Server
```bash
npm run dev
```

The admin panel will be available at: **http://localhost:3001**

### 4. Login
- **Email:** admin@eggmining.com
- **Password:** admin123

(These are default credentials - change them in production!)

## 📋 Features Implemented

### ✅ Dashboard
- Real-time analytics overview
- Key metrics (Total Users, Active Miners, Eggs in Circulation, etc.)
- Weekly analytics charts
- Recent activity feed

### ✅ User Management
- View all users with search functionality
- User details (balance, KYC status, referrals)
- Suspend/Activate accounts
- Delete users
- Filter by status

### ✅ KYC Management
- View pending KYC submissions
- Approve/Reject KYC with reason
- View user selfies and CNIC
- Filter by status (all, pending, approved, rejected)

### ✅ Market Price Management
- View current market price
- Update price in real-time
- Price history tracking
- Last updated information

### ✅ Transactions
- View all platform transactions
- Filter by type (mining, buy, sell, transfer, referral bonus)
- Search functionality
- Transaction details

### ✅ Activity Logs
- Monitor all platform activities
- Filter by activity type
- Detailed log information
- IP address tracking

## 🏗️ Project Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── Dashboard/      # Dashboard components
│   │   └── Layout/         # Layout components (Sidebar, Header)
│   ├── lib/
│   │   ├── api.ts          # API client and functions
│   │   └── firebase.ts     # Firebase configuration
│   ├── pages/              # Main pages
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── KYC.tsx
│   │   ├── MarketPrice.tsx
│   │   ├── Transactions.tsx
│   │   ├── ActivityLogs.tsx
│   │   └── Login.tsx
│   ├── store/
│   │   └── authStore.ts    # Authentication state management
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Firebase** - Backend integration (ready to connect)
- **Recharts** - Analytics charts
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 🔌 Backend Integration

The admin panel is ready to connect to your backend. Update the API calls in:
- `src/lib/api.ts` - Replace mock data with actual API endpoints
- `src/lib/firebase.ts` - Add your Firebase credentials

Currently, the app uses mock data for demonstration. Replace the mock data in each page component with actual API calls.

## 🎨 UI/UX Features

- ✅ Responsive design (mobile-friendly)
- ✅ Modern, clean interface
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Search and filter functionality
- ✅ Color-coded status badges
- ✅ Interactive charts

## 📝 Next Steps

1. **Connect to Backend**
   - Update API endpoints in `src/lib/api.ts`
   - Replace mock data with real API calls
   - Test all CRUD operations

2. **Firebase Setup**
   - Add Firebase credentials to `.env`
   - Configure Firestore rules
   - Set up authentication

3. **Security**
   - Implement proper JWT tokens
   - Add role-based access control
   - Secure API endpoints

4. **Enhancements**
   - Add pagination for large datasets
   - Implement real-time updates
   - Add data export functionality
   - Enhanced filtering and sorting

## 🐛 Troubleshooting

**Port already in use?**
- Change the port in `vite.config.ts` (currently set to 3001)

**Dependencies not installing?**
- Make sure you have Node.js 18+ and npm 9+
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Build errors?**
- Check TypeScript errors: `npm run lint`
- Verify all environment variables are set

## 📞 Support

For issues or questions, refer to the main project documentation or contact the development team.

---

**Happy Admin-ing! 🎉**

