#Liri-Node-App

##What The Project Does

#### The Liri-Node-App is a node.js application that makes various API calls and returns relevant information based on user input.

#### There are four commands and each commmand requires an input. If no input is provided, some functions will return a default artist or movie.

    1. Concert-this: this command searches the Bands in Town Artist Events API for a **BAND** and render the following information about each event to the terminal =>
        1. Name of the venue
        1. Venue location
        1. Date of the Event (used moment to format this as "MM/DD/YYYY")

    1. Spotify-this-song: This command uses the Spotify API and will show the following information about the song you enter in your terminal =>
        1. Artist(s)
        1. The song's name
        1. A preview link of the song from Spotify
        1. The album that the song is from. 
        1. If no song is provided then the program will default to "The Sign" by Ace of Base.

    1. Movie-this: This command will also use the axios package and call the OMDB API in order to output the following information =>
        1. Title of the movie
        1. Year the movie came out
        1. IMDB Rating of the movie
        1. Rotten Tomatoes Rating of the movie 
        1. Country where the movie was produced
        1. Language of the movie
        1. Plot of the movie
        1. Actors in the movie
        1. If no movie is provided then the program will default to "Mr. Nobody" 