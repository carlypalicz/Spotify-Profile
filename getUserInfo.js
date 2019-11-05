const fetch = require('node-fetch');

const getUserInfo = accessToken => {
  const url = 'https://api.spotify.com/v1/me/';

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .catch(error => console.log(error));
};

module.exports = getUserInfo;