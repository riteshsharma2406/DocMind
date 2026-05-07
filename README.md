# DocMind AI

> AI-powered document intelligence platform using RAG (Retrieval-Augmented Generation) to upload PDFs, ask questions, and generate MCQs.

---

## Overview

DocMind AI is a full-stack application that enables users to interact with documents intelligently using modern AI techniques.

It leverages RAG (Retrieval-Augmented Generation) to:
- Retrieve relevant document chunks using embeddings  
- Augment LLM prompts with context  
- Generate accurate and context-aware responses  

---

## What is RAG?

RAG (Retrieval-Augmented Generation) is a technique where:

1. Documents are converted into embeddings  
2. Relevant chunks are retrieved based on user queries  
3. Retrieved context is passed to an LLM  
4. LLM generates answers grounded in the document  

This avoids hallucination and improves accuracy.

---

## Tech Stack

### Frontend
- React.js  
- Vanilla CSS  
- Fetch API  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### AI & Processing
- OpenRouter (LLM - GPT OSS model)  
- Embeddings (OpenRouter / Cohere)  
- PDF Parsing  
- Custom text chunking  

---

## Architecture (RAG Pipeline)

1. User uploads a PDF  
2. Text is extracted and split into chunks  
3. Each chunk → converted into embeddings  
4. Stored in MongoDB  
5. User asks a question  
6. Relevant chunks are retrieved  
7. LLM generates response using retrieved context  

---

## Features

- JWT Authentication (Signup/Login)  
- PDF Upload & Parsing  
- RAG-based Question Answering  
- Semantic Search using Embeddings  
- AI-powered MCQ Generator  
- Document Management (view/delete)  
- Modern responsive UI  

---

## Installation

### Clone the repository
bash git clone https://github.com/riteshsharma2406/DocMind.git 
cd DocMind 

---

### Backend setup
bash cd backend 
npm install 

Create .env file:

env PORT=3000 
MONGO_URI=your_mongodb_uri 
JWT_SECRET=your_secret 
OPENROUTER_API_KEY=your_key 

Run backend:

bash npm start 

---

### Frontend setup
bash cd frontend 
npm install 
npm start 

---

## Deployment

- Frontend: Vercel  
- Backend: Render  
- Database: MongoDB Atlas  

---

## Live Demo

- Frontend: [Vercel](https://docmind-3g4hb4ytu-riteshsharma2406s-projects.vercel.app/login)
- Backend: [Render](https://docmind-backend-31ib.onrender.com) 

---

## Future Improvements

- MCQ history & analytics  
- Multi-document RAG querying  
- Advanced vector search (FAISS / Pinecone)  
- PDF preview with highlighting  
- Faster embedding pipeline  

---

## Author

Ritesh Sharma  
GitHub: https://github.com/riteshsharma2406  

---

## Support

If you like this project, give it a ⭐
