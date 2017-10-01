// Architecture WebHook Actions
'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// [START CALCULATOR ACTION]
exports.buildMaterialCalculator = functions.https.onRequest((request, response) => {
    const app = new App({ request, response });
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    //My Actions
    const Actions = {
        CALCULATE_MATERIALS: 'know.longwall'
    };

    //My Parameters
    const Parameters = {
        LENGTH_WALL: 'long_wall',
        HEIGHT_WALL: 'height_wall',
        POSITION_BRICK: 'brick_position'
    };

    //Type Operations
    const TypeOperations = {
        FOR_WALLS_HEADER: 'header',
        FOR_WALLS_STRETCHER: 'stretcher'
    };

    //Constant
    const BuildMaterialConstant = {
        BRICK_HEADER: 75,
        BRICK_STRETCHER: 40,
        CONCRETE_HEADER: 0.4,
        CONCRETE_STRETCHER: 0.2,
        SAND_HEADER: 0.06,
        SAND_STRETCHER: 0.02,
    };

    const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);

    function calculateMaterialsForWallHandler(app) {
       let longWall = app.getArgument(Parameters.LENGTH_WALL);
        let heightWall = app.getArgument(Parameters.HEIGHT_WALL);
        let brick_position = app.getArgument(Parameters.POSITION_BRICK);

        let meter2Wall = longWall * heightWall;

        if (brick_position == TypeOperations.FOR_WALLS_HEADER) {
            let numberOfBricksHead = roundValue(meter2Wall * BuildMaterialConstant.BRICK_HEADER);
            let amountOfSandHead = roundValue(meter2Wall * BuildMaterialConstant.SAND_HEADER);
            let amountOfConcreteHead = roundValue(meter2Wall * BuildMaterialConstant.CONCRETE_HEADER);
            let headResponse = makeResponseMaterials(numberOfBricksHead, amountOfSandHead, amountOfConcreteHead);
            app.tell(headResponse);
        } else if (brick_position == TypeOperations.FOR_WALLS_STRETCHER) {
            let numberOfBricksRope = roundValue(meter2Wall * BuildMaterialConstant.BRICK_STRETCHER);
            let amountOfSandRope = roundValue(meter2Wall * BuildMaterialConstant.SAND_STRETCHER);
            let amountOfConcreteRope = roundValue(meter2Wall * BuildMaterialConstant.CONCRETE_STRETCHER);
            let ropeResponse = makeResponseMaterials(numberOfBricksRope, amountOfSandRope, amountOfConcreteRope);
            app.tell(ropeResponse);
        } else {
            app.tell("Invalid Operation");
        }
    }

    function roundValue(value) {
        return Math.round(value * 100) / 100;
    }

    function makeResponseMaterials(bricks, sand, concrete) {

        let response = "Perfect. You need " + bricks + " bricks. " +
            "For the mortar you need " + sand + " cubic meters of sand. " +
            concrete + " bags of concrete. " +
            "Remember, this is just an estimate.";

        return response;
    }

    function sendResponseEnriched(category, img, suggestions) {
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
    actionMap.set(Actions.CALCULATE_MATERIALS, calculateMaterialsForWallHandler);
    app.handleRequest(actionMap);
});
// [END CALCULATOR ACTION]
