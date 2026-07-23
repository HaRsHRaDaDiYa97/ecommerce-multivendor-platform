FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install npm packages
RUN npm ci || npm install

# Copy application files
COPY . .

# Expose Vite default dev server port
EXPOSE 5173

# Start Vite dev server with host binding 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
