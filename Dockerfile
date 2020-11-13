FROM node:12.18.4

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN adduser --disabled-password app

COPY . .

RUN chown -R app:app /opt/app

USER app

RUN npm install --production

EXPOSE 4000

CMD [ "node", "./src/app.js" ]