FROM node:10

RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app

COPY ./ .

ARG REACT_APP_GA_ID=UA-109996966-1
ARG REACT_APP_KURENTO_WS_URL=wss://command.gorog.co:8433/kurento
ARG REACT_APP_ROG_API_URL=https://t6rmhz1g1f.execute-api.us-east-1.amazonaws.com/stage
ARG NODE_ENV=production

RUN npm install
RUN npm run build



