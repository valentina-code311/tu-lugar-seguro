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

# Stage 2: nginx + bot-server en un solo contenedor
FROM node:20-alpine
RUN apk add --no-cache nginx

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY index.mjs /app/index.mjs

EXPOSE 80
CMD ["sh", "-c", "node /app/index.mjs & nginx -g 'daemon off;'"]
