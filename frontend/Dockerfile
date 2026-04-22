FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build-prod

FROM node:20 AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 4000

CMD ["node", "dist/restaurant-rating/server/server.mjs"]

#FROM nginx:alpine

#RUN rm -rf /usr/share/nginx/html/*

#COPY --from=build /app/dist/restaurant-rating/browser /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80