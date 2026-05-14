FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including Node.js
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app ./app
COPY templates ./templates
COPY catalog.json .

# Install and build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps && npm run build

WORKDIR /app

# Expose ports
EXPOSE 8000 3000

# Start both services
CMD ["sh", "-c", "cd /app/frontend && npm start & cd /app && uvicorn app.main:app --host 0.0.0.0 --port 8000 & wait"]
