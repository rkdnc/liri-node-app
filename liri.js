require("dotenv").config();
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
const keys = require("./keys.js");
var inquirer = require("inquirer");
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
                    //${element.created_at} was omitted because my 20 tweets are park of a poem, and that makes the formatting look ugly.
                );
            });
            liriInit();

        }
    })
};
//if songTitle is blank, replace it with 'The Sign'
function playSong() {
    inquirer.prompt([{
        type: "input",
        message: "What do you want me to look up?",
        name: "query"
    }]).then(function (inquirerResponse) {
        spotify.search({
            type: 'track',
            query: inquirerResponse.query,
            limit: 1
        }, function (err, data) {
            if (!err) {
                var songObj = data.tracks.items[0];
                var artistName = songObj.album.artists[0].name;
                console.log(`
            Artist: ${artistName}
            Song title: ${inquirerResponse.query}
            Album Name: ${songObj.album.name}
            Preview URL: ${songObj.preview_url}`);
                liriInit();
            } else {
                console.log(`Error: ${err}`);
            }
        })
    })
};
// playSong(songTitle);

//OMDB API call

var request = require("request");
//Parse movieName to add +'s
function movieQuery() {
    inquirer.prompt([{
        type: "input",
        message: "What do you want me to look up?",
        name: "query"
    }]).then(function (inquirerResponse) {
        request(`http://www.omdbapi.com/?t=${inquirerResponse.query}&apikey=trilogy`, function (err, response, body) {
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
                 liriInit();
            }
        })
    })
};
//Opens the text file and reads what's inside, triggering a command
var fs = require("fs");

function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
    })
};



function liriInit() {
    inquirer.prompt([{
            type: "list",
            message: "Hello! What would you like to do?",
            choices: ["Read my tweets", "Spotify this song", "Movie this!", "Do whatever"],
            name: "userCommand"
        },
        {
            type: "confirm",
            message: "Are you sure?",
            name: "confirm",
            default: true
        }
    ]).then(function (inquirerResponse) {
        if (inquirerResponse.confirm) {
            switch (inquirerResponse.userCommand) {
                case "Read my tweets":
                    recallTweets();
                    break;
                case "Spotify this song":
                    playSong();
                    break;
                case "Movie this!":
                    movieQuery();
                    break;
                case "Do whatever":
                    doThis()
                    break;
            }
        }
    })
}
liriInit();