# Build Stage for Frontend
FROM registry.access.redhat.com/ubi9/nodejs-22 

USER root

WORKDIR /usr/iframe-production

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start", "--prefix", "server"]
