const express = require('express');
const {WebhookClient} = require('dialogflow-fulfillment');

const router = express.Router();

// const posts = require('../resources/posts.json');

router.get('/grocery', async (req, res) => {
    const agent = new WebhookClient({ req, res });
});

function getPrice(agent) {
    let price;
    if(agent.parameters.item === 'Egg') {
        price = 30;
    } else if(agent.parameters.item === 'Rice') {
        price = 40;
    } else if(agent.parameters.item === 'Cheese') {
        price = 50;
    } else if(agent.parameters.item === 'Cumin Seed') {
        price = 60;
    } else if(agent.parameters.item === 'Milk') {
        price = 70;
    } else {
        price = 0;
    }

    if(price === 0 ) {
        agent.add(`Sorry. Currently we don't have ${agent.parameters.item}.`);
    } else {
        agent.add(`The price of 1 unit of ${agent.parameters.item} is ${price}.`);
    }

    let intentMap = new Map();
    intentMap.set('Grocery', getPrice);  
    agent.handleRequest(intentMap);
}

module.exports = router;