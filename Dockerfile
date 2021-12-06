# syntax=docker/dockerfile:1
FROM node:12.16.3
 
WORKDIR ./

COPY . .

RUN npm install

COPY ["package.json", "package-lock.json*", "./"]

CMD [ "npm", "start" ]
