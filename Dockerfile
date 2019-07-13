FROM node:10.16.0 AS chatbotuibuilder
RUN useradd --create-home --shell /bin/bash chatbotui; \
    chown -R chatbotui /home/chatbotui;
USER chatbotui
WORKDIR /home/chatbotui
COPY app-ui/ /home/chatbotui
RUN mkdir /home/chatbotui/.npm; \
    npm config set prefix /home/chatbotui/.npm; \
    npm install --quiet --no-progress -g webpack@4.8.3; \
	npm install --quiet --no-progress;
ENV PATH=/home/chatbotui/.npm/bin:$PATH
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