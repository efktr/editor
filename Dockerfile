FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN git submodule update --recursive --init && git submodule update --recursive --remote

WORKDIR /usr/src/app/dictionaries

RUN npm install && npm install -g webpack

RUN webpack

WORKDIR /usr/src/app/frontend

# Use defaults or ENV file
RUN npm install

RUN REACT_APP_API=http://efktr-api.azurewebsites.net/data npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "npm", "run", "serve" ]