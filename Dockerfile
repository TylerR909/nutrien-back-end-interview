FROM node:22
WORKDIR /app

# Only copy in package and package-lock.json so we can run npm install as a cached Docker layer
COPY package*.json ./
RUN npm install

# Now copy in the rest of our code
COPY . ./

CMD ["npm", "run", "start"]