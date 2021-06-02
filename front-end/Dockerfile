#
# This program has been developed by students from the bachelor Computer Science at
# Utrecht University within the Software Project course.
#
# © Copyright Utrecht University (Department of Information and Computing Sciences)
#

FROM node:14
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install
COPY . /app
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]
