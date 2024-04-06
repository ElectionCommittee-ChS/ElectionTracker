FROM node:20

ENV NODE_ENV=production
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm ci --include=dev && npm cache clean --force
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm ci && npm cache clean --force
COPY backend/ ./
WORKDIR /usr/src/app/frontend
COPY frontend/ ./
RUN npm run build
WORKDIR /usr/src/app/backend

CMD [ "node", "index.js" ]
