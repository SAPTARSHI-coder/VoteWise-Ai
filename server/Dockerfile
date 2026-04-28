# Use official Node.js lightweight image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port (Cloud Run sets PORT env automatically, defaulting to 8080)
ENV PORT 5000
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
