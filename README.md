# SpotifyApi
Voor de tweede opdracht heb ik besloten om te gaan experimenteren met de Spotify web API. Deze API maakt het mogelijk om persoonlijke data van Spotify op te halen zoals favoriete nummers en playlists.

### Authorizatoion Proces
Voor de API van Spotify heb je drie verschillende manieren van authorization. Ik heb besloten om voor de Authorization code flow te gaan. Deze manier vindt plaatst strikt op de server en verbindt de gebruiker door met een redirect, uri om zo gebruik te kunnen maken van de gegeven data.

#### 1. Redirect gebruiker naar inlog url
````
let scopes = ['user-read-private', 'user-read-email', 'user-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
    redirectUri = 'http://localhost:3004/succes',
    clientId = '049ba3874e8c424d933a1f384e6a54c2';

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
````
De eerste stap van de authorization is het aanmaken van een authorization url. Bij deze URL moet je verschillende waarden meegeven zoals het clientId en ClientSecret. Daarnaast maak je ook nog een array met scopes aan. Deze scopes geven bij de authorization aan welke data toegestaan is voor de gebruiker om in te zien. 'user-modify-private' staat bijvoorbeeld voor het kunnen manipuleren van een gebruikers' playlist.
Na het inloggen wordt door middel van de redirect uri de gebruiker door geleidt naar de /succes route, waar het acces_token en refresh_token worden opgehaald

#### 2. Access en Refreshtoken
````
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
````


