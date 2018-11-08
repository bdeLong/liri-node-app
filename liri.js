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

kickOff(liriCommand, userInput);

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

function spotifyThisSong(songName) {
  if (!songName) {
    songName = "The Sign, Ace of Base"
  };
  spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
    if (!err) {
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

function grabMovie(movieName) {
  request(`http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${ombdKey}`, function (error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      const movieData = JSON.parse(body);
      console.log(`Movie Title: ${movieData.Title}\n\n Release Date: ${movieData.Released}\n\n IMDB Rating: ${movieData.Ratings[0].Value}\n\n Rotten Tomatoes Rating: ${movieData.Ratings[1].Value}\n\n Country Produced In: ${movieData.Country}\n\n Language: ${movieData.Language}\n\n Plot: ${movieData.Plot}\n\n Starring: ${movieData.Actors}`);
    }
  });
};

function grabConcert(artist) {
  request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${bandsKey}`, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(JSON.parse(body));
      const concertData = JSON.parse(body);
      console.log(`${artist} is currently playing these venues:`)
      for (let i = 0; i < concertData.length; i++) {
        let dateTime = moment(concertData[i].datetime).format('MMMM Do, YYYY');
        console.log(`\nDate: ${dateTime}\nVenue Name: ${concertData[i].venue.name}\nLocation: ${concertData[i].venue.city}, ${concertData[i].venue.region} ${concertData[i].venue.country}\n`);
        console.log(`====================`)
      }
    }
  });
};

function doWhatItSays() {
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

