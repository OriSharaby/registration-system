# Registration System & AI Chatbot — A.B Deliveries

A production-style multi-service project that combines a registration system, authentication flow, AI-generated welcome messages, and a Hebrew customer-support chatbot for **A.B Deliveries**.

This repository demonstrates how to split responsibilities across dedicated services and clients:

- **Web client** built with React + TypeScript + Vite
- **Mobile client** built with React Native + Expo + TypeScript
- **Core API** built with FastAPI + MongoDB for registration and login
- **AI service** built with Node.js + Express + TypeScript for OpenAI-powered toast messages and chatbot logic
- **Conversation logging** to Google Sheets for chatbot audit/history

---

## Table of Contents

- [Overview](#overview)
- [Business Flow](#business-flow)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Main Features](#main-features)
- [Authentication Flow](#authentication-flow)
- [Chatbot Flow](#chatbot-flow)
- [AI Prompt Used by the Bot](#ai-prompt-used-by-the-bot)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Running the Project](#running-the-project)
- [Google Sheets Logging](#google-sheets-logging)
- [Deployment Notes](#deployment-notes)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

---

## Overview

This project was built as a home assignment and extended into a broader full-stack system.

It includes two user-facing clients:

1. A **web registration application**
2. A **mobile registration application**

After registration and login, the user can access a **Hebrew-speaking AI chatbot** for A.B Deliveries.

The backend is intentionally separated into two services:

- A **Python FastAPI service** responsible for user registration, login, validation, password hashing, JWT generation, and MongoDB user persistence.
- A **Node.js AI service** responsible for OpenAI-based welcome toast generation, chatbot session handling, conversation persistence, and Google Sheets logging.

This split mirrors real-world service boundaries where business APIs and AI workflows are often isolated for maintainability, security, and deployment flexibility.

---

## Business Flow

### Registration and login

1. User opens the web or mobile app.
2. User registers with `name`, `email`, and `password`.
3. The FastAPI server validates the payload.
4. Password is hashed before being stored in MongoDB.
5. FastAPI calls the Node AI service to generate a short welcome toast.
6. The client shows the toast to the user.
7. User can later log in and receive a JWT token.

### Chatbot

1. Logged-in user enters the chatbot screen.
2. The client starts a new conversation by calling the AI service.
3. The bot greets the user in Hebrew.
4. The bot collects:
   - customer name
   - Israeli mobile phone number
5. Once onboarding is complete, the bot continues answering delivery-related questions.
6. Every message is stored in MongoDB and also exported to Google Sheets.

---

## System Architecture

```text
┌──────────────────────┐
│   Web Client (React) │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Mobile Client (Expo) │
└──────────┬───────────┘
           │
           ├───────────────────────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────────┐     ┌──────────────────────────────┐
│ FastAPI Auth API         │     │ Node.js AI Service           │
│ - register/login         │     │ - toast generation           │
│ - JWT issuance           │     │ - chatbot routes             │
│ - MongoDB users          │     │ - conversation storage       │
└──────────┬───────────────┘     │ - Google Sheets export       │
           │                     └──────────┬───────────────────┘
           │                                │
           ▼                                ▼
     ┌──────────────┐                ┌──────────────┐
     │   MongoDB    │                │   OpenAI     │
     │ users/chat   │                │ Responses API│
     └──────────────┘                └──────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │ Google Sheets│
                                       │ Chat Logs    │
                                       └──────────────┘
```

### Why this architecture

- **FastAPI** owns authentication and user data.
- **Node AI service** owns AI-specific behavior and chat orchestration.
- **MongoDB** fits well for both user records and flexible chat documents.
- **Google Sheets export** gives a simple operational log for non-technical review.
- **Separate clients** show how the same backend can serve both web and mobile.

---

## Tech Stack

### Frontend — Web

- React 19
- TypeScript
- Vite
- React Router
- React Toastify
- React Icons

### Frontend — Mobile

- React Native
- Expo
- TypeScript
- React Navigation
- Async Storage
- react-native-toast-message

### Backend — Core API

- Python
- FastAPI
- Uvicorn / Gunicorn
- PyMongo
- bcrypt
- python-jose
- httpx
- pydantic

### Backend — AI Service

- Node.js
- Express
- TypeScript
- OpenAI SDK
- Mongoose
- Google APIs
- dotenv

### Data / External Services

- MongoDB
- OpenAI API
- Google Sheets API
- Azure-ready deployment approach

---

## Repository Structure

```text
registration-system/
├── .github/
│   └── workflows/
├── ai-node/
│   ├── models/
│   │   └── Conversation.ts
│   ├── routes/
│   │   ├── chat/
│   │   │   ├── messageHandlers/
│   │   │   ├── chatHelpers.ts
│   │   │   ├── messageRoute.ts
│   │   │   ├── startRoute.ts
│   │   │   └── index.ts
│   │   ├── health.ts
│   │   ├── index.ts
│   │   └── toast.ts
│   ├── services/
│   │   ├── googleSheetsService.ts
│   │   ├── openaiService.ts
│   │   └── promptService.ts
│   ├── index.ts
│   ├── package.json
│   └── tsconfig.json
├── api-python/
│   ├── core/
│   │   └── config.py
│   ├── models/
│   │   └── auth_models.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   └── health_routes.py
│   ├── services/
│   │   ├── ai_service.py
│   │   └── auth_service.py
│   ├── auth_utils.py
│   ├── db.py
│   ├── main.py
│   └── requirements.txt
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   └── auth/
│   │   ├── navigation/
│   │   ├── screens/
│   │   └── services/
│   ├── App.tsx
│   └── package.json
├── web/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── chat/
│   │   ├── pages/
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── ChatPage.tsx
│   │   ├── services/
│   │   │   ├── authApi.ts
│   │   │   └── chatApi.ts
│   │   └── styles/
│   └── package.json
├── .env.example
└── README.md
```

---

## Main Features

### 1. Registration system

- Register with name, email, and password
- Server-side validation using Pydantic
- Duplicate email protection
- Password hashing before persistence
- AI-generated welcome toast after successful registration

### 2. Login system

- Login with email and password
- Password verification via bcrypt
- JWT token generation for authenticated sessions
- Token stored client-side after login

### 3. Web client

- Separate register page
- Separate login page
- Protected route for the chatbot page
- Toast notifications for success and error states

### 4. Mobile client

- Expo-based React Native app
- Shared auth flow concept with the web client
- Navigation-based screen structure
- API service layer for communicating with FastAPI

### 5. AI chatbot

- Hebrew-only bot behavior
- Guided onboarding before free-form chat
- Collects user name and Israeli mobile number
- Continues with delivery-related assistance
- Uses OpenAI for response generation

### 6. Google Sheets conversation logging

- Every chatbot message can be appended into a spreadsheet row
- Tracks:
  - conversation ID
  - customer name
  - phone number
  - channel
  - profile step
  - role
  - message
  - timestamps

---

## Authentication Flow

### Register

The web and mobile clients send a request to the FastAPI service:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Ori Sharaby",
  "email": "ori@example.com",
  "password": "12345678"
}
```

Expected response:

```json
{
  "ok": true,
  "message": "User registered successfully",
  "user": {
    "name": "Ori Sharaby",
    "email": "ori@example.com"
  },
  "toast": "Welcome aboard! 🎉"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "ori@example.com",
  "password": "12345678"
}
```

Expected response:

```json
{
  "ok": true,
  "token": "jwt-token-here",
  "user": {
    "name": "Ori Sharaby",
    "email": "ori@example.com"
  }
}
```

---

## Chatbot Flow

The chatbot is implemented inside the **Node AI service**, not as a separate standalone repo/service.

### Conversation steps

#### Step 1 — Start conversation

Client calls:

```http
POST /api/chat/start
```

```json
{
  "channel": "web"
}
```

The server creates a conversation document with:

- `customerName = "Not provided yet"`
- `phoneNumber = "Not provided yet"`
- `profileStep = "collecting_name"`

Then it sends the initial greeting in Hebrew.

#### Step 2 — Collect name

User sends first reply.

The system stores the user message, saves the name, advances the conversation to:

```text
collecting_phone
```

#### Step 3 — Collect phone number

The bot validates Israeli mobile numbers.

Supported normalization behavior includes:

- `0501234567`
- `+972501234567`

If invalid, the bot asks again.

If valid, the conversation moves to:

```text
ready
```

#### Step 4 — Free-form delivery support

Once the onboarding data is complete, the service builds chat history and sends it to OpenAI.

The assistant then answers in Hebrew according to the delivery-support system prompt.

---

## AI Prompt Used by the Bot

Below is the exact prompt pattern currently used by the AI chatbot service:

```text
You are a customer support AI assistant for "A.B Deliveries".

IMPORTANT LANGUAGE RULE:
You MUST reply ONLY in Hebrew.
Never use Arabic or any other language.
All sentences must be written strictly in Hebrew characters.

Role:
You help customers with delivery questions such as:
- package status
- tracking
- delivery services
- placing new delivery orders

Behavior rules:
- Be polite, friendly and professional
- Ask for missing information when needed
- Never invent delivery data
- If you lack information, ask the user for details
- If the user is upset, focus on solving the problem first
- Answer delivery related topics only, if topic not delivery related give a generic response

Style:
- Hebrew only
- short clear sentences
- friendly tone
- helpful customer service

Never output Arabic words.
Never mix languages. Hebrew only.
```

### Important note

At the current stage, the bot is **prompt-driven** and does **not** integrate with a real delivery management system or tracking provider yet. That means it can guide the user, ask clarifying questions, and provide service-oriented responses, but it should not be treated as a source of real shipment status unless an operational backend is added later.

---

## API Documentation

## FastAPI Service

Base URL example:

```text
http://localhost:4000
```

### Health check

```http
GET /health
```

Response:

```json
{
  "ok": true
}
```

### Register

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

---

## Node AI Service

Base URL example:

```text
http://localhost:4001
```

### Health check

```http
GET /health
```

### Generate AI toast

```http
GET /api/ai/toast
```

Response:

```json
{
  "message": "Registration successful! 🎉"
}
```

### Start chat

```http
POST /api/chat/start
```

### Send message

```http
POST /api/chat/message
```

Request:

```json
{
  "conversationId": "mongo-conversation-id",
  "message": "מה סטטוס המשלוח שלי?"
}
```

Response:

```json
{
  "reply": "שלום, אשמח לעזור. האם תוכל לשלוח מספר הזמנה?",
  "messages": []
}
```

---

## Environment Variables

This project uses multiple services, so environment variables are split by service.

## 1. Root `.env.example`

The repository currently includes a minimal example file. You can expand it to fit all services.

## 2. FastAPI service — `api-python/.env`

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=registration_db
AI_SERVICE_URL=http://127.0.0.1:4001/api/ai/toast
SECRET_KEY=super-secret-key
```

## 3. Node AI service — `ai-node/.env`

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/registration_db
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
GOOGLE_SHEETS_ID=your_google_sheet_id
GOOGLE_SHEETS_SHEET_NAME=ChatLogs
```

## 4. Web client — `web/.env`

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_AI_API_BASE_URL=http://localhost:4001
```

## 5. Mobile client

The current mobile service reads:

```ts
process.env.API_BASE_URL
```

Depending on your Expo setup, you may want to move this to an Expo-compatible environment strategy such as:

- `EXPO_PUBLIC_API_BASE_URL`
- `app.config.ts`
- `expo-constants`

Example:

```env
API_BASE_URL=http://10.0.2.2:4000
```

> On a real phone, `localhost` usually will not work. Use your machine IP or emulator loopback mapping.

---

## Local Development Setup

## Prerequisites

Install the following first:

- Node.js 18+
- npm
- Python 3.10+
- MongoDB local or MongoDB Atlas
- OpenAI API key
- Google Cloud service account for Sheets logging
- Expo CLI / Expo tooling for mobile

---

## Running the Project

### 1. Start MongoDB

Run local MongoDB or connect to Atlas.

### 2. Start the FastAPI service

```bash
cd api-python
python -m venv .venv
```

#### Windows

```bash
.venv\Scripts\activate
```

#### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn main:app --reload --port 4000
```

Swagger docs:

```text
http://localhost:4000/docs
```

### 3. Start the Node AI service

```bash
cd ai-node
npm install
npm run dev
```

For production build:

```bash
npm run build
npm start
```

### 4. Start the web app

```bash
cd web
npm install
npm run dev
```

Default Vite URL:

```text
http://localhost:5173
```

### 5. Start the mobile app

```bash
cd mobile
npm install
npm start
```

Then choose one of:

```bash
npm run android
npm run ios
npm run web
```

---

## Suggested Startup Order

```bash
# Terminal 1
cd api-python
uvicorn main:app --reload --port 4000

# Terminal 2
cd ai-node
npm run dev

# Terminal 3
cd web
npm run dev

# Terminal 4
cd mobile
npm start
```

---

## Google Sheets Logging

The chatbot can export every message into a Google Sheet.

### What gets logged

- conversation ID
- customer name
- phone number
- channel (`web` or `mobile`)
- profile step
- role (`user` / `assistant`)
- message content
- message timestamp
- conversation created time
- conversation updated time

### Setup steps

1. Create a Google Cloud project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Generate a JSON key.
5. Share the target spreadsheet with the service account email.
6. Put the JSON content in `GOOGLE_SERVICE_ACCOUNT`.
7. Set `GOOGLE_SHEETS_ID` and optional `GOOGLE_SHEETS_SHEET_NAME`.

### Why use Sheets here

For a home assignment or internal admin view, Google Sheets is a fast and practical tool for:

- reviewing conversations
- customer support audit
- debugging chat flow
- showing business stakeholders simple logs without building a dedicated dashboard

---

## Deployment Notes

This repository is designed in a way that is friendly to cloud deployment.

### FastAPI service

Can be deployed to:

- Azure App Service
- Render
- Railway
- Docker-based infrastructure

Suggested production command:

```bash
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

### Node AI service

Can be deployed to:

- Azure App Service
- Render
- Railway
- Docker container

Production flow:

```bash
npm run build
npm start
```

### Web client

Can be deployed to:

- Vercel
- Netlify
- Azure Static Web Apps

### Mobile client

Can be distributed via:

- Expo development builds
- Android APK / AAB
- iOS build pipeline

### Production recommendations

- Separate dev/staging/prod environment variables
- Use managed MongoDB Atlas for production
- Store secrets in cloud secret management
- Add HTTPS everywhere
- Add structured logging
- Add rate limiting
- Add monitoring and health probes

---

## Security Notes

This project already demonstrates some strong foundations, but production hardening should include more.

### Already present

- Password hashing before storage
- Pydantic validation for API payloads
- Duplicate email protection
- JWT token generation
- Environment-based secret loading

### Recommended next improvements

- Do not keep fallback `SECRET_KEY` in production
- Add JWT verification middleware on protected backend routes
- Move token storage from `localStorage` to a safer strategy when relevant
- Add request throttling / rate limiting
- Add CORS restrictions per environment
- Add bot abuse protection / CAPTCHA for registration
- Add stronger password policy rules
- Mask personal data in operational logs

---

## Troubleshooting

### 1. `Missing MONGODB_URI`

Make sure the correct `.env` file exists and that MongoDB connection variables are loaded before startup.

### 2. FastAPI works but toast is missing

Check:

- Node AI service is running
- `AI_SERVICE_URL` points to `/api/ai/toast`
- OpenAI key exists in the Node service

### 3. Chat starts but no reply is returned

Check:

- `OPENAI_API_KEY`
- internet access from the Node service
- OpenAI quota / billing
- server logs for `generateChatReply`

### 4. Google Sheets export fails

Check:

- `GOOGLE_SERVICE_ACCOUNT` JSON format
- private key newline escaping
- correct sheet ID
- spreadsheet shared with service account email

### 5. Mobile app cannot reach backend

Usually `localhost` is wrong on a phone or emulator.

Use:

- Android emulator: `10.0.2.2`
- iOS simulator: often `localhost` works
- physical device: your computer LAN IP

### 6. CORS issues in web app

Make sure FastAPI allows the correct frontend origin.

Current allowed origins should be updated when moving from local development to hosted environments.

---

## Future Improvements

A strong next iteration of this project could include:

- real protected backend endpoints using JWT auth middleware
- real shipment tracking integration
- admin dashboard for conversations
- Redis for chat session acceleration
- background queue for exports/logging
- unit and integration tests
- Docker Compose for one-command local setup
- CI/CD pipeline validation for all services
- role-based access control
- password reset flow
- social login integration
- chatbot analytics dashboard

---

## Summary

This project is more than a basic registration form.

It demonstrates:

- multi-client architecture
- multi-service backend design
- authentication fundamentals
- AI integration through OpenAI
- operational logging to Google Sheets
- a structured chatbot flow for a business use case

It is a solid portfolio project for discussing:

- architecture decisions
- API design
- full-stack integration
- service separation
- cloud readiness
- practical AI feature integration

---

## Author

**Ori Sharaby**

Computer Science graduate building full-stack systems with React, TypeScript, Node.js, Python, MongoDB, and AI integrations.
