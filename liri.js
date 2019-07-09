require("dotenv").config()
const keys = require("./keys.js")
const axios = require("axios")
const moment = require("moment")
const Spotify = require('node-spotify-api')
const fs = require('fs')
const spotify = new Spotify(keys.spotify)


let command = process.argv[2]
let descriptor = process.argv.slice(3).join(" ")

//Create a writeFile function that we can put in each of the function commands.
const appendFile = returnedData => {
    fs.appendFile("./log.txt", JSON.stringify(returnedData, null, 2), "utf-8", error => {
        if (error) throw error
    })
}

/* 
concert-this
----------------------------------------------------------------------------------------------------------------------------------
syntax: node liri.js concert-this <artist/band name here>

This will search the Bands in Town Artist Events API for an artist and render the following information about each event to the terminal => Name of the venue, venue location, date of the Event (use moment to format this as "MM/DD/YYYY").
*/

const concertThis = () => {
    axios.get("https://rest.bandsintown.com/artists/" + descriptor + "/events?app_id=codingbootcamp")
        .then(response => {
            for (let i = 0; i < response.data.length; i++) {

                let venue = `Venue: ${response.data[i].venue.name} (${response.data[i].venue.city}, ${response.data[i].venue.country})`
                let date = `Date: ${moment(response.data[i].datetime, moment.ISO_8601).format('MM/DD/YYYY')}`
                console.log(venue)
                console.log(date)
                console.log("======================================")

                //Create an object with all data for the appendFile function
                let returnedData = {
                    Data_Type: `Information about the upcomming ${descriptor} concert`,
                    Venue: venue,
                    Date: date
                }

                appendFile(returnedData)
            }
        })
        .catch(error => console.log("This is the error: ", error))
}

/*
spotify-this-song
----------------------------------------------------------------------------------------------------------------------------------
syntax: node liri.js spotify-this-song '<song name here>'

This will show the following information about the song in your terminal/bash window => Artist(s), the song's name, a preview link of the song from Spotify, the album that the song is from. If no song is provided then your program will default to "The Sign" by Ace of Base.
*/

const spotifyThisSong = () => {

    if (!descriptor) descriptor = "The Sign"

    spotify.search({
            type: 'track',
            query: descriptor,
            limt: 1
        })
        .then(response => {
            console.log("Artist: ", response.tracks.items[0].album.artists[0].name)
            console.log("Title: ", descriptor)
            console.log("Link: ", response.tracks.items[0].external_urls.spotify)
            console.log("Album: ", response.tracks.items[0].album.name)
            console.log("======================================")

            //Create an object with all data for the appendFile function
            let returnedData = {
                Data_Type: `Information regarding the song ${descriptor}`,
                Artist: response.tracks.items[0].album.artists[0].name,
                Title: descriptor,
                Link: response.tracks.items[0].external_urls.spotify,
                Album: response.tracks.items[0].album.name
            }

            appendFile(returnedData)
        })
        .catch(error => {
            console.log(error)
        })
}

/*
movie-this
----------------------------------------------------------------------------------------------------------------------------------
syntax: node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window: Title of the movie, year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, country where the movie was produced, language of the movie, plot of the movie and actors in the movie.
*/

const movieThis = () => {

    if (!descriptor) descriptor = "Mr. Nobody"

    axios.get("https://www.omdbapi.com/?t=" + descriptor + "&y=&plot=short&apikey=trilogy")
        .then(response => {
            console.log("Title: ", response.data.Title)
            console.log("Release Year: ", response.data.Released)
            console.log("IMDB Rating: ", response.data.Ratings[0].Value)
            console.log("Rotten Tomatoes: ", response.data.Ratings[1].Value)
            console.log("Country: ", response.data.Country)
            console.log("Language: ", response.data.Language)
            console.log("Plot: ", response.data.Plot)
            console.log("Cast: ", response.data.Actors)
            console.log("======================================")

            //Create an object with all data for the appendFile function
            let returnedData = {
                Data_Type: `Information regarding the movie ${descriptor}`,
                Title: response.data.Title,
                Year: response.data.Released,
                IMDB: response.data.Ratings[0].Value,
                RottenTomatoes: response.data.Ratings[1].Value,
                Country: response.data.Country,
                Plot: response.data.Plot,
                Cast: response.data.Actors
            }

            appendFile(returnedData)
        })
}

/*
do-what-it-says
----------------------------------------------------------------------------------------------------------------------------------
syntax: node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands. It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
*/

const doWhatItSays = () => {
    fs.readFile('./random.txt', 'utf8', (error, data) => {
        if (error) throw error

        let dataArray = data.split(",")
        command = dataArray[0]
        descriptor = dataArray[1]

        //***!ASK QUESTION IF THIS IS OK TO CHANGE VALUE OF GLOBAL VARIABLE CONSIDERING IT IS ERASED EVERY TIME A COMMAND IS RUN!***
        spotifyThisSong(command, descriptor)
    })
}

//Use a switch statement to take the command input and run all necessary functions
switch (command.toLowerCase()) {
    case 'concert-this':
        concertThis()
        break;
    case 'spotify-this-song':
        spotifyThisSong()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'do-what-it-says':
        doWhatItSays()
        break;
    default:
        console.log(`Command not recognized, please use one of the following commands:   concert-this
                                                                    spotify-this-song
                                                                    movie-this
                                                                    do-what-it-says`)
}