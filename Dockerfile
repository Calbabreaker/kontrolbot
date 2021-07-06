FROM nikolaik/python-nodejs:python3.9-nodejs12

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]
