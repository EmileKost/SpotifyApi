'use strict';

const dragableContainer = document.getElementById('songs-container');

let favouriteSongContainer = document.querySelector('.favourite-song-container');
const favouriteBtn = document.getElementById('fav-btn');


function showFavouriteSong() {
    favouriteSongContainer.style.top = '20px';
    setTimeout(()=> {
        favouriteSongContainer.style.top = '-100px';
    }, 2000)
}

favouriteBtn.addEventListener('click', showFavouriteSong)
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowDown') {
        showFavouriteSong();
    }
})
