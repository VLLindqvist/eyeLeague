//q7j0sRfzNLMsldrNSp : localhost
//o4PZGaafjgGeEgOs, q6jZdK6m9W98tKeHsj : ohlsson.it
//"api": "http://192.168.1.58:3001/"

import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import Bracket from './Bracket';
import Group from './Group';
import Games from './Games';

import '../css/tournament.scss';
import logo from '../bilder/samme.png';

import settings from "../settings.json";

class Tournament extends Component {
	constructor(props){
		super(props);

		this.state = {loading: true, error: false, data: {}, status: []};

		if(props.match.params.id == null || props.match.params.id.length < 10 || props.match.params.id.length > 20){
			this.state.error = true;
			this.state.loading = false;
		}else {
			fetch(settings.api + "?t=" + props.match.params.id.replace(/\&/, ''), {
				method: "GET",
				credentials: "include"
			}).then((response) => {
				if(response.status != '200'){throw 0;}
				return response.json();
			}).then((response) => {
				document.title = response.name;
				this.setState({loading: false, data: response, bracket: response.bracket});
				this.status();
			}).catch((error) => {
				this.setState({loading: false, error: true});
			});
		}

		this.status = this.status.bind(this);
		
	}

	async status(){
		let i = 0;
		for(const item of this.state.data.games){
			if(item.edit != null){
				i++;
			}
		}

		let group = null;
		let bracket = null;
		let div = null;

		if(this.state.data.bracket[7].edit != null){
			bracket = <span>&#10004;</span>;
		}

		if(i === this.state.data.games.length){
			group = <span>&#10004;</span>;
		}else {
			div = <div className="status">{i} av {this.state.data.games.length} matcher spelade</div>;
		}

		this.setState({status: [group, bracket, div]});
	}

	render() {
		if(this.state.loading){return <div id="root-loading"><div class="root-spinner"></div></div>;}

		let link;
		if(!this.state.error){
			link = <Link to={settings.url + "manage/" + this.state.data.id + "/"}>Redigera &#187;</Link>;
		}else {
			link = <Link to={settings.url + "manage/"}>Administrera &#187;</Link>;

		}

		const header = (
			<div id="tournament-head">
				<div className="tournament-wrap">
					<img src={logo} alt="bild my bild" />
					{link}
				</div>
			</div>
		);

		if(this.state.error){
			document.title = "Ingen turnering hittades";
			return (
				<div>
					{header}
					<div className="no-tournament">
						<h1>Ingen turnering hittades</h1>
						<p>Vänligen kontrollera att du angav korrekt address!</p>
						<div className="link">&#128279; = &#128148;</div>
						<div className="line"></div>
					</div>
				</div>
			);
		}

		return (
			<div>
				{header}
				<div id="tournament">
					<div className="info">
						<div className="info-text">
							<h1>{this.state.data.name}</h1>
							{this.state.status[2]}
						</div>
						<span>{this.state.data.text}</span>
					</div>

					<Content data={this.state.data} completed={this.state.status}></Content>
				</div>
			</div>
		);
	}
}

class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {show: 0};
		this.select = this.select.bind(this);
	}

	select(target){
		if(this.state.show !== target){
			this.props.handler(target);
			this.setState({show: target});
		}
	}

	render(){
		console.log(this.props.completed);
		return (
			<nav>
				<div className={this.state.show == 0 ? "selected" : null} onClick={this.select.bind(null, 0)}>Gruppspel {this.props.completed[0]}</div>
				<div className={this.state.show == 1 ? "selected" : null} onClick={this.select.bind(null, 1)}>Slutspel {this.props.completed[1]}</div>
			</nav>
		);
	}
}

class Content extends Component {
	constructor(props){
		super(props);
		this.state = {show: 0, data: props.data};
		this.select = this.select.bind(this);

	}

	select(target){
		this.setState({show: target});
	}

	render(){
		return (
			<div className="select-groups">
				<Nav handler={this.select} completed={this.props.completed}></Nav>
				<main>
					<div className={this.state.show == 0 ? "show" : "hide"}>
						<div>
							<Groups data={this.state.data}></Groups>
						</div>
					</div>

					<div className={this.state.show == 1 ? "show" : "hide"}>
						<div className="padding-2">
							<h3>Slutspel</h3>

								<div className="overflow">
									<div className="bracket-container">
										<Bracket teams={this.state.data.teams} games={this.state.data.bracket}></Bracket>
										<span>n/a = lag saknas, tbd = ej avgjort</span>
									</div>
								</div>


						</div>
					</div>
				</main>
			</div>
		);
	}
}

class Groups extends Component {
	constructor(props){
		super(props);

		const x = Math.ceil(props.data.groups.length / 6);
		const split = Math.floor(props.data.groups.length / x) + (props.data.groups.length % x);

		this.state = {group: 0, data: props.data, size: split};
		this.select = this.select.bind(this);
		this.list = this.list.bind(this);

		this.format = "ABCDEFGHIJKLMNOP";
	}

	select(target){
		if(this.state.group !== target){
			this.setState({group: target});
		}
	}

	list(){
		let rows = [[]], j = 0, item;

		for(let i = 0; i < this.state.data.groups.length; i++){
			if(i == this.state.group){
				item = <div className="selected">{this.format[i]}</div>;
			}else {
				item = <div onClick={this.select.bind(null, i)}>{this.format[i]}</div>;
			}

			rows[j].push(item);
			if((i+1) % this.state.size == 0){
				if((i+1) != this.state.data.groups.length){
					rows.push([]);
				}
				j++;
			}
		}

		return rows.map((item) => (<div className="row">{item}</div>));
	}

	render(){
		return (
			<div>
				<div className="list">{this.list()}</div>
				<div className="padding-1">
					<h3>Grupp {this.format[this.state.group]}</h3>
					<Group data={this.state.data.groups[this.state.group]} teams={this.state.data.teams}></Group>
					<div className="group-info">
						M = matcher spelade,
						V = vunna, 
						O = oavgjorda,
						GM = gjorda mål,
						IM = insläppta mål,
						+/- = målskillnad,
						P = poäng
					</div>
					<h4>Matchresultat</h4>
					<Games id={this.state.group} data={this.state.data.games} teams={this.state.data.teams}></Games>
				</div>
				
			</div>
		);
	}
}

export default Tournament;
