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
De volgende stap van de authenticatie is het aanvragen van de access en refreshtoken. Dit kan je doen door met de ingebouwde functie .authorizeCodeGrant() deze data aan te vragen. Het enige wat je hier voor nodig hebt is een developer account met een gecreeerde applicatie. Hier kan je het clientId en clientSecret opvragen. Als het opvragen succesvol is verlopen krijg je een access  code die voor ongeveer een klein uur geldig is. Om te voorkomen dat de toegang verloopt kan je met de refresh token de toegang verlengen en dus opnieuw opvragen. Na deze stap heb je toegang tot de data van Spotify en kan je eindelijk beginnen met het ophalen van data.

#### 3. Opvragen playlist data
````

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
````
Voor mijn applicatie wilde ik de door mij gekozen playlists laten zien aan de gebruiker. Om een specifieke playlist te verkrijgen heb ik gebrui gemaakt van de functie .getPlaylist() waarbij ik het id van de playlist heb ingevuld. Ik wilde geen gebruik maken van overbodige data en heb daarom object destructuring toegepast om alleen gewenste data mee te geven aan het renderen van de pagina. 

#### 4. Renderen playlist
````
<main>
    <h1><%= data.playlistName %></h1>
    <ul id="songs-container">
        <% data.songs.forEach(song => { %>
            <li class="song-item">
                <figure>
                    <img src="<%= song.track.album.images[0].url %>"/>
                </figure>
                <h4><%= song.track.name %></h4>
                <section>
                    <% song.track.artists.forEach(artist => { %>
                        <p><%=artist.name %></p>
                    <% }) %>
                </section>
            </li>
        <% }) %>
    </ul>
</main>
````
Voor het renderen van de pagina heb ik gebruik gemaakt van EJS, om zo inline javascript toe te kunnen passen voor het renderen van de pagina's.
Data is het meegegeven object dat door middel van een forEach() functie dynamisch wordt gerenderd.

### Scroll Snap Align
Door gebrek aan tijd en kennis heb ik erg moeite gehad met een server side gerenderde lijst te manipuleren. Ik wilde de app toch wel graag visueel sterker maken en heb daarom scroll-snap-align: center toegepast om te zorgen dat de sildeshow elke keer het middelste element netjes uitlijnt.
![Screenshot 2023-06-20 at 11 25 51](https://github.com/EmileKost/SpotifyApi/assets/70690100/eca18220-5d6d-42bf-a473-73236642a39f)

### Reflectie
Ik baal best wel dat ik niet meer ben toegekomen aan de visuele kant van de opdracht. Toch ben ik wel heel tevreden met wat ik heb kunnen maken met de tijd die ik had. Ik heb heel veel onderzoek kunnen doen over de Spotify API waardoor ik deze nu erg goed snap, tevens heb ik hierdoor de juiste authorization methode kunnen vinden en deze toe te passen in mijn applicatie. Ik ga zeker mijn applicatie nog uitbreiden tot een geheel functionerend concept.

