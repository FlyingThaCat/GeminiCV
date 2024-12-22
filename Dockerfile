# Use an official Node.js image as the base image for building the React app
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY frontend/package*.json ./

# Install dependencies for React app
RUN npm install

# Copy the rest of the React app source code
COPY frontend/ .

# Build the React app
RUN npm run build

# Use an official Python image as the base image for running the Flask app
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy the Flask app requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy the Flask app source code
COPY backend/ .

RUN flask --app backend/flask_app.py

# Copy the built React app from the build stage
COPY --from=build /app/build ./frontend/build

# Install Supervisor
RUN apt-get update && apt-get install -y supervisor

# Copy Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY data/ .

# Expose the port the app runs on
EXPOSE 8080

# Start Supervisor to manage both the Flask and React apps
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
