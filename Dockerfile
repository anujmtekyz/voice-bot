FROM node:22-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source
COPY . .

# Build the app
RUN npm run build

# Change ownership to the non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 