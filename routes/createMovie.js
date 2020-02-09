const express = require("express");
const router = express.Router();
bodyParser = require("body-parser").json();
const fs = require("fs");
const model = require("./../models/models");
let cc_config = JSON.parse(fs.readFileSync('connection.json', 'utf-8'));
const invokeChainCode = require("../invokechaincode");

router.post("/", async (req, res, next) => {
  try {
    
    let movieDetails = req.body;
    
    movieDetails.shows.forEach((show,i) => {
        if(show.timings.length!=4) {
            res.status(401).send(model.statusFail("Error at row "+(i+1)+". Each show 4 times a day"));
            return;
        }
    });
    
    let orgName = "movies";
    
    let invoke = await invokeChainCode.invoke(
        JSON.stringify({
            fcn: cc_config[orgName].chaincode["chone_test"].fcn2,
            args: [JSON.stringify(movieDetails)],
            channelName: cc_config[orgName].channels.channel1,
            orderergrpc: cc_config["orderer"].grpc,
            peergrpc: cc_config[orgName].grpc,
            hfckeystore: cc_config[orgName].hfckeyStore,
            chaincodeID: cc_config[orgName].chaincodeID.chone_test
        })
    );

    if (invoke.length== 0) {
        const error = new Error('Error in chaincode.')
        error.httpStatusCode = 500;
        return next(error);
    }
    
    res.status(200).send(model.statusSuccess("Successfully Added Movie", invoke));
  } catch (error) {
    console.log(error)
    res.status(401).send(model.statusFail(error));
  }
});
module.exports = router;
