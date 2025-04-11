FROM node:22-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nestjs -G nodejs

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source
COPY . .

# Make sure we have netcat for health checks
RUN apk add --no-cache netcat-openbsd

# Build the app
RUN npm run build

# Change ownership to the non-root user
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/main"] 