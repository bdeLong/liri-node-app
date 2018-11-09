// initializes variables that require dependencies
require("dotenv").config();
const Spotify = require("node-spotify-api");
const fs = require("fs");
const keys = require("./keys.js");
const request = require("request");
const moment = require("moment");
const spotify = new Spotify(keys.spotify);
const ombdKey = keys.omdb;
const bandsKey = keys.bands;
let liriCommand = process.argv[2];
let userInput = process.argv.slice(3).join(" ");
// calls the function that kicks Liri off
kickOff(liriCommand, userInput);
// liri kick off function.  Has a switch case that calls functions based on what the user indicates.  Passes the user input into those functions.
function kickOff(liriCommand, userInput) {
  switch (liriCommand) {
    case "spotify-this-song":
      spotifyThisSong(userInput);
      break;

    case "movie-this":
      grabMovie(userInput);
      break;

    case "concert-this":
      grabConcert(userInput);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
  }
};
// spotify function.
function spotifyThisSong(songName) {
  // if user doesn't specify a song, The Sign by Ace of Base is assigned to user's input.
  if (!songName) {
    songName = "The Sign, Ace of Base"
  };
  // makes request to spotify
  spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
    if (!err) {
      // logs response
      let songInfo = data.tracks.items;
      for (let i = 0; i < songInfo.length; i++) {
        if (songInfo[i] !== undefined) {
          let results = `\nArtist: ${songInfo[i].artists[0].name}\nAlbum: ${songInfo[i].album.name}\nSong Name: ${songInfo[i].name}\nPreview Link: ${songInfo[i].preview_url}\n`
          console.log(results);
          console.log(`====================`)
        }
      }
    }
    else { return console.log(`Error occurred: ${err}`); }
  });
};
// OMDB function
function grabMovie(movieName) {
  // if user doesn't specify a name, Mr. Nobody is assigned to the user's input.
  if (!movieName) {
    movieName = "Mr. Nobody";
  }
  // makes request
  request(`http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${ombdKey}`, function (error, response, body) {
    // If the request is successful logs the response.
    if (!error && response.statusCode === 200) {
      const movieData = JSON.parse(body);
      console.log(`\nMovie Title: ${movieData.Title}\n\nRelease Date: ${movieData.Released}\n\nIMDB Rating: ${movieData.Ratings[0].Value}\n\nRotten Tomatoes Rating: ${movieData.Ratings[1].Value}\n\nCountry Produced In: ${movieData.Country}\n\nLanguage: ${movieData.Language}\n\nPlot: ${movieData.Plot}\n\nStarring: ${movieData.Actors}`);
    }
  });
};
// Bands in town function
function grabConcert(artist) {
  // makes request
  request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${bandsKey}`, function (error, response, body) {
    // if there is no data for entered artist/band logs that they aren't playing venues
    if (!error && response.statusCode === 200) {
      const concertData = JSON.parse(body);
      if (concertData.length < 1) {
        console.log(`${artist} is not currently playing any venues.`);
      }
      // if artist/band has data, response is captured and logged here
      else {
        console.log(`\n${artist} is currently playing these venues:`)
        for (let i = 0; i < concertData.length; i++) {
          let dateTime = moment(concertData[i].datetime).format('MMMM Do, YYYY');
          console.log(`\nDate: ${dateTime}\nVenue Name: ${concertData[i].venue.name}\nLocation: ${concertData[i].venue.city}, ${concertData[i].venue.region} ${concertData[i].venue.country}\n`);
          console.log(`====================`)
        }
      };
    }
  });
};
// Do what it says function
function doWhatItSays() {
  // reads the random.txt file and runs the liri command within. Random.txt could be altered to run different commands. Default is spotify.
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    let dataArr = data.split(",");
    liriCommand = dataArr[0];
    userInput = dataArr[1];
    kickOff(liriCommand, userInput);
  });
};

