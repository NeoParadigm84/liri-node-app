//Required 
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

const chalk = require('chalk');
const log = console.log;
log(chalk.red.bgYellow("HELLO WORLD I'm LIRI! I’m SIRI’s 15th cousin. I’m your interactive assistant. \nPlease choose a category and type its command as listed below. \nThen type what you want to search for. \nThen leave the rest to me. Look out SIRI!"));
log(chalk.white.bgRed("MOVIE INFO \nCOMMAND: movie-this \nSEARCH: Movie Title \nEXAMPLE COMMAND: liri.js movie-this Rambo"));
log(chalk.white.bgGreen("CONCERT INFO \nCOMMAND: concert-this \nSEARCH: Artist \nEXAMPLE COMMAND: liri.js concert-this Kanye West"));
log(chalk.white.bgBlue("CONCERT INFO \nCOMMAND: spotify-this-song \n SEARCH: Song Title \n EXAMPLE COMMAND: liri.js spotify-this-song Old Town Road"));
log(chalk.white.bgMagenta("RANDOM SELECTION \nCOMMAND: do-what-it-says \n SEARCH: Song Title \n EXAMPLE COMMAND: liri.js do-what-it-says"));
//Spotify keys
const env = process.env;

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: env.SPOTIFY_ID,
    secret: env.SPOTIFY_SECRET
});


//CL input
var query = process.argv;
var type = process.argv[2];
var array = [];

//join name of arguments after name
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1); //plus sign error fix
var finalSearch = array.join(""); //Search query joined together to form string for any query below

//Googled switch statements used them to determine argument type (concert-this, movie-this, etc.)
switch (type) {
    case 'concert-this':
        concertMe()
        break;
    case 'spotify-this-song':
        spotifyIt()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'do-what-it-says':
        itSays()
        break;
    default:
        console.log(chalk.red.bgYellow("WHAT WOULD YOU LIKE TO SEARCH FOR?"));
}


// node liri.js spotify-this-song

function spotifyIt() {

    if (finalSearch === "") {
        finalSearch = "ace+of+base+the+sign"
    }

    spotify.search({
        type: 'artist,track',
        query: finalSearch
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n')

        var currData = `\n
    Artist: ${data.tracks.items[0].artists[0].name}
    Track: ${data.tracks.items[0].name}
    Preview: ${data.tracks.items[0].preview_url}
    Album: ${data.tracks.items[0].album.name}
            `
        console.log(currData)
        dataLog(currData)

    });
}

// node liri.js concert-this

function concertMe() {
    if (finalSearch === "") {
        console.log('\n')
        console.log("No Artist entered. Please enter an Artist")
        console.log('\n')
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + finalSearch + "/events?app_id=codingbootcamp").then(
            function (response) {
                if (response.data.length <= 0) {
                    console.log("No info for this Artist")
                } else {
                    for (var i = 0; i < response.data.length; i++) {

                        var currData = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Event Date: ${moment(response.data[i].datetime).format('LL')}
            `
                        console.log(currData)
                    }
                }

                dataLog(currData)
            }
        );
    }
}

// node liri.js movie-this

function movieThis() {

    if (finalSearch === "") {
        finalSearch = "mr+nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + finalSearch + "&y=&plot=short&apikey=trilogy").then(
        function (response) {

            var currData = `\n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
            `
            console.log(currData)
            dataLog(currData)
        }
    );

}

// node liri.js do-what-it-says

function itSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        finalSearch = dataArr[1];
        spotifyIt()
    });
}

//saves user input to log.txt

var logQuery = query.splice(0, 2)
logQuery = "\n" + query.join(" ") + "\n"
console.log(logQuery)

fs.appendFile("log.txt", logQuery, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log(chalk.red.bgYellow("AS YOU COMMAND!"));
    }

});

//saves user imput result to log.txt

function dataLog(data) {
    fs.appendFile("log.txt", data, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log(chalk.red.bgYellow("GOT WHAT YOU ARE LOOKING FOR! TAKE THAT SIRI! NOW I JUST NEED A VOICE...SIGH!"));
        }

    });
}