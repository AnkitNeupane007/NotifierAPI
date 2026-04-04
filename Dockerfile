# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 5001

# Start app
CMD ["sh", "-c", "npx prisma generate && npm start"]