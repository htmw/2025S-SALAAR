FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV MODEL_PATH=/app/models/best_model.pth

# Create necessary directories
RUN mkdir -p /app/data/processed
RUN mkdir -p /app/logs
RUN mkdir -p /app/models

# Expose the port the app runs on
EXPOSE 5000

# Command to run the inference service
CMD ["python", "main.py", "--inference", "--port", "5000"]