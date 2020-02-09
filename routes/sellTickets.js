const express = require("express");
const router = express.Router();
bodyParser = require("body-parser").json();
const fs = require("fs");
const model = require("./../models/models");
let orgName = "movies";
let cc_config = JSON.parse(fs.readFileSync('connection.json', 'utf-8'));
const invokeChainCode = require("../invokechaincode");
const moment = require("moment");
const helper = require('../helpers/helper');
router.post("/", async (req, res, next) => {
  try {
    
    let ticketDetails = req.body; 
    ticketDetails.number = moment().unix()+"";
    let invoke = await invokeChainCode.invoke(
        JSON.stringify({
            fcn: cc_config[orgName].chaincode["chone_test"].fcn6,
            args: [JSON.stringify(ticketDetails)],
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
    let args = [ticketDetails.number]
    let chainCodeFunction = cc_config[orgName].chaincode["chone_test"].fcn7
    let query = await helper.getResults(chainCodeFunction, args)
    records = query;
    if (invoke.length== 0) {
        res.status(404).send(model.statusFail("Records Not Found"));
        return;  
        }
    res.status(200).send({
        status: "SUCCESS",
        data: records
    });
  } catch (error) {
    console.log(error)
    res.status(401).send(model.statusFail(error));
  }
});
module.exports = router;
