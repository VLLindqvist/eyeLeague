import React, { Component } from 'react';
import settings from "../settings.json";
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import Login from "./components/Login.js";
import CreatableSelect from 'react-select/lib/Creatable';

import ManageSerie from './ManageSerie';

import '../css/manageS.scss';
import '../css/index.scss';
import '../css/createModal.scss';

let customStyles = {
  clearIndicator: (provided, state) => ({
    ...provided,
		'&:hover': {
			cursor: 'pointer',
			color: 'red',
		}
  }),
  control: (provided, state) => ({
    ...provided,
    display: 'flex',
    boxShadow: 'none',
    border: state.isFocused ? '1px solid #557a95' : '1px solid #7395ae',
		borderColor: "red",
		transition: 'all 0.5s ease',
    '&:hover': {
      borderColor: state.isFocused ? '#557a95' : '#557a95',
    }
  }),
  container: (provided, state) => ({
    ...provided,
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
    ...provided
  }),
	multiValue: (provided, state) => ({
		...provided,
		'&:hover': {
			cursor: 'pointer',
		}
	}),
	multiValueRemove: (provided, state) => ({
		...provided,
		'&:hover': {
			backgroundColor: 'inherit',
			color: 'red',
		}
	}),
	multiValueLabel: (provided, state) => ({
		...provided,
	}),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  }
}

const comps = {
	DropdownIndicator: null,
};

const createOption = (label: string) => ({
  label,
  value: label,
});

class ManageS extends Component {

	constructor(props){
		super(props);
		document.title = "Hantera serier";

		this.state = {
			data: [],
			loading: true,
			league: false,
			login: true,
			error: false,
			showShadowBottom: {visibility: "hidden"},
			showShadowTop: {visibility: "hidden"},
			status: false
		};

		this.show = this.show.bind(this);
		this.close = this.close.bind(this);
		this.fetchData = this.fetchData.bind(this);

		this.fetchData();
	}

	fetchData() {
		fetch(settings.api + "serie", {
            method: "GET",
            credentials: "include"
        }).then(response => {
			if(!response.ok){console.log(response); throw Error(response.status);}
			return response.json()
		}).then(response => {
			this.setState({
				data: response
			});
			if(response.length > 7){this.setState({showShadowBottom: {visibility: "visible"}});}
			else {this.setState({showShadowBottom: {visibility: "hidden"}});}
			this.setState({loading: false});
			//console.log(response);
		}).catch((error) => {
			console.log(error);
			if({Error: '401'}) {
				this.setState({loading: false, login: false});
			}
			else {
				this.setState({loading: false, error: true});
			}
		});
	}

	show(){
			this.setState({status: true});
	}

	close(){
		this.setState({status: false});
		this.fetchData();
	}

/*---------------------------RENDER--------------------------*/

	render() {
		if(this.props.match.params.id) {
			return (
				<div>
					<ManageSerie id={this.props.match.params.id} />
				</div>
			);
		}

		else {
			let serier = [];

			if(!this.state.data.length) {
				serier = (
					<div className="skapaNy" onClick={this.show}>
							<div className="skapaNyTitel">
								Skapa ny serie
							</div>
					</div>
				);
			}
			else {
        let counter;
				serier = this.state.data.map((item, index, array) => {

					const datum = new Date(item.created);
          counter = item.id;
					return (
							<div className="tur" key={item.id}>
								<div>
									<Link to={settings.url + "manage/" + item.id}>
										<li key={index}>
											<div className="turinfo">
												<p>
													{"Skapad: " + datum.getFullYear() + "-" + (parseInt(datum.getMonth())+1) + "-" + datum.getDate()}
												</p>
											</div>
											<div className="turtitel">
												{item.name}
											</div>
										</li>
									</Link>
								</div>
								<div><Link to={settings.url + "t/" + item.id}>Visningssida</Link></div>
							</div>
						)
				});

				serier.push(
					<div className="skapaNy" onClick={this.show} key={counter + 1}>
							<div className="skapaNyTitel">
								Skapa ny serie
							</div>
					</div>
				);
			}

			//console.log(window.innerHeight);
	    return (
				<div id="manageS">
					<Modal centered="true" show={this.state.status} onHide={this.close}>
		        <Modal.Body>
              <div className="close" onClick={this.close}>&times;</div>
							<CreateS close={this.close}/>
            </Modal.Body>
          </Modal>
					<div className="rubrik">
						<h2>Hantera serier</h2>
					</div>
					<div className="turWrap">
						<div className="turContent">
							<ul>{serier}</ul>
						</div>
					</div>
				</div>
			);
		}
	}
}

class CreateS extends Component {
	constructor(props){
		super(props);
		this.state = {
			serieName: "",
			tName: "",
			teams: [],
			tNumbs: 2,
			tInfo: '',
			id: "",
			loading: false,
			isEmpty: false,
			asterisk: true,
			asterisk2: true,
			counter: 0,
			nameStyle: {},
			teamsStyle: {},
			nameErrormsg: "",
			teamsErrormsg: "",
			nameError: false,
			teamsError: false
		};

		this.handleChange = this.handleChange.bind(this);
	  this.handleTeamSubmit = this.handleTeamSubmit.bind(this);
		this.handleTnumber = this.handleTnumber.bind(this);
		this.createNew = this.createNew.bind(this);
		this.serieName = this.serieName.bind(this);
		this.remove = this.remove.bind(this);
		this.emptyField = this.emptyField.bind(this);
		this.wordCount = this.wordCount.bind(this);
		this.focusOnField = this.focusOnField.bind(this);
		this.focus = this.focus.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);

		document.title = "Skapa ny serie"; //Flik titel
	}

	focus(e) {
		e.currentTarget.parentNode.childNodes[2].className = 'placeToLabel';
		if(e.currentTarget.parentNode.className === "fält name") {
			this.setState({namePlacehStyle: {color: "#d1af47"}, name_style: {borderColor: "#d1af47"}});
		}
		else {
			this.setState({teamsPlacehStyle: {color: "#d1af47"}, teams_style: {borderColor: "#d1af47"}});
		}
	}

	serieName(e) {
		this.setState({serieName: e.target.value, asterisk: true, nameError: false, nameStyle: {}});
		if(e.target.value.length === 40){
			this.setState({nameError: true, nameErrormsg: "Serienamet får innehålla max 40 tecken", nameStyle: {borderColor: "red"}});
		}
		if(e.target.value.length >= 1){
			this.setState({asterisk:false});
		}

	}

	handleChange(e) {
		this.setState({tName: e, teamsStyle: {}});
		if(e.length === 25){
			let remove = e.slice(0, 24);
			this.setState({tName: remove, teamsError: true, teamsErrormsg: "Lagnamn får innehålla max 25 tecken", teamsStyle: {borderColor: "red"}});
		}
	}

	handleTnumber(event){
		if(event.target.value.match(/^[0-9\b]+$/) || event.target.value === "") {
				if(event.target.value > this.state.teams.length) {
					this.setState({tNumbs: this.state.teams.length, isEmpty: false});
				}
				else {
				this.setState({tNumbs: event.target.value, isEmpty : true});
			}
		}
	}

	handleTeamSubmit(e) {
		this.setState({teams: e});
	}

	handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
				if(!this.state.tName) {
					if(e.key === 'Enter') { document.querySelector(".submit").click(); }
					return;
				}

				let duplicate = false;
				for(let i = 0; i < this.state.teams.length; ++i) {
					if(this.state.teams[i].value === this.state.tName) {
						duplicate = true;
						break;
					}
				}

				if(!duplicate) {
					this.setState({
	          tName: '',
						teams: [...this.state.teams, createOption(this.state.tName)],
	        });
				}

				this.setState({teamsError: false});
				customStyles.control = (provided, state) => ({
					...provided,
					display: 'flex',
					boxShadow: 'none',
					border: state.isFocused ? '1px solid #557a95' : '1px solid #7395ae',
					transition: 'all 0.5s ease',
					'&:hover': {
						borderColor: state.isFocused ? '#557a95' : '557a95',
					}
				});
        break;
        default: break;
    }
    e.preventDefault();
	}

	remove(name, i){
		const dummyteams = this.state.teams;

		if(dummyteams.length < 2){
			this.setState({teams: dummyteams, asterisk2: true});
		}
		else{
			this.setState({teams: dummyteams});
		}
	}

	emptyField(event){
		if(event.target.value === "" || event.target.value < 2 || event.target.value > this.state.teams.length){
			this.setState({tNumbs: 2, isEmpty: false});
		}
	}
	//Word count
	wordCount(event){
		this.setState({counter: event.target.value.length, tInfo: event.target.value});

	}

	createNew(e){
		e.preventDefault();
		//turnerningnamn,   lag minst 2 lag,   antal lag/grupp,
		if(this.state.teams.length < 2 || (this.state.tNumbs < 2 && this.state.tNumbs > 20) || this.state.serieName.trim() === "" ){
				if(this.state.teams.length < 2) {
					this.setState({teamsError: true, teamsErrormsg: "Lägg till minst två lag", teamsStyle: {borderColor: "red"}});
					customStyles.control = (provided, state) => ({
				    ...provided,
				    display: 'flex',
				    boxShadow: 'none',
				    border: state.isFocused ? '1px solid red' : '1px solid red',
						transition: 'all 0.5s ease',
				    '&:hover': {
				      borderColor: state.isFocused ? 'red' : 'red',
				    }
				  });
				}
				if(this.state.serieName.trim() === ""){this.setState({nameError: true, nameErrormsg: "Skriv in ett namn på din serie", nameStyle: {borderColor: "red"}});}
				return;
		}

		this.setState({loading:true});

		let allteams = "";

		for(let i = 0; i < this.state.teams.length; ++i) {
			allteams += "&team=" + this.state.teams[i].value;
		}

		fetch(settings.api + "serie/", {
			method: "POST",
			credentials: "include",
			body: `name=${this.state.serieName}${allteams}`
		})
		.then(response => response.json())
		.then(response => {
			if(response.status === true){
				this.setState({id: response.id});
				this.props.close();
			}
			else {
				this.setState({loading:false})
				alert("Oops, något gick fel, vänligen försök igen!");
			}
		});
	}

	focusOnField(e) {
		e.target.parentNode.childNodes[0].focus();
	}

	render() {
		//Fixar loading animationen
		let mySubmit = "Skapa ny turnering";
		if(this.state.loading){
			mySubmit = <div className="loading"></div>
		}

		let lagholder = "";
		if(this.state.teams.length === 0) {
			lagholder = "Inga lag tillagda";
		}
		else {
			lagholder = this.state.teams.length + " lag";
		}
		//Asterisk obligatoriska fält
		let asterisk = "";
		if(this.state.asterisk){
			asterisk = <label id="asterisk"> *</label>;
		}
		let asterisk2 ="";
		if(this.state.teams.length < 2){
				asterisk2 = <label id="asterisk"> *</label>;
		}

		let nameerror = <div className="error-hide"></div>;
		if(this.state.nameError){
			nameerror = <div className="error-show">{this.state.nameErrormsg}</div>;
		}
		let teamserror = <div className="error-hide"></div>;
		if(this.state.teamsError){
			teamserror = <div className="error-show">{this.state.teamsErrormsg}</div>;
		}

    	return (
				<div id="createwrap">
					<form className="yttre">
						<h2>Skapa serie</h2>
						<div id="inre">
							<div className="form">
								<label>
									Serienamn{asterisk}
								</label>
								<input onKeyDown={this.handleKeyDown} style={this.state.nameStyle} type="text" className="fält name" onChange={this.serieName} maxLength="40"/>
								{nameerror}
							</div>
							<div className="form">
									<label> Lägg till lag{asterisk2}<span className="addTeamInfo">({lagholder})</span></label>
									<CreatableSelect
										className='react-select-container'
			              classNamePrefix="react-select"
										styles={customStyles}
						        components={comps}
						        inputValue={this.state.tName}
						        isClearable
						        isMulti
						        menuIsOpen={false}
						        onChange={this.handleTeamSubmit}
						        onInputChange={this.handleChange}
						        onKeyDown={this.handleKeyDown}
						        placeholder="Skriv in ett lagnamn och tryck på enter..."
						        value={this.state.teams}
						      />
									{teamserror}
							</div>
							<div className="form">
								<div className="submit" onClick ={this.createNew}>
									{mySubmit}
								</div>
								<div id="ast"><span>*</span> = obligatoriska fält</div>
							</div>
						</div>
					</form>
				</div>
			);
	}
}

export default ManageS;

// <div id="nyttLag">
// 	<input style={this.state.teamsStyle} type="text" className="fält teams" value={this.state.tName} onInput={this.handleChange} onBlur={this.blurChange} maxlength="25"/>
// 	<input id="plus" type="submit" value="Lägg till" onClick={this.focusOnField}/>
// </div>
