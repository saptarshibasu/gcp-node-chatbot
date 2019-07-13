FROM keymetrics/pm2:10-alpine
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL warn
ENV APP_PORT 4000
RUN adduser -h /home/chatbot -s /bin/bash chatbot; \
    chown -R chatbot /home/chatbot
USER chatbot
WORKDIR /home/chatbot
COPY app/ /home/chatbot
RUN npm install --production
EXPOSE 4000/tcp
ENTRYPOINT ["pm2-runtime","start","/home/chatbot/pm2.json"]