FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app source
COPY ./src ./src

# Entrypoint
CMD ["uvicorn", "src.main.main:app", "--host", "0.0.0.0", "--port", "9000", "--reload"]
