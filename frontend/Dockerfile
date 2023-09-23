# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the production build files from your local machine into the container
COPY ./dist/untitled-marketplace ./dist/untitled-marketplace

# Expose the port that ng serve will use (default is 4200)
EXPOSE 4200

# Start a web server to serve your Angular application
CMD ["ng", "serve", "--host", "0.0.0.0"]