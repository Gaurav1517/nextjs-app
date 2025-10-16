FROM node:20-alpine3.18

# Declare build time environment variables (if needed)
ARG SITE_URL_ENV

# Set default values for environment variables (if needed)
ENV SITE_URL=$SITE_URL_ENV

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]  # Start the Next.js server in production mode
