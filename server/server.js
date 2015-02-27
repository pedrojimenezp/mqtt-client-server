var mosca = require('mosca')

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
    console.log("\n################## AUTHENTICATE ###################");
    console.log("Username: "+username);
    console.log("Password: "+password);
    console.log("####################################################");
    return callback(null, true);
    // return callback(null, true);
    // if( username !== 'JWT' ) { return callback("Invalid Credentials", false); }

    // console.log('Passsord:'+password);

    // jwt.verify(password, new Buffer(self.clientSecret, 'base64'), function(err,profile){
    //       if( err ) { return callback("Error getting UserInfo", false); }
    //       console.log("Authenticated client " + profile.user_id);
    //       console.log(profile.topics);
    //       client.deviceProfile = profile;
    //       return callback(null, true);
    //     });
};

server.authorizePublish = function (client, topic, payload, callback) {
  console.log("\n################# AUTHORIZE PUB ####################");
  console.log("Topic: "+topic);
  console.log("Payload: "+payload);
  console.log("####################################################");
  return callback(null, {error:404});
  // callback(null, client.deviceProfile && client.deviceProfile.topics && client.deviceProfile.topics.indexOf(topic) > -1);
};

server.authorizeSubscribe = function(client, topic, callback) {
  console.log("\n################# AUTHORIZE SUB ####################");
  console.log("Topic: "+topic);
  console.log("####################################################");
  return callback(null, false);
  // callback(null, client.deviceProfile && client.deviceProfile.topics && client.deviceProfile.topics.indexOf(topic) > -1);
};
 

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
 
// fired whena  client is connected
server.on('clientConnected', function(client) {
  console.log("\n################## ON CONNECTED ####################");
  console.log('client connected', client.id);
  console.log("####################################################");
});
 
// fired when a message is received
server.on('published', function(packet, client) {
  console.log("\n################## ON PUBLISHED ####################");
  console.log('Published: '+packet.payload.toString());
  console.log("####################################################");
});
 
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log("\n################# ON SUBSCRIBED ####################");
  console.log("Client: "+client.id);
  console.log('subscribed to: '+topic);
  console.log("####################################################");
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
  console.log("\n################## ON DISCONNECTED ####################");
  console.log('clientDisconnected : ', client.id);
  console.log("####################################################");
});
