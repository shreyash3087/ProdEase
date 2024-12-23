# ProdEase - Product Management Hub

## Description

ProdEase is a centralized platform designed to streamline the management of products for team members and admins in a fictional product-based company. From submissions to reviews, ProdEase offers a seamless and precise workflow for efficient product management.

## Repository Under: AcWoC'25
## Club: Android Club, VIT Bhopal University

## Features
- Secure user authentication using JWT.
- Product image storage via Firebase.
- Robust data storage with MongoDB for users, contacts, and other metadata.
- Built with Next.js for a fast and dynamic user experience.

---

## Tech Stack
- **Frontend & Backend**: Next.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Cloud Storage**: Firebase

---

## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites

1. **Node.js**: Install the latest version of Node.js from [Node.js official website](https://nodejs.org/).
2. **Firebase Account**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database and Cloud Storage.
3. **MongoDB Database**:
   - Set up a MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB installation.

---

### Environment Variables

Create a `.env.local` file in the root directory of the project and include the following keys:

```env
MONGODB_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>
NEXT_PUBLIC_FIREBASE_API_KEY=<Your Firebase API key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<Your Firebase Auth Domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<Your Firebase Project ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Your Firebase Storage Bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Your Firebase Messaging Sender ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<Your Firebase App ID>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<Your Firebase Measurement ID>
```

Replace the placeholders with the actual values from your Firebase and MongoDB setups.

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/prodease.git
   cd prodease
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Go to the Firebase Console.
   - Navigate to the Project Settings > General.
   - Copy the Firebase configuration details and update your `.env.local` file.

4. **Set up MongoDB**:
   - Create a MongoDB database.
   - Obtain the connection string and update your `.env.local` file.

---

### Running the Project Locally

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Contributing

1. Fork the repository.

2. Create a new branch for your feature/fix.
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes.
   ```bash
   git commit -m "Add feature/fix"
   ```
4. Push to your branch and submit a pull request.
   ```bash
   git push origin feature-name
   ```

---

## Acknowledgments
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs)
