FROM node:latest

# Create application folder
RUN mkdir -p /opt/myapp \
        &&\
        # Install dependencies
        apt-get update &&\
        apt-get -y install --no-install-recommends software-properties-common build-essential

WORKDIR /opt/myapp/

# Install dependencies
RUN apt-get update &&\
        apt-get -y install --no-install-recommends ca-certificates nano

# Clone repository
# RUN git clone https://github.com/hadaromer/Unified-Raster.git

COPY package*.json ./

RUN npm install 
#--only=production

# FROM alpine

COPY . .

WORKDIR /opt/myapp/Unified-Raster

ENTRYPOINT ["npm", "start"]