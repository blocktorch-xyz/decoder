############### Stage 1 ###############
FROM node:16-alpine

# Create build directory
WORKDIR /usr/src/build

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . ./

RUN npm run build

############### Stage 2 ###############

FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# copy build file
COPY --from=0 /usr/src/build/dist ./dist

EXPOSE 8000

CMD [ "npm", "run", "start" ]
