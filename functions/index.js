// Architecture WebHook Actions
'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// [START MyAction]
exports.architectureHelps = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Fulfill action business logic
  function calculateDistanceHandler (app) {
   //let distance = DEFAULT_DISTANCE;
   let distanceCategory = app.getArgument('architecture-category');

   if(distanceCategory === 'column'){
     app.tell('The correct distance between two columns is two sishos -> By Tohure');
   } else if(distanceCategory === 'beam'){
     app.tell('Distance between beems is Unknown -> By Tohure');
   } else {
     app.tell('I dont found the correct Response -> By Tohure');
   }

   const actionMap = new Map();
   actionMap.set('calculate.distance', calculateDistanceHandler);

   app.handleRequest(actionMap);
  }
});
// [END MyAction]
