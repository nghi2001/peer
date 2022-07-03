From node:alpine

WORKDIR /home/main/app

COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]