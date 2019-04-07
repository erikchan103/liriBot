require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var searchTerm= process.argv[3];

function findConcert() {
    let queryURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
    axios.get(queryURL)
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name + " at " + response.data[i].venue.city + ", " + response.data[i].venue.country + " at " + moment(response.data[i].datetime).format("MMM Do YY"));
            }
        })
}

if (action === "concert-this") {
    findConcert();
}

function findSong() {
    var headers = {
        "Authorization": "Bearer BQA_Pgs2X7w2YBu6XKCPVPYWKF3NR9zAAf79WtG0pefxJwg1oyEUJ6_35dtNeL3j03YpUacKbHzm7e8ccipT11B00uP62ei2qyK6QrDxPzATORPKDxXdrn_peyUw3tiSHB8tfGhto3fBFg",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    let queryURL = "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track";
    axios.get(queryURL, { headers })
        .then(function (response) {
            console.log("Song Name: " + response.data.tracks.items[0].name);
            console.log("Artist: " + response.data.tracks.items[0].artists[0].name);
            console.log("Album: " + response.data.tracks.items[0].album.name);
            console.log("Here is a link to a 30 second preview: " + response.data.tracks.items[0].preview_url);
        })

}

if (action === "spotify-this-song") {
    findSong();
}

function findMovie() {
    let queryURL = "http://www.omdbapi.com/?t=" + searchTerm + "&apikey=39484cd3&type=movie";
    axios.get(queryURL)
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("Rotten Tomato Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        })
}

if (action === "movie-this") {
    findMovie();
}

if (action === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        console.log(dataArr);
        if (dataArr[0] === "movie-this") {
            searchTerm=dataArr[1];
            findMovie();
        }
        if (dataArr[0] === "spotify-this-song") {
            searchTerm=dataArr[1];
            findSong();
        }
        if (dataArr[0] === "concert-this") {
            searchTerm=dataArr[1];
            findConcert();
        }
    })
}