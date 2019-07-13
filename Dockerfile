FROM node:10.16.0 AS chatbotuibuilder
USER node
WORKDIR /home/node
COPY app-ui/ /home/node
RUN mkdir /home/node/.npm; \
    npm config set prefix /home/node/.npm; \
    npm install --quiet --no-progress -g webpack@4.8.3; \
	npm install --quiet --no-progress;
ENV PATH=/home/node/.npm/bin:$PATH
RUN	npm run build

FROM keymetrics/pm2:10-alpine
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL warn
ENV APP_PORT 4000
RUN adduser -h /home/chatbot -s /bin/bash chatbot; \
    chown -R chatbot /home/chatbot
USER chatbot
WORKDIR /home/chatbot
COPY app/ /home/chatbot
COPY --from=chatbotuibuilder /home/chatbotui/dist /home/chatbot/public
RUN npm install --production
EXPOSE 4000/tcp
ENTRYPOINT ["pm2-runtime","start","/home/chatbot/pm2.json"]