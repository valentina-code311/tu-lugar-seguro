# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ARG VITE_SUPABASE_PROJECT_ID
ARG VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
ARG VITE_SUPABASE_URL
RUN npm run build

# Stage 2: nginx + Node bot-server en un solo contenedor
FROM node:20-alpine
RUN apk add --no-cache nginx

# Estáticos del frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Config de nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Bot-server
COPY index.mjs /app/bot-server/index.mjs

# Script de arranque
RUN node /app/bot-server/index.mjs &

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
