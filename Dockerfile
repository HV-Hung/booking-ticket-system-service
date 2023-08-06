# Stage 1: Build the Nest.js application using yarn
FROM node:16-alpine AS build

WORKDIR /app

COPY . .

# Install dependencies for building
RUN yarn install



# Build the application
RUN yarn run build
# Expose the port on which your Nest.js app is running (if needed)
EXPOSE 3000

# Start the Nest.js application
CMD ["node", "dist/main.js"]