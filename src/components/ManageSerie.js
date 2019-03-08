import React, { Component } from 'react';
// import { Link, Redirect } from 'react-router-dom';

import FutureGames from './ManageTourComps/FutureGames';
import Tabell from './Tabell';

import '../css/managetour.scss';
import '../css/bootstrap.css';

class ManageSerie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      teams: this.props.data.teams,
      showShadowBottom: {visibility: "visible"},
			showShadowTop: {visibility: "visible"},
      login: true,
      error: false,
      firstLoad: true,
      groupHeight: {height: '70px'},
      lastScrollY: 0,
      ticking: false,
      showModal: false
		};

    this.format = "ABCDEFGHIJKLMNOP";
    this.ref = React.createRef();

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  componentDidUpdate() {
    if(!this.state.loading) {
      if(this.state.firstLoad) {
        this.setState({firstLoad: false});
      }
    }
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  componentWillReceiveProps(input) {
    console.log('update');
    this.setState({
      data: input.data,
      teams: input.data.teams,
    });
  }

	render() {
    let resultatClass;
    let edit = "";

    edit = (
      <div className="editContainer">
        <div id="futureGamesWrap">
          <FutureGames
            data={this.state.data}
            fetchData={this.props.fetchData}
            bracket={false}
          />
        </div>
        <div className="tabellwrap">
          <div className="tabellcontent">
            <Tabell data={this.state.data} teams={this.state.data.teams}></Tabell>
          </div>
        </div>
      </div>
    );

    resultatClass = 'editWrap';

    return (
      <div id="manageTour" ref={this.ref}>
        <div className={resultatClass}>
          {edit}
        </div>
      </div>
    );
	}
}

export default ManageSerie;
