# This is a template Dockerfile for building a production frontend image with Vite/React.
# Use this when deploying to cloud providers or serving static files in production.

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --production && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
