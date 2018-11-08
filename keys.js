console.log("this is loaded")
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = process.env.OMDB_API;

exports.bands = process.env.BANDS_API;