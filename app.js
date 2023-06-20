
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3004;
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs')
app.set('views', './views');
app.use(express.static(path.resolve('public')))

app.use(cors());
app.use(bodyParser.json());


let scopes = ['user-read-private', 'user-read-email', 'user-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
    redirectUri = 'http://localhost:3004/succes',
    clientId = CLIENT_ID;

const credentials = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri:  'http://localhost:3004/succes',
}

let spotifyApi = new SpotifyWebApi(credentials);

// Create authorization URL
const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);

app.get('/', (req, res) => {
    res.redirect(authorizeUrl);
})

// Getting the code from url with req.query.code to retrieve acces token
let access_token;
let refresh_token;
let expires_in;

app.get('/succes', (req, res) => {

    let code = req.query.code;
    console.log(code);

    // Retrieve acces and refreshtoken
    spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        access_token = data.body['access_token'];
        refresh_token = data.body['refresh_token'];
        expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        spotifyApi.refreshAccessToken()
        .then(data => {
            console.log(`New access token is: ${data.body['access_token']}`)
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        res.redirect('/music');
    })
    .catch(err => {
        console.log(err);
    })
})


app.get('/music', (req, res) => {
    let spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(access_token);
    // Fetch drum and bass list
    spotifyApi.getPlaylist('4EVztQFzFhZDsVTlATvS1s')
    .then(data => {
        data = data.body;
        console.log(data.body)

        const playlistData = {
            ownerName: data.owner.display_name,
            playlistName: data.name,
            songs: data.tracks.items,
        }
    
        res.render('music', {
            pageTitle: 'Drum and Bass',
            data: playlistData
        })
    }).catch(err => {
        console.log(err);
    })
    
})


app.get('/house', (req, res) => {
    spotifyApi.getPlaylist('4BVDJqJ6OK2A77E3e8ZFb8')
    .then(data => {
        data = data.body;

        const playlistData = {
            ownerName: data.owner.display_name,
            playlistName: data.name,
            songs: data.tracks.items,
        }
        playlistData.songs.forEach(song => {
            console.log(song.track.album.images)
        })

        res.render('house', {
            pageTitle: 'House',
            data: playlistData
        })
    }).catch(err => {
        console.log(err);
    })
})

app.get('/salsa', (req, res) => {
    spotifyApi.getPlaylist('3T1EcS1qxCrjN7ZGAsTr4c')
    .then(data => {
        data = data.body;

        const playlistData = {
            ownerName: data.owner.display_name,
            playlistName: data.name,
            songs: data.tracks.items,
        }
        playlistData.songs.forEach(song => {
            console.log(song.track.album.images)
        })

        res.render('salsa', {
            pageTitle: 'Salsa',
            data: playlistData
        })
    }).catch(err => {
        console.log(err);
    })
})

app.listen(PORT, () => {
    console.log(`Fiesta Music server connected to: ${PORT}`);
})
