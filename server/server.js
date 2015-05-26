var express = require('express');
var app = express();
var http = require('http');
var httpServer = http.Server(app);
var strava = require('strava-v3');

app.get('/auth', function(req, res) {

    res.send('<a href="' + strava.oauth.getRequestAccessURL({
        scope: "write"
    }) + '">Connect to strava</a>');
});

app.get('/', function(req, res) {

    console.log('code is ' + req.query.code);

    if (req.query.code) {
        strava.oauth.getToken(req.query.code, function(err, payload) {
            console.log(payload);
            var listUrl = 'http://' + req.headers.host + '/list/?access_token=' + payload.access_token;
            res.send('<a href="' + listUrl + '">List Act</a>');
        });
    } else {
        res.json({});
    }

});

app.get('/list', function(req, res) {
	
    console.log('access_token is ' + req.query.access_token);

    if (req.query.access_token) {
        strava.athlete.listActivities({
            'access_token': req.query.access_token
        }, function(err, payload) {
            console.log(payload);
            res.json(payload);
        });
    } else {
        res.json({});
    }
});

app.listen(3000);
