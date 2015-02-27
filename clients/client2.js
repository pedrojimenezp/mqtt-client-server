var mqtt = require('mqtt')

client = mqtt.connect({
  port: 1883,
  host: 'localhost',
  clientId: "cliente2",
  username:'cliente2',
  password:'password',
  clean: false,
  reconnectPeriod: 5000
});

console.log('Client started...');

var n = 1;

client.on('connect', function() {
  console.log("\nON CONNECT "+n);
  client.subscribe('topic1', {qos:1}, function(err, granted) {
    console.log("ON SUBSCRIBE");
    console.log(err);
    console.log(granted);
    // if (err) {
    //   console.log("Can't subscribe to [topic1]: "+err);
    // } else {
    //   console.log("Suscribed to topic");
    //   console.log(granted);
    // }
  });
});

client.on('close', function() {
  console.log("\nON CLOSE "+n);
  // client.end(function(){
  //   console.log("\tconnection finished");
  // });
  // client.end();
  n++;
});

client.on('offline', function() {
  console.log("\nON OFFLINE "+n);
});

client.on('error', function(error) {
  console.log("\nON ERROR");
  console.log("Error connecting to mqtt: "+error);
  client.end(function(){
    console.log("\tconnection finished");
  });
});

client.on('message', function(topic, message) {
  console.log("In the topic: ["+topic+"], receive the message: "+message.toString());
});

