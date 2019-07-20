# Chatbot Using NodeJs, Kubernetes and Google Dialogflow on Google Cloud Platform

![Chatbot Image](../master/chatbot.jpeg?raw=true)


# Required Softwares

1. NodeJs
2. Git
3. Visual Studio Code
4. gcloud (Follow instructions on local shell from https://cloud.google.com/kubernetes-engine/docs/quickstart)
5. kubectl (Same as above)

# Optional Softwares

1. Virtual Box
2. Vagrant

Note: 

- Vagrant is useful for creating and testing Docker images in a local Windows environment

# Cloud Setup

## Google Cloud

- Create a new project named "gcp-node-chatbot" from Google Console
- Create the following items using the commands given below
  - a Kubernetes cluster named "chatbot" in region "asia-south1-a" 
  - a static IP named "gcp-node-chatbot-ip"

```
gcloud config set project gcp-node-chatbot
gcloud config set compute/zone asia-south1-a
gcloud container clusters create chatbot --zone asia-south1-a --num-nodes 1
gcloud compute addresses create gcp-node-chatbot-ip --global
```
- Create a service account named "dialogflow-custom" and assign the role "Dialogflow API Client" from Google Console . Create a key for the account.
- Create a secret named "dialogflow-key" with the downloaded key
```
gcloud container clusters get-credentials chatbot
kubectl create secret generic dialogflow-key --from-file=key.json=PATH-TO-KEY-FILE.json
```
- Create a build trigger to poll master branch from Google Console

Note: 

- The names given above are referred to in cloudbuild.yaml and kubedeployment.yaml
- The project name is also used in Express route and it needs to be externalized in a configuration file
- A domain name is required for creating managed certificate (Replace the domain name in kubedeployment.yaml)

## Google DialogFlow

- Create a new agent named "gcp-node-chatbot" and link it with the existing project
- Create an entity named "@GroceryItems"
   - Enter the items like "Egg", "Rice", "Salt" etc.
- Create a new intent "Grocery"
   - Add the training phrases "I want $item", "I want to buy $item" etc.
   - Add the parameter named "item" with entity as "Grocery Items" and value as "$item"
   - Enable Webhook
-  Go to Fulfilment and provide the url of the Webhook Restful API hosted in NodeJs
- Enable Smalltalk

Note:

- If the entities are not correctly identified in speech, go to the history History section and do the categorization mandatory. DialogFlow will then train the agent accordingly
- If the browser throws SSL Cipher suite related error, create a new SSL policy through Google Console, set the profile as "Compatible" and link the ingress app to it

# Build

- The build will be automatically triggered when the code is merged into the master branch
- The build can be manually triggered using the build trigger
- Make sure that the kubedeployment.yaml has at least some changes. Otherwise the build will not deploy the latest container. As we have used the latest tag for the container image, a dummy environment variable DUMMY_VAR_FOR_REDEPLOYMENT is used to store a value that is changed manually before every push


# Running in Local

## UI

- Go to app-ui folder and run "npm install" to downlaod all dependencies 
- Run "npm run watch". It will run the webpack in watch mode and build the UI in dist folder
- Open the index.html from the dist folder in a Chrome browser

## Backend

- Go to the app folder and run "npm install" to downlaod all dependencies 
- Install nodemon globally "npm i nodemon -g"
- Run "nodemon index.js" to run the Node application in port 4000