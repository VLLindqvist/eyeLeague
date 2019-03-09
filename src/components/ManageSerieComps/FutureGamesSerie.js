import React, { Component } from 'react';
import settings from '../../settings.json';
import Select from 'react-select';

const customStyles = {
  clearIndicator: (provided, state) => ({
    ...provided,
  }),
  control: (provided, state) => ({
    ...provided,
    display: 'flex',
    boxShadow: 'none',
    border: state.isFocused ? '1px solid #557a95' : '1px solid #7395ae',
    '&:hover': {
      borderColor: state.isFocused ? '#557a95' : '#557a95',
    }
  }),
  container: (provided, state) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'rgba(0,0,0,0.4)' : state.isFocused ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
    ':hover': {
      color: state.isSelected ? 'rgba(0,0,0,0.4)' : state.isFocused ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
    },
  }),
  group: (provided, state) => ({
    ...provided
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    padding: 10
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgba(0,0,0,0.4)' : state.isFocused ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
    ':hover': {
      backgroundColor: state.isSelected ? 'rgba(0,0,0,0.4)' : state.isFocused ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
    },
  }),
  input: (provided, state) => ({
    ...provided
  }),
  loadingIndicator: (provided, state) => ({
    ...provided,
  }),
  loadingMessage: (provided, state) => ({
    ...provided,
  }),
  menu: (provided, state) => ({
    ...provided,
  }),
  menuList: (provided, state) => ({
    ...provided,
  }),
  menuPortal: (provided, state) => ({
    ...provided,
  }),
  placeholder: (provided, state) => ({
    ...provided,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? '#ededed' : state.isFocused ? '#fff' : '#fff',
    fontWeight: state.isSelected ? 'bold' : 'normal',
    color: state.isDisabled ? '#ccc' : state.isFocused ? 'black' : 'gray',
    // backgroundColor: state.isDisabled ? '#ededed' : state.isFocused ? '#fff' : '#fff',
    ':active': {
      backgroundColor: state.isSelected ? '#ccc' : '#fff',
    },
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

class FutureGames extends Component {
  constructor(props){
      super(props);

      this.state = {
        selectedMatch: null,
        data: this.props.data,
        teams: this.props.data.teams,
        games: this.props.data.games,
        bracketGames: this.props.data.bracket,
        gamesOld: [],
        bracketGamesOld: [],
        okVisibility: [],
        submitting: [],
        removing: [],
        removeStyle: [],
        remove: [],
        id: this.props.data.id,
        disabled: false,
        closing: false,
        teamOnes: [],
        teamTwos: [],
        options: []
      };

      this.mark = this.mark.bind(this);
      this.clickedDisabled = this.clickedDisabled.bind(this);
      this.createOptions = this.createOptions.bind(this);
      this.handleResChangeOne = this.handleResChangeOne.bind(this);
      this.handleResChangeTwo = this.handleResChangeTwo.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.submitTeams = this.submitTeams.bind(this);
      this.handleTeamChangeOne = this.handleTeamChangeOne.bind(this);
      this.handleTeamChangeTwo = this.handleTeamChangeTwo.bind(this);
      this.handleEnterPress = this.handleEnterPress.bind(this);
      this.resultsHasInput = this.resultsHasInput.bind(this);
      this.addMatch = this.addMatch.bind(this);
      this.removeMatch = this.removeMatch.bind(this);
  }

  mark(e, matchId) {
    let removeStyle = this.state.removeStyle.slice();
    let remove = this.state.remove.slice();

    if(removeStyle[matchId] !== null) {
      removeStyle[matchId] = null;
      remove[matchId] = false;
    }
    else {
      removeStyle[matchId] = {backgroundColor: "#d90900", borderColor: "#d90900"};
      remove[matchId] = true;
    }
    this.setState({removeStyle: removeStyle, remove: remove});
  }

  clickedDisabled(e) {
    console.log(e.target);
    setTimeout(() => {
      e.target.style.borderColor = "red";
    }, 2000).then(() => {
      e.target.style.borderColor = "";
    });
  }

  createOptions() {
    let options = this.state.teams.map((item, i) => {
      return {label: item, value: i, isDisabled: false};
    });
    this.setState({options: options});
  }

  addMatch(event) {
    event.preventDefault();
    this.setState({closing: true});
    fetch(settings.api + "seriematch/", {
            method: "POST",
            credentials: "include",
            body: `s=${this.state.id}`
    }).then(response => {
      if(!response.ok){console.log(response); throw Error(response.status);}
      return response.json()
    }).then(response => {
      this.setState({closing: false});
      console.log(response);
      this.props.fetchData();
    }).catch((error) => {

    });
  }

  async removeMatch(e) {
    let counter = -1;
    this.state.remove.forEach((item, i) => {
      if(item) {
        let removeArr = this.state.removing.slice();
        removeArr[i] = true;
        this.setState({removing: removeArr, disabled: true});
        ++counter;

        fetch((settings.api + "seriematch/?s=" + this.state.id
            + "&g=" + (i - counter)), {
            method: "DELETE",
            credentials: "include",
        }).then((response) => {
            if(!response.ok){throw response.statusText;}
            return response.json();
        }).then(response => {
          this.createOptions();
          this.props.fetchData();
          removeArr[i] = false;
          this.setState({removing: removeArr, disabled: false});
        }).catch(err => {
          console.log(err);
          removeArr[i] = false;
          this.setState({removing: removeArr, disabled: false});
        });
      }
    });
  }

  handleEnterPress(event) {
    event.preventDefault();
    if(event.currentTarget.className === "okButton") {
      this.handleSubmit(event);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const matchId = event.currentTarget.parentNode.parentNode.dataset.id;
    const relativeMatchId = event.currentTarget.parentNode.parentNode.dataset.relativematchid;
    let games = document.querySelector(".futureGamesContent").querySelectorAll(".game");
    games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonLoading";
    let submitArr = this.state.submitting.slice();
    submitArr[matchId] = true;
    this.setState({submitting: submitArr, disabled: true});

    let temp1 = JSON.stringify(this.state.games);
    let c = JSON.parse(temp1);
    this.setState({gamesOld: c});
    console.log(event.currentTarget.parentNode.parentNode.dataset.id);

    fetch(
      (settings.api + "seriematch/?s=" + this.state.id + "&g=" +
      event.currentTarget.parentNode.parentNode.dataset.id +
      "&r1=" + event.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].value +
      "&r2=" + event.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].value), {
      method: "PATCH",
      credentials: "include"
    }).then(response => response.json()
    ).then(response => {
      if(!response.status){console.log(response); throw Error(response.error);}

		}).then(response => {
      this.props.fetchData();
      games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonSparat";
      submitArr[matchId] = false;
      this.setState({submitting: submitArr, disabled: false});

      setTimeout(() => {
        if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonSparat") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterSave";
        }
      }, 2000);
      setTimeout(() => {
        if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterSave") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
        }
      }, 3000);

    }).catch((error) => {
			console.log(error);
      this.props.fetchData();
      games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonError";
      submitArr[matchId] = false;
      this.setState({submitting: submitArr, disabled: false});
      this.setState({ games: this.props.data.games, bracketGames: this.props.data.bracket});

      setTimeout(() => {
        if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonError") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterError";
        }
      }, 2000);
      setTimeout(() => {
        if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterError") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
        }
      }, 3000);
    });
  }

  handleTeamChangeOne(e, game) {
    let arrOnes = this.state.teamOnes.slice();
    arrOnes[game] = e.value;
    this.setState({teamOnes: arrOnes});

    fetch(settings.api + "seriematch/?s=" + this.state.id + "&g=" +
      game +
      "&t1=" + e.value, {
      method: "PATCH",
      credentials: "include"
    }).then(response => response.json()
    ).then(response => {
      if(!response.status){console.log(response); throw Error(response.error);}
		}).then(response => {
      this.props.fetchData();
      this.createOptions();
    }).catch((error) => {
			console.log(error);
      this.props.fetchData();
    });
  }

  handleTeamChangeTwo(e, game) {
    let arrTwo = this.state.teamTwos.slice();
    arrTwo[game] = e.value;
    this.setState({teamTwos: arrTwo});

    fetch(settings.api + "seriematch/?s=" + this.state.id + "&g=" +
      game +
      "&t2=" + e.value, {
      method: "PATCH",
      credentials: "include"
    }).then(response => response.json()
    ).then(response => {
      if(!response.status){console.log(response); throw Error(response.error);}
		}).then(response => {
      this.props.fetchData();
      this.createOptions();
    }).catch((error) => {
			console.log(error);
      this.props.fetchData();
    });
  }

  submitTeams(e, game, team1, team2) {
    e.preventDefault();

    fetch(
      (settings.api + "seriematch/?s=" + this.state.id + "&g=" +
      game +
      "&t1=" + team1 +
      "&t2=" + team2), {
      method: "PATCH",
      credentials: "include"
    }).then(response => response.json()
    ).then(response => {
      if(!response.status){console.log(response); throw Error(response.error);}
		}).then(response => {
      this.props.fetchData();
    }).catch((error) => {
			console.log(error);
      this.props.fetchData();
    });
  }

  handleResChangeOne(event, matchId, otherTeam, teamId) {
    event.preventDefault();
    let games = document.querySelector(".futureGamesContent").querySelectorAll(".game");
    const value = event.target.value;
    const relativeMatchId = event.currentTarget.parentNode.parentNode.dataset.relativematchid;
    let a = [];
    a = this.state.games.slice();
    if(value.match(/^[0-9\b]+$/) || value === "") {
      if(value >= 0 && value <= 99) {
        a[event.currentTarget.parentNode.parentNode.dataset.id].results[0] = value;
        this.setState({games: a});
      }
      else {
        a[event.currentTarget.parentNode.parentNode.dataset.id].results[0] = parseInt(value/10);
        this.setState({games: a});
      }

      if(event.currentTarget.parentNode.childNodes[otherTeam].value !== "" && value !== "") {
        if(value !== this.state.gamesOld[matchId].results[0]) {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButton";
        }
      }
      else {
        if(document.querySelector(".buttons").childNodes[0].className === "okButton") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterFail";
          setTimeout(() => {
            if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterFail") {
              games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
            }
          }, 500);
        }
        else {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
        }
      }
    }

    else {
      if(document.querySelector(".buttons").childNodes[0].className === "okButton") {
        games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterFail";
        setTimeout(() => {
          if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterFail") {
            games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
          }
        }, 500);
      }
      else {
        games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
      }

      if(this.props.bracket) { this.setState({bracketGames: a}); }
      else { this.setState({games: a}); }
    }
  }

  handleResChangeTwo(event, matchId, otherTeam, teamId) {
    event.preventDefault();
    let games = document.querySelector(".futureGamesContent").querySelectorAll(".game");
    const value = event.target.value;
    const relativeMatchId = event.currentTarget.parentNode.parentNode.dataset.relativematchid;
    let a = [];
    if(this.props.bracket) { a = this.state.bracketGames.slice(); }
    else { a = this.state.games.slice(); }

    if(value.match(/^[0-9\b]+$/) || value === "") {
      if(value >= 0 && value <= 99) {
        a[event.currentTarget.parentNode.parentNode.dataset.id].results[1] = value;
        if(this.props.bracket) { this.setState({bracketGames: a}); }
        else { this.setState({games: a}); }
      }
      else {
        a[event.currentTarget.parentNode.parentNode.dataset.id].results[1] = parseInt(value/10);
        if(this.props.bracket) { this.setState({bracketGames: a}); }
        else { this.setState({games: a}); }
      }

      if(event.currentTarget.parentNode.childNodes[otherTeam].value !== "" && value !== "") {
        if(this.props.bracket) {
          if(value !== this.state.bracketGamesOld[matchId].results[1]) {
            games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButton";
          }
        }
        else {
          if(value !== this.state.gamesOld[matchId].results[1]) {
            games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButton";
          }
        }
      }
      else {
        if(document.querySelector(".buttons").childNodes[0].className === "okButton") {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterFail";
          setTimeout(() => {
            if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterFail") {
              games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
            }
          }, 500);
        }
        else {
          games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
        }
      }
    }

    else {
      if(document.querySelector(".buttons").childNodes[0].className === "okButton") {
        games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHiddenAfterFail";
        setTimeout(() => {
          if(games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className === "okButtonHiddenAfterFail") {
            games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
          }
        }, 500);
      }
      else {
        games[relativeMatchId].childNodes[0].childNodes[3].childNodes[0].className = "okButtonHidden";
      }

      if(this.props.bracket) { this.setState({bracketGames: a}); }
      else { this.setState({games: a}); }
    }
  }

  resultsHasInput(event) {
    const matchId = event.currentTarget.parentNode.parentNode.dataset.id;
    const teamId = event.currentTarget.dataset.id;
    let otherTeam = 0;

    if(this.state.teamOnes[matchId] === this.state.teamTwos[matchId]) {
      return;
    }

    if(teamId === "0") {
      otherTeam = 2;
      this.handleResChangeOne(event, matchId, otherTeam, teamId);
    }

    else {
      this.handleResChangeTwo(event, matchId, otherTeam, teamId)
    }
  }

  componentWillMount() {
    this.createOptions();
    let a = Array.apply(null, Array(this.props.data.teams.length)).map(function (x, i) { return "okButtonHidden"; });
    let b = Array.apply(null, Array(this.props.data.teams.length)).map(function (x, i) { return false; });
    let d = Array.apply(null, Array(this.props.data.games.length)).map(function (x, i) { return false; });
    let e = Array.apply(null, Array(this.props.data.games.length)).map(function (x, i) { return false; });
    let f = Array.apply(null, Array(this.props.data.games.length)).map(function (x, i) { return false; });
    let g = Array.apply(null, Array(this.props.data.games.length)).map(function (x, i) {
      return null;
    });
    let h = Array.apply(null, Array(this.props.data.games.length)).map(function (x, i) { return false; });

    let arrOnes = Array.apply(null, Array(this.props.data.games.length)).map((x, i) => {
      if(this.props.data.games[i].teams[0] == null) {
        return null;
      }
      else {
        return this.props.data.teams[this.props.data.games[i].teams[0]];
      }
    });
    let arrTwos = Array.apply(null, Array(this.props.data.games.length)).map((x, i) => {
      if(this.props.data.games[i].teams[1] == null) {
        return null;
      }
      else {
        return this.props.data.teams[this.props.data.games[i].teams[1]];
      }
    });

    let temp1 = JSON.stringify(this.props.data.games);
    let c = JSON.parse(temp1);
    this.setState({remove: h, removeStyle: g, removing: f, okVisibility: a, submitting: b, gamesOld: c, teamOnes: arrOnes, teamTwos: arrTwos, dropdown1Open: d, dropdown2Open: e});
  }

  componentWillReceiveProps(input) {
    let temp1 = JSON.stringify(this.props.data.games);
    let c = JSON.parse(temp1);

    if(input.data.games.length !== this.props.data.games.length) {
      let f = Array.apply(null, Array(input.data.games.length)).map(function (x, i) { return false; });
      let g = Array.apply(null, Array(input.data.games.length)).map(function (x, i) {
        return null;
      });
      let h = Array.apply(null, Array(input.data.games.length)).map(function (x, i) { return false; });

      this.setState({remove: h, removeStyle: g, removing: f});
    }
    this.createOptions();
    this.setState({gamesOld: c, teams: input.data.teams, games: input.data.games, data: input.data});
  }

	render() {
    let content;
    let tabellTitel = "";
    let addMatchBtn;
    let removeMatchBtn;
    let games;
    let rubrik;

    tabellTitel = <h3 className="tabellTitel">Tabell</h3>;
    rubrik = <h3>Matchresultat</h3>

    let counter = 0;

    games = this.state.games.map((item, index) => {
      let text = "";
      if(this.state.submitting[index]) {
  			text = <div className="buttonLoadingAnim"></div>;
  		}

      let remove = (
        <div>
          <span style={this.state.removeStyle[index]}/>
          <span style={this.state.removeStyle[index]}/>
          <span style={this.state.removeStyle[index]}/>
          <span style={this.state.removeStyle[index]}/>
          <span style={this.state.removeStyle[index]}/>
        </div>
      );
      if(this.state.removing[index]) {
        remove = <div><div className="removingLoading"><div className="removingAnim"/></div></div>;
      }

      ++counter;
      let select1;
      let select2;
      let res;

      let options1 = Array.apply(null, Array(this.state.options.length)).map((x, i) => {
        return {
          label: this.state.options[i].label,
          value: this.state.options[i].value,
          isDisabled: this.state.options[i].isDisabled,
        };
      });

      let options2 = Array.apply(null, Array(this.state.options.length)).map((x, i) => {
        return {
          label: this.state.options[i].label,
          value: this.state.options[i].value,
          isDisabled: this.state.options[i].isDisabled,
        };
      });

      // if(item.teams[1] !== null) {
      //   if(options1[item.teams[1]].value === item.teams[1]) {
      //     options1[item.teams[1]].isDisabled = true;
      //   }
      // }
      //
      // if(item.teams[0] !== null) {
      //   if(options2[item.teams[0]].value === item.teams[0]) {
      //     options2[item.teams[0]].isDisabled = true;
      //   }
      // }

      select1 = (
        <Select
          hideSelectedOptions
          noOptionsMessage={() => {
            return "Inget lag matchar din sökning.";
          }}
          styles={customStyles}
          className='react-select-container team1'
          classNamePrefix="react-select"
          options={options1}
          backspaceRemovesValue={false}
          isClearable={false}
          captureMenuScroll={true}
          maxMenuHeight={200}
          name={"team1"}
          onChange={(e) => {
            this.handleTeamChangeOne(e, index);
            return;
          }}
          placeholder={"Välj lag"}
        />
      );

      select2 = (
        <Select
          hideSelectedOptions
          noOptionsMessage={() => {
            return "Inget lag matchar din sökning.";
          }}
          styles={customStyles}
          className='react-select-container team2'
          classNamePrefix="react-select"
          options={options2}
          backspaceRemovesValue={false}
          isClearable={false}
          captureMenuScroll={true}
          maxMenuHeight={200}
          name={"team2"}
          onChange={(e) => {
            this.handleTeamChangeTwo(e, index);
            return;
          }}
          placeholder={"Välj lag"}
        />
      );

      if(item.teams[0] !== null) {
        select1 = (
          <Select
            hideSelectedOptions
            noOptionsMessage={() => {
              return "Inget lag matchar din sökning.";
            }}
            styles={customStyles}
            className='react-select-container team1'
            classNamePrefix="react-select"
            options={options1}
            backspaceRemovesValue={false}
            isClearable={false}
            captureMenuScroll={true}
            maxMenuHeight={200}
            name={"team1"}
            onChange={(e) => {
              this.handleTeamChangeOne(e, index);
              return;
            }}
            placeholder={"Välj lag"}
            defaultValue={{label: this.state.teams[item.teams[0]], value: item.teams[0]}}
          />
        );
      }

      if(item.teams[1] !== null) {
        select2 = (
          <Select
            hideSelectedOptions
            noOptionsMessage={() => {
              return "Inget lag matchar din sökning.";
            }}
            styles={customStyles}
            className='react-select-container team2'
            classNamePrefix="react-select"
            options={options2}
            backspaceRemovesValue={false}
            isClearable={false}
            captureMenuScroll={true}
            maxMenuHeight={200}
            name={"team2"}
            onChange={(e) => {
              this.handleTeamChangeTwo(e, index);
              return;
            }}
            placeholder={"Välj lag"}
            defaultValue={{label: this.state.teams[item.teams[1]], value: item.teams[1]}}
          />
        );
      }

      res = (
        <div className="res">
          <input type='text' value={item.results[0]} disabled={this.state.disabled} data-id={0} onChange={this.resultsHasInput}></input>
          <div className="betweenLine"></div>
          <input type='text' value={item.results[1]} disabled={this.state.disabled} data-id={2} onChange={this.resultsHasInput}></input>
        </div>
      );

      if(item.teams[0] === null || item.teams[1] === null || this.state.teamOnes[index] === this.state.teamTwos[index]) {
        res = (
          <div style={{backgroundColor: "#ededed", borderColor: "#ccc"}} className="res" onClick={this.clickedDisabled}>
            <input disabled type='text' value={item.results[0]} data-id={0}></input>
            <div className="betweenLine"></div>
            <input disabled type='text' value={item.results[1]} data-id={2}></input>
          </div>
        );
      }

      return (
        <div className="game" key={index}>
          <form onSubmit={this.handleEnterPress} key={index} data-relativematchid={counter-1} data-id={index}>
            {select1}
            {res}
            {select2}
            <div className="buttons">
              <div className='okButtonHidden' onClick={this.handleEnterPress}>{text}<input type="submit"></input></div>
              <div className='changeButton'/>
            </div>
            <div className="mark">
              <div onClick={(e) => {return this.mark(e, index)}}>{remove}</div>
            </div>
          </form>
        </div>
      );
    });
    addMatchBtn = <div className="addMatchBtn" onClick={this.addMatch}></div>;
    removeMatchBtn = <div className="removeMatchBtn"><div onClick={this.removeMatch}/></div>;

    content = (
      <div>
        {rubrik}
        <div className="futureGamesContent">
          {games}
          <div className="handleGroupBtns">
            {addMatchBtn}
          </div>
          {removeMatchBtn}
        </div>
        {tabellTitel}
      </div>
    );

    return (
      <div id="futureGamesWrap">
        {content}
      </div>
		);
	}
}

export default FutureGames;
