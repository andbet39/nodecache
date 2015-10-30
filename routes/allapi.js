/**
 * Created by andrea.terzani on 30/10/2015.
 */
var express = require('express');
var router = express.Router();
var https = require('https');
var redis = require('redis');
var redis_client = require('../redismodule');

/* GET users listing. */
router.get('/*', function(req, res, next) {

    var url = req.originalUrl;
    console.log('call URL: '+url);

    var client = redis_client.client();

    client.get(url,function(err, reply){
        console.log(reply);
        console.log(err);

        if(reply){
            console.log('found in cache');
            res.setHeader('Content-Type', 'application/json');
            res.send(reply);

        }else{
            console.log('not found in cache');

            var options = {
                host: 'www.codetutorial.io',
                port: 443,
                path: url
            };

            var req = https.get(options, function(httpres) {
                console.log('STATUS: ' + httpres.statusCode);
                console.log('HEADERS: ' + JSON.stringify(httpres.headers));

                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                httpres.on('data', function(chunk) {
                    bodyChunks.push(chunk);
                }).on('end', function() {
                    var body = Buffer.concat(bodyChunks);

                    client.set(url,body, function(err, reply) {
                        console.log("Cache saved");
                        console.log(reply);
                    });

                    res.setHeader('Content-Type', 'application/json');
                    res.send(body);
                });
            });

            req.on('error', function(e) {
                console.log('ERROR: ' + e.message);
            });
        }
    });

});

module.exports = router;
