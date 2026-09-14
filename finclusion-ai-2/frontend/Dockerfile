# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets to NGINX serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80
EXPOSE 5173

# We use 5173 mapping for dev, but default Nginx uses 80
CMD ["nginx", "-g", "daemon off;"]
