FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies specifically for prod
# (If we use workspaces, we might just npm install, but here it's isolated)
RUN npm install --production

# Copy application code
COPY . .

# Expose port 5000 (standard backend port)
EXPOSE 5000

# Tell node it's running in production
ENV NODE_ENV=production

# Start the application directly (no nodemon in prod)
CMD ["node", "server/server.js"]
