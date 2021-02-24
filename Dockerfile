FROM node:14.15.4
WORKDIR /auth-server
COPY . .
EXPOSE 5000
RUN npm i
CMD ["node", "index.js"]