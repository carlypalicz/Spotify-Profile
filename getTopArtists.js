const fetch = require('node-fetch');

const getTopArtists = accessToken => {
    const url = 'https://api.spotify.com/v1/me/top/artists?limit=10';
  
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => console.log(error));
  };

module.exports = getTopArtists;