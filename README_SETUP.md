# 💫 Mood Based Book Recommendor - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face API key:

```
HF_API_KEY=your_huggingface_api_key_here
```

**Get your free API key from:** https://huggingface.co/settings/tokens

### 3. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 4. Open the Application

Open your browser and go to:
```
http://localhost:3000
```

## Features

- 💫 Mood-based book recommendations
- 🤖 AI-powered using Hugging Face
- 📚 Google Books API integration
- 💬 Friendly chat interface
- 🧠 Remembers last 3 moods for personalized suggestions

## Usage

1. Click the 💫 button (bottom-right)
2. Tell the recommender your mood, e.g.:
   - "I feel romantic"
   - "I'm in a happy mood"
   - "adventurous"
   - "mysterious"
3. Get personalized book recommendations!

## API Endpoints

### POST /api/recommend

Request:
```json
{
  "mood": "romantic",
  "userInput": "I feel romantic"
}
```

Response:
```json
{
  "mood": "romantic",
  "recommendations": [
    {
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "description": "...",
      "image": "...",
      "rating": 4.5
    }
  ],
  "message": "Based on your romantic mood..."
}
```

## Troubleshooting

- **Backend not running?** Make sure you ran `npm start` in the terminal
- **API key error?** Check your `.env` file has the correct `HF_API_KEY`
- **CORS errors?** The backend has CORS enabled, make sure you're accessing from `http://localhost:3000`

