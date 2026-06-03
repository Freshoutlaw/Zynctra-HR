FROM python:3.11-slim
WORKDIR /app
COPY ai-services/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ai-services/ ./
EXPOSE 8000
CMD ["uvicorn", "nlp_assistant.main:app", "--host", "0.0.0.0", "--port", "8000"]
