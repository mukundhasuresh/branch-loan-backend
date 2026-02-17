# Base image
FROM node:18

# App directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 5000

# Run app
CMD ["npm", "run", "dev"]
