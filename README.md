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

- Vagrant is useful for creating and testing Docker images in a local Windows environment. However, the existing Vagrantfile is not in an working state due to some lates updates in Ubuntu or Docker. This is an area that needs some additional work

# Cloud Setup

## Google Cloud Console

- Create a new project named "gcp-node-chatbot"
- Create a new Kubernetes cluster named "chatbot" in region "asia-south1-a"
- Reserve a static IP named "gcp-node-chatbot-ip"
- Create a managed certificate named "gcp-node-chatbot-cert". A domain name needs to be provided
- Create a service account named "dialogflow-custom" and assign the role "Dialogflow API Client". Create a key for the account.
- Create a secret named "dialogflow-key" with the downloaded key
- Create a build trigger to poll from master branch

Note: 

- The names given above are referred to in cloudbuild.yaml and kubedeployment.yaml
- The project name is also used in Express route and it needs to be externalized in a configuration file
- A domain name is required for creating managed certificate ()
- A managed certificate is required for TLS (HTTPS) 
- TLS (HTTPS) is required for communicating with Google DialogFlow. Also, latest version of Chrome doesn't work without TLS (HTTPS)
- Default SSL policy is minimum TLS 1.0. If browser doesn't support cipher suites that comes with the default SSL profile, create a new SSL profile with TLS 1.2 and link it with the managed certificate

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