var mqtt = require('mqtt');
var jwt = require("jsonwebtoken");

var username = "pedro";
var clientId = username+"_motos_moto2";
var subChannels = [username+"_motos", clientId];
var pubChannels = ["pedro_apps", "pedro_apps_app1", "pedro_apps_app2"];
var payload = {
  username: username,
  clientId: clientId,
  subChannels: subChannels,
  pubChannels: pubChannels
};

var newJWT = jwt.sign(payload, "secret", {expiresInMinutes: 10080});

client = mqtt.connect({
  port: 1883,
  host: 'localhost',
  clientId: clientId,
  username: 'JWT',
  password: newJWT.toString(),
  clean: false,
  reconnectPeriod: 2000
});

console.log('  started...');

var n = 1;

client.on('connect', function() {
  payload.subChannels.forEach(function(channel) {
    client.subscribe(channel, {qos:1}, function(err, granted) {
      if (err) {
        console.log("Can't subscribe to [topic1]: "+err);
      } else if (granted) {
        granted.forEach(function(channel) {
          if (channel.qos === 0 || channel.qos === 1 || channel.qos === 2) {
            console.log("Suscribed to "+channel.topic);
          } else {
            console.log("Can't subscribed to "+channel.topic);
          }
        });
      }
    });
  });
});

client.on('close', function() {
  // console.log("\nON CLOSE "+n);
  // // client.end(function(){
  //   console.log("\tconnection finished");
  // });
  // client.end();
  n++;
});

client.on('offline', function() {
  // console.log("\nON OFFLINE "+n);
});

client.on('error', function(error) {
  console.log("\nON ERROR");
  console.log("Error connecting to mqtt: "+error);
  client.end(function(){
    console.log("\tconnection finished");
  });
});

client.on('message', function(topic, message) {
  console.log("In the topic: ["+topic+"], receive: "+message.toString());
  var msg = JSON.parse(message.toString());
  client.publish(msg.clientId, "He recivido tu mensaje (Moto2)");
});

