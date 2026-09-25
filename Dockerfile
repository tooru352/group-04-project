FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install
RUN npm --prefix web install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "api"]
