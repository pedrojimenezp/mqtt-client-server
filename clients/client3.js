var mqtt = require('mqtt')
client = mqtt.connect({
  port: 1883,
  host: 'localhost',
  clientId: "cliente3",
  clean: false
});

client.on('connect', function() {
  console.log("Connected to mqtt server");
  client.subscribe('topic2');
  console.log("Suscribe to [topic2] topic");
  client.subscribe('topic3');
  console.log("Suscribe to [topic3] topic");
});

client.on('close', function(error) {
  console.log("Connection closed");
});

client.on('offline', function(error) {
  console.log("Offline connection");
});

client.on('error', function(error) {
  console.log("Error connecting to mqtt");
});

client.on('message', function(topic, message) {
  console.log("In the topic: ["+topic+"], receive the message: "+message.toString());
});

console.log('Client started...');
