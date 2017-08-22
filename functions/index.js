// Architecture WebHook Actions
'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// [START MyAction]
exports.architectureHelps = functions.https.onRequest((request, response) => {
    const app = new App({ request, response });
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    //My Actions
    const Actions = {
        CALCULATE_DISTANCE: 'calculate.distance'
    };

    //My Parameters
    const Parameters = {
        ARCHITECT_CATEGORY: 'architecture-category',
        NUMBER_CATEGORY: 'number',
    };

    const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);

    // Fulfill action business logic
    function calculateDistanceHandler(app) {

        let architectureCategory = app.getArgument(Parameters.ARCHITECT_CATEGORY);
        let numberCategory = app.getArgument(Parameters.NUMBER_CATEGORY);

        if (architectureCategory == 'column' || architectureCategory == 'columns') {

            sendResponse({
                title: "Columns",
                msg: "I dont know about colums. but in another hand, what do you prefer know? Columns or beams?"
            }, {
                    src: "https://t4.ftcdn.net/jpg/00/82/94/69/240_F_82946972_wcTRSPuo0byFk4S3paw5RaBgtvAr5ZOr.jpg",
                    title: "Greek Columns"
                }, ['Columns', 'Beams']);

        } else if (architectureCategory == 'beam' || architectureCategory == 'beams') {

            sendResponse({
                title: "Beams",
                msg: "Between Beams is three sishos. Now you prefer continue with Columns or beams?"
            }, {
                    src: "http://www.myejen.com/decor/2014/05/Cozy-Dining-Area-Design-in-White-Cycladic-House-with-Beams.jpg",
                    title: "Greek Beams"
                }, ['Beams', 'Columns']);

        } else {
            app.tell('I dont found the correct Response -->' + architectureCategory + ' --> By Tohure');
        }
    }

    function sendResponse(category, img, suggestions) {
        if (screenOutput) {
            app.ask(app.buildRichResponse()
                .addSimpleResponse(category.msg)
                .addBasicCard(app.buildBasicCard(category.title).setImage(img.src, img.title))
                .addSuggestions(suggestions));
        } else {
            app.ask(category.msg);
        }
    }

    const actionMap = new Map();
    actionMap.set('calculate.distance', calculateDistanceHandler);
    app.handleRequest(actionMap);
});
// [END MyAction]
