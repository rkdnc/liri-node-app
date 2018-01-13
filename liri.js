require("dotenv").config();
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
const keys = require("./keys.js");
//Twitter API Keys
var client = new twitter(keys.twitter);
// Spotify API Keys
var spotify = new Spotify(keys.spotify);

//------------------------

var nodeArgs = process.argv;
var params = {
    screen_name: 'T1BasicMountain'
}
//This function will pull the most recent tweets for my twitter profile (this profile has only 20 tweets, all forming the poem Invictus by William E. Henley, at the time of writing this at least)
function recallTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.reverse().forEach(element => {
                console.log(`
            ------
            ${element.text}`
                    //${element.created_at} was omitted because my 20 tweets are park fo a poem, and that makes the formatting look ugly.
                );
            });
            // console.log(tweets[0]);

        }
    })
};

var songTitle = "Time Consumer";

//if songTitle is blank, replace it with 'The Sign'
function playSong(title) {
    spotify.search({
        type: 'track',
        query: title,
        limit: 1
    }, function (err, data) {
        if (!err) {
            var songObj = data.tracks.items[0];
            var artistName = songObj.album.artists[0].name;
            console.log(`
            Artist: ${artistName}
            Song title: ${title}
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}`);
            // console.log(songObj);
        } else {
            console.log(`Error: ${err}`);
        }
    })
}
// playSong(songTitle);

//OMDB API call

var request = require("request");
var movieName = "";
//Parse movieName to add +'s
function movieQuery() {
    request(`http://www.omdbapi.com/?t=${movieName}&apikey=trilogy`, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var movieObj = JSON.parse(body);
            // console.log(movieObj);
            console.log(`
                Movie Title: ${movieObj.Title}
                Year Released: ${movieObj.Year}
                IMDB Rating: ${movieObj.Ratings[0].Value}
                Rotten Tomtoes Rating: ${movieObj.Ratings[1].Value}
                Produced in: ${movieObj.Country}
                Language(s): ${movieObj.Language}
                Plot: ${movieObj.Plot}
                Actors: ${movieObj.Actors}
                 `);
        }
    })
};

var fs = require("fs");
