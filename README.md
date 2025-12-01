This appears to be a full-stack job search application built with modern web technologies. Let me break down what I'm seeing:
Architecture Overview
Backend (Python + Elasticsearch):

Uses Elasticsearch 8.13.2 as the search engine
Fetches IT job listings from the Remotive API
Implements semantic search using sentence transformers (e5-small-v2 model for embeddings)
Stores job data with 384-dimensional vectors for similarity search

Frontend (Next.js + React):

Built with Next.js 15 and React 18
Uses Elastic's Search UI components for search interface
Includes user authentication (stored in localStorage)
Features:

Job search with filters (location, salary, job type)
User profiles with edit capabilities
Job posting form
Responsive design with Tailwind CSS



Key Features

Semantic Search: Jobs are embedded as vectors and searched using cosine similarity
Faceted Filtering: Filter by location, salary ranges, and job type
User Management: Login/register system with profile management
Job Posting: Form to add new job listings to Elasticsearch
Modern UI: Clean interface with custom components and CSS modules

Tech Stack

Search: Elasticsearch with vector search capabilities
Backend: Python, sentence-transformers
Frontend: Next.js, TypeScript, React Search UI
Styling: Tailwind CSS, CSS Modules
Data Source: Remotive remote jobs API

Here's how to install and run this application:
Prerequisites

Docker & Docker Compose (for Elasticsearch)
Python 3.13 (or 3.8+)
Node.js (v18+) and npm

Installation Steps
1. Start Elasticsearch
bashcd back
docker-compose up -d
This will start:
```
Elasticsearch on http://localhost:9200
Kibana on http://localhost:5601
```
Wait ~30 seconds for Elasticsearch to fully start.
2. Set Up Python Backend
```
bash# Still in /back directory
python -m venv .venv
```
# Activate virtual environment:
# On Windows:
```
.venv\Scripts\activate
```
# On Mac/Linux:
```
source .venv/bin/activate
```
# Install dependencies
```
pip install -r requirements.txt
```
# Run the main script to fetch jobs and create embeddings
```
python main.py
```
This will:

Create the it_jobs index in Elasticsearch
Fetch jobs from Remotive API
Generate embeddings for semantic search

3. Set Up Frontend
```
bashcd ../front
```
# Install dependencies
```
npm install
```
# Start development server
```
npm run dev
```
The app should now be running at http://localhost:3000
Verify Installation

Check Elasticsearch:``` curl http://localhost:9200/_cat/indices```
Open the app:``` http://localhost:3000```
Try searching for jobs like "Python developer" or "React"

Troubleshooting

Port conflicts: If 9200, 5601, or 3000 are in use, stop those services
Memory issues: Elasticsearch needs ~2GB RAM minimum
Embedding errors: The first run downloads the ML model (~80MB)
