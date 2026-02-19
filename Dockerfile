# Build Stage for Frontend
FROM registry.access.redhat.com/ubi9/nodejs-22 AS frontend-builder
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Build Stage for Backend
FROM registry.access.redhat.com/ubi9/nodejs-22 AS backend-builder
WORKDIR /app/server

# Copy server package files
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy server source code
COPY server/ .

# Build backend
RUN npm run build

# Runtime Stage
FROM registry.access.redhat.com/ubi9/nodejs-22

WORKDIR /app

# Copy frontend build artifacts
COPY --from=frontend-builder /app/dist ./dist

# Copy backend build artifacts and dependencies
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/package.json

# Copy necessary files for runtime (if any other specific files needed, add here)

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "server/dist/server.js"]
