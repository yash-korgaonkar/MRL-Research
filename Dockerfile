FROM node:20-alpine

# System deps for native module compilation
RUN apk add --no-cache git python3 make g++

# Expo + EAS CLI
RUN npm install -g expo-cli eas-cli @expo/ngrok

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8081 19000 19006

CMD ["npx", "expo", "start", "--tunnel"]
