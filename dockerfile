FROM node:22-alpine3.19

WORKDIR /app/

COPY package*.json ./
RUN npm install

RUN npm install -g eslint prettier stylelint stylelint-config-standard stylelint-prettier

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]