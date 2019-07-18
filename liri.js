//Required 
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

//Spotify keys
const env = process.env;

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: env.SPOTIFY_ID,
    secret: env.SPOTIFY_SECRET
});


//Input on CLI
var query = process.argv;
var type = process.argv[2];
var array = [];

//Loop through and join name of arguments after file name
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1); //Get rid of last plus sign, if left errors caused
var finalSearch = array.join(""); //Search query joined together to form string for any query below

