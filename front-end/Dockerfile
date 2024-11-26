# Base Image for the Frontend React.js Application Docker image
FROM node:18-alpine
# The working directory (folder) for the Frontend React.js Application container
WORKDIR /app
# Copying the dependencies files for the Frontend React.js Application folder
COPY package*.json .
#Installing all the dependencies/framework/libraries for the Frontend React.js Application
RUN npm install
#Copying all the Frontend React.js Application files to the container working directory
COPY . .
#Frontend React.js Application container will run on this port
EXPOSE 3000
#Command to start the Frontend React.js Application Docker container
CMD ["npm", "start"]