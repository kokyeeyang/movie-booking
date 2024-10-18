# Use an official Node.js image as a base for building the React app
FROM node:14 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app with an Nginx server
FROM nginx:alpine

# Copy the build output to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the React app
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]