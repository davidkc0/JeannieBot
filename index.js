var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === '19283746534_hook_you') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// respond to post calls from facebook
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var incomingText = event.message.text;
      console.log('You sent the message', incomingText);
      sendTextMessage(sender, "Text received, echo: "+ incomingText.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})