import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, NavLink as Link } from 'react-router-dom';

import './css/app.scss';

import settings from "./settings.json";
import lowResLogo from './bilder/eyeLeagueLowestRes.png';
import logo from './bilder/eyeLeagueLowRes.png';

import Login from "./components/Login";
import Logout from "./components/Logout";
import Tournament from "./components/Tournament";
import Error from "./components/Error";
import ManageS from "./components/ManageS";


// ta bort!
import Edit from "./components/Edit";
import Verify from "./components/Verify";


class App extends Component {
	render() {
		let url = window.location.href.replace("http://", "").replace(".vlq.se", "").split("/");
		console.log(url);
		if(url[0] === "inside" || url[0] === "localhost:3000") {
			settings.api = "http://192.168.1.3:3002/";
		}
		console.log(settings.api);
		return(
			<BrowserRouter>
				<Switch>
					<Route exact path={settings.url + "/"} component={Admin}/>
					<Route exact path={settings.url + "t/"} component={Tournament}/>
					<Route exact path={settings.url + "t/:id"} component={Tournament}/>
					<Route exact path={settings.url + "create"} component={Admin}/>
					<Route exact path={settings.url + "manage"} component={Admin}/>
					<Route exact path={settings.url + "manage/:id"} component={Admin}/>
					<Route exact path={settings.url + "login"} component={Login}/>
					<Route exact path={settings.url + "login/:hash"} component={Login}/>
					<Route exact path={settings.url + "logout"} component={Logout}/>
					<Route exact path={settings.url + "verify/:string"} component={Verify}/>
					<Route component={Error} />
				</Switch>
			</BrowserRouter>
		);
	}
}

//https://stackoverflow.com/questions/44188969/how-to-pass-the-match-when-using-render-in-route-component-from-react-router-v4
class Admin extends Component {
	constructor(){
		super();

		this.state = {
			username: '',
			error: false,
			loading: true,
			accountSelected: false
		};

		this.accountClose = this.accountClose.bind(this);
		this.accountSelect = this.accountSelect.bind(this);
		this.update = this.update.bind(this);
		this.imageload = this.imageload.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.update();
	}

	accountClose(e) {
		e.preventDefault();
		// console.log("The cursor just exited the " + e.relatedTarget.className + " element.");
		this.setState({accountSelected: false});
	}

	accountSelect(e) {
		e.preventDefault();
		// if(this.state.accountSelected) {
		// 	// if(e.relatedTarget.className === "hamburgerContent" || e.relatedTarget.className === "navis")
		// 		this.setState({accountSelected: false});
		// 	return;
		// }

		this.setState({accountSelected: true});
	}

	update(){
		fetch(settings.api + "user/", {
			method: "GET",
			credentials: "include"
		})
		.then(response => {
			if(response.status == '401'){throw 0;};
			return response.json();
		})
		.then(response => {
			this.setState({username: response.username, loading: false});
		})
		.catch(err => {
			this.setState({error: true});
		});
	}

	imageload(e) {
		e.target.style.display = "block";
		e.target.parentNode.childNodes[0].style.display = "none";
	}

	componentDidMount() {
    window.addEventListener('scroll', this.handleScrollToElement);
	}

	componentWillUnmount() {
	    window.removeEventListener('scroll', this.handleScrollToElement);
	}

	handleScroll(event) {
	   console.log("hej");
	}

	render(){
		if(this.state.error){
			return <Redirect to={settings.url + "login/"} />;
		}

		if(this.state.loading){
			return <div id="root-loading"><div className="root-spinner"></div></div>;
		}

		// <nav>
		// 	<Link activeClassName="selected" to={settings.url + "manage/"}>Hantera serier</Link>
		// 	<Link activeClassName="selected" to={settings.url + "create/"}>Skapa serie</Link>
		// </nav
		//<Link to={settings.url + "manage/"}><img src={logo} alt="logo my logo"></img></Link>

		const url = window.location.href.split("/").filter(String);
		// console.log(url[0] + "//account." + url[1]);
		return(
			<div>
				<header>
					<div className="navis">
						<Link to={settings.url + "manage/"}>
							<div className="logo">
								<img className="lowreslogo" src={lowResLogo} alt="low res logo"></img>
								<img className="highreslogo" src={logo} alt="logo" onLoad={this.imageload}></img>
							</div>
						</Link>
						<div className={this.state.accountSelected ? "accountSelected user" : "user"}>
							<div className="name" onMouseEnter={this.accountSelect} onMouseLeave={this.accountClose}>
								<div onMouseEnter={this.accountSelect} className="accountIcon">
									<span onMouseEnter={this.accountSelect}/>
									<span onMouseEnter={this.accountSelect}/>
									<span onMouseEnter={this.accountSelect}/>
									<span onMouseEnter={this.accountSelect}/>
								</div>
								<p onMouseEnter={this.accountSelect}>{this.state.username}</p>
								<div className="pil" onMouseEnter={this.accountSelect}>
									<span onMouseEnter={this.accountSelect}/>
								</div>
							</div>
							<div id="hamburger" style={{display: this.state.accountSelected ? "block" : "none"}}>
								<div onMouseEnter={this.accountSelect} onMouseLeave={this.accountClose}>
									<div className="settings">
										<div><span/><span/><span/><span/><span/></div>
										{/*}<a href={url[0] + "//account." + url[1]}>Mitt konto</a>{*/}
										<Link to={settings.url + "account"}>Mitt konto</Link>
									</div>
									<div className="logout">
										<span><Link to={settings.url + "logout/"}>Logga ut</Link></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</header>

				<main className="wrapper" onScroll={this.handleScroll} onClick={this.accountClose}>
					<Switch>
						<Route exact path={settings.url + "/"} render={() => {return <Redirect to={settings.url + "manage/"} />;}}/>
						<Route exact path={settings.url + "manage"} component={ManageS} />
						{/*<Route exact path={settings.url + "manage"} component={Manage} />*/}
						<Route exact path={settings.url + "manage/:id"} render={({match}) => <Edit username={this.state.username} match={match}></Edit>} />
					</Switch>
				</main>
			</div>
		);
	}
}
export default App;
//<Route exact path={settings.url + "verify/:string"} render={({match}) => <Verify username={this.state.username} match={match}></Verify>} />
