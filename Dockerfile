FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Next.js default port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]