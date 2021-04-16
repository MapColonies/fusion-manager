FROM node:12.18.3-alpine3.12 AS build

WORKDIR /opt/myapp

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

FROM nginx:1.19-alpine

COPY --from=build /opt/myapp/build /usr/share/nginx/html
