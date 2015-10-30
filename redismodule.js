var redis = require('redis');

var _client;

var client = function (){
    if(_client) return _client;
    _client = redis.createClient();
    return _client;
}

module.exports.client = client;



