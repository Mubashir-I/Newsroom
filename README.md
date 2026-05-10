# Newsroom Platform

A modern, high-performance newsroom platform built with Next.js, designed for campus media, independent journalism, and collaborative storytelling.

## Features

### Authentication & Security
- **Role-Based Access Control (RBAC)**: Distinct workflows for **Admins**, **Writers**, and **Readers**.
- **Secure Login/Signup**: Built with NextAuth.js and Bcrypt for password hashing.
- **Password Reset Flow**: Integrated email-based password recovery using `nodemailer` (sent from `mmi.revival@gmail.com`).
- **Middleware Protection**: Guaranteed security for dashboard routes and API endpoints.

### For Writers
- **Content Management**: Create, edit, and manage articles with a rich text editor.
- **Cloudinary Integration**: Effortless cover image uploads and management.
- **Analytics**: (Planned/Partial) Track engagement and performance of your stories.

### For Readers
- **Personalized Feed**: Browse stories based on interests and categories.
- **Engagement**: Like, comment, and follow your favorite writers.
- **Responsive Reading**: A premium, mobile-first reading experience with dark mode aesthetics.

### Admin Features
- **Platform Overview**: Monitor system activity and user growth.
- **Content Moderation**: Manage all articles and user roles.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Vanilla CSS approach with modern tokens)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Cloudinary](https://cloudinary.com/)

## Setup Instructions

### 1. Prerequisites
- Node.js 18.x or higher
- MongoDB instance (local or Atlas)

### 2. Clone and Install
```bash
git clone <repository-url>
cd newsroom
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following:

```env
# Database
DB_URL=mongodb://localhost:27017/newsroom

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
SECRET_KEY=your_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="newsroom"

# Email (for password reset)
EMAIL_USER=mmi.revival@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (Sidebar, TopNav, Footer, etc.).
- `lib/`: Utility functions (Database connection, Mailer, Security).
- `models/`: Mongoose schemas for User, Article, and Comment.
- `public/`: Static assets.

## License
This project is for educational purposes as part of the Web Programming course.
