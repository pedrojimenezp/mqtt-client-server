# mqtt-client-server
An example of a MQTT server with Mosca.js and MQTT clients with mqtt.js 

This example is based in the tutorial of Arvind Ravulavaru http://thejackalofjavascript.com/getting-started-mqtt/

I extended a little bit the client functionality for learning purposes

Just go to the server folder and run npm install && node server.js

Then, go to the clients folder and run npm install, then run in different terminals the clients in this order [node client2.js, node client3.js, node client1.js].

The client2 are subscribe to the [topic1] and the client3 are subscribe to topics [topic2 and topic3] and they are listening for some message, the client1 publish messages to all topics [topic1, topic2, topic3].

For learn how this work go to the tutorial http://thejackalofjavascript.com/getting-started-mqtt/
