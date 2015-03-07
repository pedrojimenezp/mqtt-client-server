var mosca = require('mosca');
var jwt = require("jsonwebtoken");

var redis = {
  type: 'redis',
  redis: require('redis'),
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads
  host: "localhost"
};

var moscaSettings = {
  port: 1883,
  stats: false,
  backend: redis,
  persistence: {
    factory: mosca.persistence.Redis
  }
};

//here we start mosca
var server = new mosca.Server(moscaSettings);

server.authenticate = function(client, username, password, callback){
  if( username !== 'JWT' ) { return callback("Invalid Credentials", false); }
  jwt.verify(password.toString(), "secret", function(err, payload) {
    if( err ) { return callback("Error getting UserInfo", false); }
    // console.log("\n################## AUTHENTICATE ###################");
    console.log("Client authenticated: "+client.id);
    // console.log("####################################################");
    client.allowSubChannels = payload.subChannels;
    client.allowPubChannels = new RegExp(payload.pubChannels);
    return callback(null, true);
  });

};

server.authorizePublish = function (client, channel, payload, callback) {
  if (client.allowPubChannels && client.allowPubChannels.test(channel) === true) {
    return callback(null, true);
  } else {
    console.log("\n################# AUTHORIZE PUB ####################");
    console.log("This cliente can't publish to this channel: "+channel);
    console.log("####################################################");
    return callback(null, false);
  }
};

server.authorizeSubscribe = function(client, channel, callback) {
  if (client.allowSubChannels && client.allowSubChannels.indexOf(channel) !== -1) {
    return callback(null, true);
  } else {
    console.log("\n################# AUTHORIZE SUB ####################");
    console.log("This cliente can't subscribe to this channel");
    console.log("####################################################");
    return callback(null, false);
  }
};


server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

// fired whena  client is connected
server.on('clientConnected', function(client) {
  // console.log("\n################## ON CONNECTED ####################");
  console.log('Client connected', client.id);
  // console.log("####################################################");
});

// fired when a message is received
server.on('published', function(packet, client) {
  // console.log("\n################## ON PUBLISHED ####################");
  if (client) {
    console.log("Client: "+client.id+' published: '+packet.payload.toString());
  }
  // console.log("####################################################");
});

// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  // console.log("\n################# ON SUBSCRIBED ####################");
  console.log("Client: "+client.id+' subscribed to: '+topic);
  // console.log("####################################################");
});

// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed : ', topic);
});

// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id);
});

// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
  // console.log("\n################## ON DISCONNECTED ####################");
  console.log('clientDisconnected : ', client.id);
  // console.log("####################################################");
});
