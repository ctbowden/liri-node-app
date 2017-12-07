// LIRI Bot
// UNC Coding BootCamp
// Dec 2017
// Charles Bowden

// Requires for Liri

// Needed to handle "movie-this" functionality
var request = require("request");
// Needed to handle "my-tweets" functionality
var twitter = require("twitter");
// keys for twitter
var twitterKeys = require("./keys.js");
// Needed to handle "spotify-this-song" functionality
var spotify = require("node-spotify-api");
// Needed to handle "do-what-it-says"
var fs = require("fs");


// Variables to hold user arguments
var userRequest = process.argv;
var reqFunction = userRequest[2];
var reqTitle = userRequest[3];

// Switch Statement to process user functionality
switch(reqFunction) {
	case "my-tweets":
		// Call function for Twitter

		//End Process
		break;
	case "spotify-this-song":
		// Call function for Spotify

		//Break
		break;
	case "movie-this":
		// Call function for OMDB
		request('http://www.omdbapi.com/?t=' + reqTitle + '&y=&plot=short&apikey=trilogy', function(error, response, body) {
			// If the request is successful (i.e. if the response status code is 200)
  			if (!error && response.statusCode === 200) {
			// Parse the body of the site and recover needed information about movie
			console.log("----- Your Movie Information -----");
    		console.log("Title of the movie: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year + "\nIMDB Rating of the Movie: "+ JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry of Production: " + JSON.parse(body).Country + "\nLanguage: "+ JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nCast: "+ JSON.parse(body).Actors);
    		console.log("----- Enjoy the Show -----");
  			}
		});
		//Break
		break;
	case "do-what-it-says":
		// Call readFile Function

		//Break
		break;
}