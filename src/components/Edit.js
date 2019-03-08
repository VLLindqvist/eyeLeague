import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import settings from "../settings.json";

import SettingsSerie from "./SettingsSerie";
import ManageSerie from "./ManageSerie";
// import FutureGames from './ManageTourComps/FutureGames';

import '../css/test.scss';


class Edit extends Component {
    constructor(props){
        super(props);

        this.state = {
            tab: 0,
            loading: true,
            notfound: false,
            auth: false,
            data: {},
            status: false,
            groupSelected: 0
        }

        this.tab = this.tab.bind(this);
        this.update = this.update.bind(this);
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.copy = this.copy.bind(this);

        this.update();
    }

    tab(x){
      if(x !== this.state.tab){
          this.setState({tab: x});
      }
    }

    update(){
        fetch(settings.api + "?s=" + this.props.match.params.id, {
            method: "GET",
            credentials: "include"
        }).then((response) => {
            if(response.status != "200"){throw response.statusText;}
            return response.json();
        }).then((response) => {
            document.title = response.name;

            if(!response.owners.includes(this.props.username)){
                this.setState({loading: false, auth: true});
                return;
            }

            this.setState({loading: false, data: response});
        }).catch(() => {
            this.setState({loading: false, notfound: true});
        });
    }

    show(){
        this.setState({status: true});
    }

    close(){
        this.setState({status: false});
    }

    copy(){
        document.getElementById('x').select();
        document.execCommand("copy");
    }

    render(){
        if(this.state.loading){
            return <div id="edit"><div id="root-loading"><div className="root-spinner"></div></div></div>;
        }

        if(this.state.auth){
            return <div>inte din turnering pajas..</div>;
        }

        if(this.state.notfound){
          document.title = "Ingen turnering hittades";
    			return(
      			<div>
      				<div className="no-tournament">
      					<h1>Ingen turnering hittades</h1>
      					<p>Vänligen kontrollera att du angav korrekt address.</p>
      					<div className="link"><span role="img" aria-label="broken">&#128279; = &#128148;</span></div>
      					<div className="line"></div>
      				</div>
      			</div>
    			);
        }

        let content;
        if(this.state.tab === 0){
            content =
                <div>
                  <ManageSerie id={this.props.match.params.id} data={this.state.data} fetchData={this.update}></ManageSerie>
                </div>;
        }//groupSelected={this.state.groupSelected}

        if(this.state.tab === 1){
            content =
                <div>
                    <SettingsSerie trigger={this.update} data={this.state.data}/>
                </div>;
        }

        return(
            <div id="edit">

                <Modal centered show={this.state.status} onHide={this.close}>
                   <Modal.Body >
                        <div className="close" onClick={this.close}>&times;</div>
                        <h3>Delningsbar länk till seriens visningssida</h3>
                        <div className="modal_wrap">
                            <input id="x" type="text" value={"http://" + window.location.host  + "/s/" + this.state.data.id} readOnly/>
                            <div className="copy" onClick={this.copy}>Kopiera</div>
                        </div>
                        <div className="butn">
                          <Link target="_blank" to={settings.url + "s/" + this.state.data.id}>Öppna i ny flik</Link>
                        </div>
                    </Modal.Body>
               </Modal>

                <div className="info">
                    <Link to={settings.url + "manage/"}><div><span/><span/></div></Link>
                    <div className="vafan">
                        <div onClick={this.show}>
                          <div> <span/><span/><span/><span/><span/> </div>
                          <p>Dela</p>
                        </div>
                    </div>
                </div>

                <div className="head">
                    <h1>{this.state.data.name}</h1>
                </div>
                <div className="wrap">
                  <nav>
                      <div className={this.state.tab === 0 ? "selected" : null} onClick={this.tab.bind(this, 0)}>Matcher</div>
                      <div className={this.state.tab === 1 ? "selected" : null} onClick={this.tab.bind(this, 1)}>Inställningar</div>
                  </nav>

                  <main>
                      {content}
                  </main>
                </div>
            </div>
        );
    }
}

export default Edit;
