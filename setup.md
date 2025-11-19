# Admin Panel Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd admin-panel
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Open http://localhost:3001
   - Default credentials: admin@eggmining.com / admin123

## Features Implemented

✅ **Dashboard**
- Analytics overview with key metrics
- Weekly charts
- Recent activity feed

✅ **User Management**
- View all users
- Search and filter
- Suspend/Activate accounts
- Delete users
- View user details (balance, KYC status, referrals)

✅ **KYC Management**
- View pending KYC submissions
- Approve/Reject KYC
- View user selfies and CNIC
- Filter by status

✅ **Market Price Management**
- View current market price
- Update price in real-time
- Price history (when available)

✅ **Transactions**
- View all transactions
- Filter by type (mining, buy, sell, transfer, referral)
- Search functionality

✅ **Activity Logs**
- Monitor all platform activities
- Filter by activity type
- View detailed logs

## Next Steps

1. **Connect to Backend**
   - Update API calls in `src/lib/api.ts` to connect to your actual backend
   - Replace mock data with real API responses

2. **Firebase Integration**
   - Complete Firebase setup in `src/lib/firebase.ts`
   - Implement Firebase authentication
   - Connect Firestore for data

3. **Security**
   - Implement proper authentication tokens
   - Add role-based access control
   - Secure API endpoints

4. **Enhancements**
   - Add pagination for large datasets
   - Implement real-time updates
   - Add export functionality
   - Enhanced filtering and sorting

