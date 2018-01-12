require("dotenv").config();
var twitter = require("twitter");

const keys = require("./keys.js");
//Twitter API Keys
var client = new twitter(keys.twitter);
// Spotify API Keys
var spotify = keys.spotify;

//------------------------

var nodeArgs = process.argv;
var params = {
    screen_name: 'T1BasicMountain'
}
client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
        for (var i = 19; i > 0; i--) {
            console.log(tweets[i].text)
        };

    }
})