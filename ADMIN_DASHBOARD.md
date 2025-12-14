# Admin Dashboard - Complete Feature Documentation

## 🎯 Features Implemented

### 1. **Dashboard Overview**

- Quick statistics display:
  - Total users count
  - Admin users count
  - Banned users count
- Quick action buttons for easy navigation

### 2. **Page Builder with Live Preview**

A complete visual page editor for the home page with real-time preview:

**Editable Elements:**

- Hero title (main heading)
- Hero subtitle (descriptive text)
- Primary button text and link
- Secondary button text and link
- Background color picker
- Text color picker

**Features:**

- Live preview panel showing changes in real-time
- All changes are automatically saved to the database
- Color pickers with hex value display
- Reset button to reload last saved version

### 3. **User Management**

Complete user administration system with:

**Features:**

- View all registered users in a professional table
- Search users by name or email
- User status indicators (Active/Banned)
- User role badges (User/Admin)
- Join date display

**Actions per user:**

- **Ban User**: Prevent banned users from accessing the platform
- **Unban User**: Restore access to previously banned users
- **Promote to Admin**: Give admin privileges to regular users
- **Demote from Admin**: Remove admin privileges from admins

**Search & Filter:**

- Real-time search by name or email
- Instant results as you type
- Empty state for no results

## 📁 Files Created/Modified

### Frontend

**New Files:**

- `/frontend/src/app/services/admin.service.ts` - Service for admin API calls
- `/frontend/src/app/admin/admin-dashboard/admin-dashboard.component.ts` - Main dashboard component
- `/frontend/src/app/admin/admin-dashboard/admin-dashboard.component.html` - Dashboard template
- `/frontend/src/app/admin/admin-dashboard/admin-dashboard.component.css` - Dashboard styling

**Updated Files:**

- `/frontend/src/app/app.routes.ts` - Added admin routes

### Backend

**New Files:**

- `/backend/models/PageContent.js` - Database model for page content
- `/backend/routes/admin.js` - Admin API routes

**Updated Files:**

- `/backend/models/User.js` - Added `role` and `banned` fields
- `/backend/server.js` - Added admin routes registration

## 🔗 API Endpoints

### Page Content

```
GET  /api/admin/page-content      - Get current page content
PUT  /api/admin/page-content      - Update page content
```

### User Management

```
GET  /api/admin/users             - Get all users
PUT  /api/admin/users/:id/ban     - Ban a user
PUT  /api/admin/users/:id/unban   - Unban a user
PUT  /api/admin/users/:id/promote - Promote user to admin
PUT  /api/admin/users/:id/demote  - Demote admin to user
```

## 🎨 Design Highlights

- **Dark Theme**: Professional dark gradient background matching project design
- **Responsive Layout**:
  - Desktop: Sidebar + Content
  - Tablet: Adjusted spacing
  - Mobile: Stacked layout with horizontal scrolling sidebar
- **Smooth Animations**: Fade-in effects for content
- **Professional Tables**: Clean user table with action buttons
- **Color System**:
  - Admin badges: Gold (#ffc107)
  - Banned status: Red (#f44336)
  - Active status: Green (#4caf50)
  - Ban button: Red tones
  - Promote button: Gold tones
  - Unban button: Green tones
  - Demote button: Blue tones

## 🔐 Access Control

The admin dashboard is protected and requires:

1. Valid admin token in localStorage
2. Automatic redirect to /admin/login if not authenticated

**Admin Credentials:**

- Email: `abdallahhfares@gmail.com`
- Password: `abdallah2008`

## 📋 User Data Model

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  role: String ('user' or 'admin'),
  banned: Boolean,
  createdAt: Date
}
```

## 🚀 Usage

1. **Access Admin Dashboard:**

   - Navigate to `/admin/login`
   - Login with provided credentials
   - Redirects to `/admin/dashboard`

2. **Edit Home Page:**

   - Click "Page Builder" tab
   - Modify any content field
   - See live preview on the right
   - Changes auto-save to database
   - Users see updated page on refresh

3. **Manage Users:**
   - Click "Users" tab
   - View all registered users
   - Search by name or email
   - Click action buttons to manage:
     - Ban/Unban users
     - Promote/Demote admins

## ✨ Key Features

- ✅ No page reload needed for changes
- ✅ Live preview while editing
- ✅ Automatic database persistence
- ✅ Real-time user search
- ✅ Responsive design for all devices
- ✅ Professional UI with animations
- ✅ Success notifications on actions
- ✅ Clean, organized table layout
- ✅ Easy-to-use color pickers
- ✅ Action confirmation through state updates

## 🔧 Installation & Setup

1. **Backend Setup:**

   ```bash
   cd backend
   npm install
   node server.js
   ```

2. **Frontend Setup:**

   ```bash
   cd frontend
   npm install
   ng serve
   ```

3. **Database:**
   - Ensure MongoDB is running
   - Models will auto-create collections

## 📝 Notes

- Admin credentials are hardcoded in the login component for security
- Page content is stored in database and persists across sessions
- User bans prevent access but don't delete accounts
- Promoting users to admin gives them access to admin dashboard
- All timestamps are in ISO format in the database

---

**Admin Dashboard Ready! 🎉**
