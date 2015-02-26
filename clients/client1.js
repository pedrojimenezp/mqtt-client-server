var mqtt = require('mqtt')
 
client = mqtt.connect({port:1883, host:'localhost'});
 
console.log('Client publishing.. ');

client.publish('topic1', 'Client 1 is alive.. Test Ping! ' + Date());
client.publish('topic2', 'Client 1 is alive.. Test Ping! ' + Date());
client.publish('topic3', 'Client 1 is alive.. Test Ping! ' + Date());
 
client.end();
