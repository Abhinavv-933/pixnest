# Pixnest 🗂️

A creative asset management web app for organizing visual projects. Upload images, create nested folders, and manage your creative workspace — built for the Dobby Ads Full Stack Developer Assignment.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6c63ff?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-JWT-ff6b9d?style=flat-square)
![Storage](https://img.shields.io/badge/Storage-Cloudinary-3448c5?style=flat-square)
![Deploy](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square)
![Deploy](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square)

## 🔗 Links

| | URL |
|---|---|
| 🌐 Live App | https://pixnest-kappa.vercel.app |
| ⚙️ Backend API | https://pixnest.onrender.com |
| 📁 GitHub | https://github.com/Abhinavv-933/pixnest |

## 🧪 Test Account

Use these credentials to explore the app without signing up:

| Field | Value |
|---|---|
| Email | `test@test.com` |
| Password | `123456` |

---

## Features

- **Authentication** — Signup, login, logout with JWT-based auth (no Firebase)
- **Nested Folders** — Create folders inside folders at any depth, just like Google Drive
- **Image Upload** — Upload images with a custom name, stored on Cloudinary
- **Folder Size** — Each folder displays its total size recursively including all nested folders and images
- **User-Specific Access** — Users can only see and manage their own folders and images
- **MCP Server** — Backend actions exposed as MCP-compatible tools for AI assistant integration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router DOM, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| File Storage | Cloudinary, Multer |
| Deployment | Vercel (FE), Render (BE) |

---

## Project Structure

```
pixnest/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── cloudinary.js       # Cloudinary + multer setup
│   │   ├── controllers/
│   │   │   ├── authController.js   # Signup, login, logout
│   │   │   ├── folderController.js # Folder CRUD + recursive size
│   │   │   └── imageController.js  # Image upload, get, delete
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT protect middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Folder.js
│   │   │   └── Image.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── folderRoutes.js
│   │   │   └── imageRoutes.js
│   │   └── app.js
│   └── index.js
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js            # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── FolderView.jsx
│       │   ├── CreateFolderModal.jsx
│       │   └── ImageUploadModal.jsx
│       ├── context/
│       │   └── AuthContext.jsx     # Global auth state
│       └── pages/
│           ├── Login.jsx
│           ├── Signup.jsx
│           └── Dashboard.jsx
└── mcp-server/
    └── index.js                    # MCP tools server
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/logout` | Logout |

### Folders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/folders` | Create a folder |
| GET | `/api/folders` | Get folders (root or by parentId) |
| DELETE | `/api/folders/:id` | Delete a folder |
| GET | `/api/folders/:id/size` | Get recursive folder size |

### Images
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/images` | Upload an image to a folder |
| GET | `/api/images?folderId=` | Get images in a folder |
| DELETE | `/api/images/:id` | Delete an image |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend

```bash
cd backend
npm install
```

Create `.env` in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
```

Create `.env` in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Bonus: MCP Server

Pixnest exposes backend actions as MCP-compatible tools, allowing AI assistants like Claude Desktop to interact with the app through natural language.

### Available MCP Tools

| Tool | Description |
|---|---|
| `list_folders` | List all folders for the authenticated user |
| `create_folder` | Create a folder by name with optional parent |
| `upload_image` | Upload an image to a folder |

### Example

Connecting Claude Desktop to the Pixnest MCP server and saying:

> *"Create a folder called Campaigns inside Projects"*

Triggers the correct API call in Pixnest and the folder appears instantly.

### MCP Setup

```bash
cd mcp-server
npm install
```

Create `.env` in the mcp-server folder:

```env
PIXNEST_API_URL=https://pixnest.onrender.com/api
PIXNEST_TOKEN=your_jwt_token
```

```bash
node index.js
```

---

## Author

Built by **Abhinav Dwivedi** 