FROM node:18-alpine

WORKDIR /app

COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production"]; \
    then npm install --only=production; \
    else npm install && npm install typescript; \
    fi

COPY . .