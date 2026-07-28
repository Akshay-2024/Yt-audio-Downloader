# Use official Node.js Alpine base image
FROM node:20-alpine AS builder

# Install system-level dependencies
RUN apk add --no-cache python3 ffmpeg curl

# Download and install yt-dlp globally
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Install package dependencies
COPY package*.json ./
RUN npm ci

# Copy codebase and build production Next.js bundle
COPY . .
RUN npm run build

# Run application
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
