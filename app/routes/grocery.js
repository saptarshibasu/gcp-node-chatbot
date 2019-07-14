const express = require('express');
const winston = require('winston');
const {WebhookClient} = require('dialogflow-fulfillment');

const router = express.Router();

// const posts = require('../resources/posts.json');

router.post('/grocery', async (request, response) => {
    winston.info('within the grocery webhook');
    const agent = new WebhookClient({ request, response });
    let intentMap = new Map();
    intentMap.set('Grocery', getPrice);
    winston.info('within the grocery webhook - going to call handle request');
    agent.handleRequest(intentMap);
    winston.info('within the grocery webhook - handle request call returned');
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