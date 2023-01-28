FROM node:16

# Create app directory
WORKDIR /usr/src/amongus

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

RUN npm install
RUN npm i -g serve
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY build build
COPY backend backend
COPY .env .
COPY run.sh .

EXPOSE 9000
EXPOSE 9030

CMD [ "./run.sh" ]
