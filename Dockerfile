# Use Node.js as the base image
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Accept build arguments for environment variables (from GitHub Secrets)


# Copy the rest of the application files
COPY . .

# Build the Next.js app (it will use the .env file)
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]