# syntax=docker/dockerfile:1
# Multi-stage build: deps → build → runtime (minimal, non-root)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN npm pkg delete scripts.prepare devDependencies && npm install --omit=dev --ignore-scripts
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)})"
CMD ["node", "dist/index.js"]
