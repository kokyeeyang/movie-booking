# Use an official Node.js image from the Docker Hub
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your backend is running on (5000 in this case)
EXPOSE 5000

# Define the command to start your Node.js app
CMD ["npm", "start"]
