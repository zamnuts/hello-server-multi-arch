FROM library/node:lts-slim

CMD ["index.js"]

COPY LICENSE package.json yarn.lock ./
RUN yarn install --production --verbose --pure-lockfile --non-interactive

COPY index.js ./
