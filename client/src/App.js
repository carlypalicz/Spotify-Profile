import React, { Component } from 'react';
import Pusher from 'pusher-js';
import format from 'date-fns/format';
import './App.css';

class App extends Component {
  constructor() {
    super();
    const urlParams = new URLSearchParams(window.location.search);
    const isUserAuthorized = urlParams.has('authorized') ? true : false;

    this.state = {
      isUserAuthorized,
      musicHistory: [],
      topTracks: [],
      topArtists: [],
      userInfo: [],
    };
  }

  componentDidMount() {
    const { isUserAuthorized } = this.state;

    if (isUserAuthorized) {
      //profile code//
      fetch('http://localhost:5000/profile')
        .then(res => res.json())
        .then(data => {
            this.setState({
              userInfo: data,
            });
        })
        .catch(error => console.log(error));
      //end profile code

      //recent tracks code
      fetch('http://localhost:5000/history')
        .then(res => res.json())
        .then(data => {
          this.setState({
            musicHistory: data,
          });
        })
        .catch(error => console.log(error));
      
        const pusher = new Pusher('6e7bde3c6aafdd5f652e', {
        cluster: 'eu',
        encrypted: true,
      });
      //end recent tracks code
      
      //top tracks code
      fetch('http://localhost:5000/toptracks')
        .then(res => res.json())
        .then(top_data => {
            this.setState({
              topTracks: top_data,
            });
        })
        .catch(error => console.log(error));
        //end top tracks code

        //top artists code
        fetch('http://localhost:5000/topartists')
        .then(res => res.json())
        .then(top => {
            this.setState({
              topArtists: top,
            });
        })
        .catch(error => console.log(error));
        //end top artists code

       //pusher update recent tracks 
      const channel = pusher.subscribe('spotify');
      channel.bind('update-history', data => {
        this.setState(prevState => {
          const arr = data.musicHistory
            .map(item => {
              const isPresent = prevState.musicHistory.find(
                e => e.played_at === item.played_at
              );
              if (isPresent === undefined) {
                return item;
              } else {
                return null;
              }
            })
            .filter(Boolean);
          return {
            musicHistory: arr.concat(prevState.musicHistory),
          };
        });
      });
      //end pusher
    }
    //user is not authorized
  }

  render() {
    const { isUserAuthorized, musicHistory, topTracks, topArtists, userInfo } = this.state;
    const connectSpotify = isUserAuthorized ? (
      ''
    ) : (
      <div className="login-container">
        <a className="login" href="http://localhost:5000/login">LOGIN WITH SPOTIFY</a>
      </div>
    );

    const TableItem = (item, index) => (
      <tr key={item.played_at}>
        <td>{index + 1}</td>
        <td className="content">{item.track_name}</td>
        <td className="content">{item.artist.join()}</td>
        <td className="content">{format(item.played_at, 'D MMM YYYY, hh:mma')}</td>
      </tr>
    );

    const TopTableItem = (item, index) => (
      <tr key={item.track_name}>
        <td>{index + 1}</td>
        <td className="content">{item.track_name}</td>
        <td className="content">{item.artist.join()}</td>
        <td className="content">{item.album}</td>
      </tr>
    );

    const TopArtistItem = (item, index) => (
      <div key={item.name}>
        <img alt="Artist" src={item.image}/>
        <p>{index+1}. {item.name}</p>
      </div>
    );


    const ProfileInfo = () => (      
      <div className='profile'>
        <div className="profile-left">
          <img alt="Profile" src={userInfo.image}/>
        </div>
        <div className="profile-right">
          <h1>{userInfo.name}'s Spotify Listening Profile</h1>
          <p>See your Spotify listening habits displayed in an easy to read and organized profile generated using the Spotify API and React.</p>
        </div>
      </div>
    );

    const RecentlyPlayed = () => (
      <div className="section">
        <h2>Recent Tracks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>ARTIST</th>
              <th>TIME</th>
            </tr>
          </thead>
          <tbody>{musicHistory.map((e, index) => TableItem(e, index))}</tbody>
        </table>
      </div>
    );

    const TopTracks = () => (
      <div className="section">
        <h2>Top Tracks</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>TITLE</th>
              <th>ARTIST</th>
              <th>ALBUM</th>
            </tr>
          </thead>
          <tbody>{topTracks.map((e, index) => TopTableItem(e, index))}</tbody>
        </table>
      </div>
    );

    const TopArtists = () => (
      <div className="section">
        <h2>Top Artists</h2>
          <div className="artist">{topArtists.map((e, index) => TopArtistItem(e, index))}</div>
      </div>
    );

    return (
      <div className="App">
        <header className="header">
          {isUserAuthorized ? null : 
            <div>
              <h1>Spotify Listening Profile</h1>
              <p>See your Spotify listening habits displayed in an easy to read and organized profile generated using the Spotify API and React.</p>
            </div>
          }
          {connectSpotify}
          {isUserAuthorized ? <ProfileInfo/> : null}
          {musicHistory.length !== 0 ? <RecentlyPlayed /> : null}
          {topTracks.length !== 0 ? <TopTracks /> : null}
          {topArtists.length !== 0 ? <TopArtists /> : null}
        </header>
      </div>
    );
  }
}

export default App;
