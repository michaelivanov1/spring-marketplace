# Use an official Node.js runtime as the base image for building
FROM node:16 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Build your Angular application for production
COPY . .
RUN ng build prod

# Stage 2: Use Caddy to serve the production build files
FROM caddy:alpine

# Copy the production build files from the builder stage to Caddy's HTML directory
COPY --from=builder /app/dist /usr/share/caddy

# Expose the port that Caddy will use (default is 80)
EXPOSE 80

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]