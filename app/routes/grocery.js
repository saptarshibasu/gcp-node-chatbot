const express = require('express');
const winston = require('winston');
const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const config = require('config');

const router = express.Router();

// Webhook endpoint 
router.post('/grocery/webhook', async (request, response) => {
    winston.info('Within the grocery webhook');
    const agent = new WebhookClient({ request, response });
    let intentMap = new Map();
    intentMap.set('Grocery', getPrice);
    agent.handleRequest(intentMap);
});

router.post('/grocery/query', async (request, response) => {
    winston.info('Within the grocery query');
    const query = request.body.query;
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(config.get('dialogflow_project_id'), sessionId);
    const postrequest = {
        session: sessionPath,
        queryInput: {
          text: {
            text: query,
            languageCode: 'en-US',
          },
        },
      };
    
    const responses = await sessionClient.detectIntent(postrequest);
    winston.info('Detected intent');
    const result = responses[0].queryResult;
    winston.info(`Query: ${result.queryText}`);
    winston.info(`Response: ${result.fulfillmentText}`);
    response.send({"response": result.fulfillmentText});
});

function getPrice(agent) {
    let price;
    winston.info(agent.parameters.item);
    if(agent.parameters.item === 'egg') {
        price = 30;
    } else if(agent.parameters.item.toLowerCase() === 'rice') {
        price = 40;
    } else if(agent.parameters.item.toLowerCase() === 'cheese') {
        price = 50;
    } else if(agent.parameters.item.toLowerCase() === 'cumin Seed') {
        price = 60;
    } else if(agent.parameters.item.toLowerCase() === 'milk') {
        price = 70;
    } else {
        price = 0;
    }

    if(price === 0 ) {
        agent.add(`Sorry. Currently we don't have ${agent.parameters.item}.`);
    } else {
        agent.add(`The price of 1 unit of ${agent.parameters.item} is ${price}.`);
    }

}

module.exports = router;