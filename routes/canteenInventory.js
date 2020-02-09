const express = require("express");
const router = express.Router();
bodyParser = require("body-parser").json();
const query = require("../query");
const orgName = "movies"
const fs = require("fs");
let cc_config = JSON.parse(fs.readFileSync('connection.json', 'utf-8'));
const helper = require('../helpers/helper');
router.get("/", async (req, res, next) => {
    try {
        
        let records = [];
        let args = []
        let chainCodeFunction = cc_config[orgName].chaincode["chone_test"].fcn8
        let invoke = await helper.getResults(chainCodeFunction, args)
        records = invoke;
        if (invoke.length== 0) {
            res.status(404).send(model.statusFail("Records Not Found"));
            return;  
          }
        res.status(200).send({
            status: "SUCCESS",
            data: records
        });
    } catch (error) {
        console.log(error);
        res.send(model.statusFail(error));
    }
});

module.exports = router;
