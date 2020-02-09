
const query = require("../query");
const orgName = "movies";
const fs = require("fs");
let cc_config = JSON.parse(fs.readFileSync('connection.json', 'utf-8'));

let getResults = async (fcn, args)=>{
  return await query.querypo(
      JSON.stringify({
        fcn: fcn,
        args: args,
        //args: [theatreID],
        channelName: cc_config[orgName].channels.channel1,
        orderergrpc: cc_config["orderer"].grpc,
        peergrpc: cc_config[orgName].grpc,
        hfckeystore: cc_config[orgName].hfckeyStore,
        chaincodeID: cc_config[orgName].chaincodeID.chone_test
      })
    );
}
module.exports = {
  getResults
};
