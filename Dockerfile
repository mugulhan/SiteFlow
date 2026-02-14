FROM ghcr.io/puppeteer/puppeteer:20.9.0

ARG NODE_ENV=production
ARG INSTALL_DEV=false
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

USER root

COPY package*.json ./

RUN if [ "${INSTALL_DEV}" = "true" ] || [ "${NODE_ENV}" = "development" ]; then npm install; else npm ci --omit=dev; fi && npm cache clean --force

COPY . .

RUN mkdir -p data && chown -R pptruser:pptruser /app

USER pptruser

VOLUME ["/app/data"]

EXPOSE 3000

CMD ["npm", "start"]
