var mqtt = require('mqtt');
var jwt = require("jsonwebtoken");

var username = "pedro";
var appId = "appAndroid1";
var globalChannel = username+"/apps";
var personalChannel = globalChannel+"/"+appId;
var subChannels = [globalChannel, personalChannel];
var pubChannels = username+"\/motos\/*[a-zA-z0-9]*";


var payload = {
  username: username,
  clientId: personalChannel,
  subChannels: subChannels,
  pubChannels: pubChannels.toString()
};


var newJWT = jwt.sign(payload, "secret", {expiresInMinutes: 10080});

client = mqtt.connect({
  port: 1883,
  host: 'localhost',
  clientId: personalChannel,
  username: 'JWT',
  password: newJWT.toString(),
  clean: false,
  reconnectPeriod: 1000
});

console.log('Client started.. ');

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

// setTimeout(function(){
//   var pl = JSON.stringify({
//     message: "Hola moto1",
//     clientId: personalChannel
//   });
//   client.publish('pedro/motos', pl, function() {
//     console.log(arguments);
//   });
//   // client.publish('pedro/motos/moto1', pl);
//   // client.publish('pedro/motos/moto2', pl);
//   client.publish('pedro/moto/', pl, function() {
//     console.log(arguments);
//   });
// },5000);

client.publish('pedro/motos', "hola");

// client.publish('/pedro/motos/moto1', payload);

// payload = JSON.stringify({
//   message: "Hola moto2",
//   clientId: "pedro_apps_app1"
// });
// client.publish('pedro_motos_moto2', payload);
//
// payload = JSON.stringify({
//   message: "Hola a todas las motos",
//   clientId: "pedro_apps_app1"
// });
// client.publish('pedro_motos', payload);

client.on('message', function(topic, message) {
  console.log("In the topic: ["+topic+"], receive: "+message.toString());
});

client.on('error', function(error) {
  console.log(arguments);
});

client.on('offline', function() {
  console.log(arguments);
  console.log("offline");
});

client.on('close', function() {
  console.log(arguments);
  console.log("close");
});


// client.end();
