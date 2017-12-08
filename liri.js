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
var Spotify = require("node-spotify-api");
// Needed to handle "do-what-it-says"
var fs = require("fs");


// Variables to hold user arguments
var userRequest = process.argv;
var reqFunction = userRequest[2];
var reqTitle = userRequest[3];

// Switch Statement to process user functionality
switch(reqFunction) {
	case "my-tweets":
		tweets();
		//Ready
		break;
	case "spotify-this-song":
		song(reqTitle);
		//Ready
		break;
	case "movie-this":
		movie(reqTitle);
		//Ready
		break;
	case "do-what-it-says":
		fs.readFile("random.txt", "utf8", function(error, data){
			if (error) {
				return console.log(error);
			}
			// Data from file set to variable and split into an array at ","
			var dataArr = data.split(",");
			// variable that grabs position 0 in dataArr array which will be the switch arg below
			var doWhat = dataArr[0];
			// variable that grabs position 1 in dataArr array, will be arg passed to functions as a query value
			var doThis = dataArr[1];
			//Switch statement that repeats functionality from main statement to deal with whatever gets read in from random.txt
			switch(doWhat){
				case "spotify-this-song":
					song(doThis);
					break;
				case "my-tweets":
					tweets();
					break;
				case "movie-this":
					movie(doThis);
					break;
			};
		});
		//Ready
		break;
}
// Functions
// Twitter function that grabs user's tweets from their timeline and displays last 20 to console and writes tweets to logfile
function tweets(){
	// Call function for Twitter
	var client = new twitter({
  		consumer_key: twitterKeys.consumer_key,
  		consumer_secret: twitterKeys.consumer_secret,
  		access_token_key: twitterKeys.access_token_key,
  		access_token_secret: twitterKeys.access_token_secret
	});
	// Get Tweets "statuses/user_timeline" looks at the authenticated user and grabs updates from their timeline 
	client.get('statuses/user_timeline', function(error, tweets, response) {
   	// Handle the Error
   		if(error){
   			console.log(error);
   		}   			
   		// No error then cycle through tweets and display in console
   		for (var i = 0; i < tweets.length; i++) {
   			console.log("--------");
   			console.log(tweets[i].created_at);
   			console.log(tweets[i].text);
   			console.log("--------");
   			var tweetInfo = {
   				date: tweets[i].created_at,
   				tweet: tweets[i].text
   			};
   			logs(JSON.stringify(tweetInfo));
   		};
	});
}

//Movie This Function contacts OMDB with a query from user, then returns/logs some of the response if no user query default is Mr. Nobody
function movie(arr) {
	if (!arr) {
		arr = "Mr. Nobody";
	}
	// Call function for OMDB
	request('http://www.omdbapi.com/?t=' + arr + '&y=&plot=short&apikey=trilogy', function(error, response, body) {
		// If the request is successful (i.e. if the response status code is 200)
  		if (!error && response.statusCode === 200) {
		// Parse the body of the site and recover needed information about movie
		console.log("----- Your Movie Information -----");
    	console.log("Title of the movie: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year + "\nIMDB Rating of the Movie: "+ JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry of Production: " + JSON.parse(body).Country + "\nLanguage: "+ JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nCast: "+ JSON.parse(body).Actors);
    	console.log("----- Enjoy the Show -----");
    	// Log file functionality
    	var movieLog = {
    		title: JSON.parse(body).Title,
    		year: JSON.parse(body).Year,
    		imdb: JSON.parse(body).imdbRating,
    		rotten: JSON.parse(body).Ratings[1].Value,
    		country: JSON.parse(body).Country,
    		lang: JSON.parse(body).Language,
    		plot: JSON.parse(body).Plot,
    		cast: JSON.parse(body).Actors
    	};
    	// Send data to the Log File
    	logs(JSON.stringify(movieLog));

  		}
	});
}

//Spotify Functionality, contacts Spotify with song query, returns song data for top response and logs to console and log.txt
function song(arr) {
	if (!arr) {
		arr = "The Sign Ace of Base";
	}
	// Call function for Spotify
	var spotify = new Spotify({
  		id: "ebe3b059468f47a1b09765a5d02d7a1c",
  		secret: "12cba4a1aafa4d899dbce4c83e7255e0"
  	});
	
	spotify.search({ type: 'track', query: arr }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		} 
  		else {
  			var songInfo = data.tracks.items[0];
  			// variable to hold info to be sent to logfile
  			var songLog = {
  				title: songInfo.name,
  				artist: songInfo.artists[0].name,
  				album: songInfo.album.name,
  				preview_url: songInfo.preview_url
  			};
  			console.log("Song Title: " + songInfo.name);
    		console.log("By Artist: " + songInfo.artists[0].name);
    		console.log("From The Album: " + songInfo.album.name);
            console.log("Hear a preview: " + songInfo.preview_url);
            //logging returns to file
            logs(JSON.stringify(songLog));
  		}
	});
}

//Appends data returned from various functions to a log.txt file
function logs(arr){
	fs.appendFile("log.txt", arr+"\n", function(err){
		if (err){
			return console.log(err);
		}
		console.log("Data Written to Log.");
	});
}