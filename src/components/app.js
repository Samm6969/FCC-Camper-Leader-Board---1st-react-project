import React, { Component } from 'react';
import axios from 'axios';
import CamperList from './camper_list';
import MDSpinner from 'react-md-spinner';

export default class App extends Component {
  constructor(props) {
    super(props);
    //setting up the state
    this.state = {
      recentCampers: [],
      allTimeCampers: [],
      currentView: 'recentCampers'
    };
  }

  //this function will run only one time before the first render()
  // & here we will fetch the API n for this we will need helper methods
  // and this is a life cycle method that runs one time
  componentWillMount() {
    //make concurrent requests and set state to response
    axios.all([this.fetchRecentCampers(), this.fetchAllTimeCampers()])
      .then(axios.spread((recentCampers, allTimeCampers) => {
        this.setState({
          recentCampers: recentCampers.data,
          allTimeCampers: allTimeCampers.data
         });
         //console.log(this.state);
      }));
  }
  //helper methods
  fetchRecentCampers() {
    return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/recent');
  }
  fetchAllTimeCampers() {
    return axios.get('https://fcctop100.herokuapp.com/api/fccusers/top/alltime');
  }
  changeView(currentView) {
    this.setState({ currentView });
  }

  //in axios, it returns a promise which is a new feature in ES6. Basically, we are making a network request n thats gonna
  //take some amt of time n the code not gonna able to run immediately perceeding that we have to wait for the response to
  //come back from the server before we can to anything else! So, to handle these promises - the delayed response, we use
  // .then function block to tell what to do next. So, we give all these array of functions and then we use .then block to
  //get access to the response.
  render() {
    if(!this.state.recentCampers.length && !this.state.allTimeCampers.length) {
      return <MDSpinner className="spinner" size={79} />
    }
    return (
      <div>
       <h2>{`Viewing Top ${this.state.currentView}`}</h2>
       <button onClick={() => this.changeView('recentCampers')} className="btn btn-primary">Recent</button>
       <button onClick={() => this.changeView('allTimeCampers')} className="btn btn-primary">All Time</button>
       <CamperList campers={this.state[this.state.currentView]}/>
      </div>
    );
  }
}
