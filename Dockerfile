# ---- Stage 1: Build ----
FROM node:20-alpine AS build
WORKDIR /app

# Kopieer package bestanden en installeer alle dependencies
COPY package*.json ./
RUN npm install

# Kopieer de rest van je app en bouw het project
COPY . .
RUN npm run build

# ---- Stage 2: Productie (Lichtgewicht) ----
FROM node:20-alpine
WORKDIR /app

# Kopieer ALLEEN de gebouwde en op zichzelf staande .output map vanuit de build stage
COPY --from=build /app/.output/ ./

# Cruciale instellingen voor Nuxt 3 in Docker
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start de Nitro server direct vanuit de gekopieerde map
CMD ["node", "server/index.mjs"]