FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

WORKDIR /usr/src/app/frontend

RUN ls /usr/src/app/dictionaries/

# Use defaults or ENV file
RUN npm install

RUN REACT_APP_API=http://efktr-api.azurewebsites.net npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "npm", "run", "serve" ]