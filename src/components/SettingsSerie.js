import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Modal } from 'react-bootstrap';

import settings from "../settings.json";

import '../css/test.scss';

import deleteIcon from '../bilder/delete.svg';

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: props.data,
            loading: false,
            changes: null,
            remove: false,
            msg: false,
            txt: '',
            ok: '',
            redirect: false
        }

        this.submit = this.submit.bind(this);
        this.changes = this.changes.bind(this);
        this.remove = this.remove.bind(this);
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
    }

    componentWillReceiveProps(input){
        console.log("update");
        this.setState({data: input.data});
    }

    submit(e){
        e.preventDefault();
        if(this.state.loading){
            return;
        }else {
            this.setState({loading: true});
        }

        if(this.state.changes === null){
            this.setState({msg: true, txt: 'Ingen ändring har gjorts', loading: false, ok: ''});
            return;
        }

        let check = false;
        const query = Object.keys(this.state.changes).map((item) => {
            if(item !== 'text'){
                if(this.state.changes[item].trim() === ""){
                    check = true;
                }
            }
            return item + "=" + this.state.changes[item];
        }).join("&");

        if(check){
            this.setState({msg: true, txt: 'Tomma fält', loading: false, ok: ''});
            return;
        }

		fetch((settings.api + "tournament/?t=" + this.props.data.id + "&" + query), {
            method: "PATCH",
            credentials: "include",
        })
		.then((response) => {
            if(response.status != '200'){throw response.statusText;}
            return response.json();
        })
		.then(response => {
            this.setState({loading: false, changes: null, msg: true, txt: "Ändringar sparade " + String.fromCharCode(10004), ok: 'ok'});
            if(response.status === false){
                console.log("error my error");
                return;
            }
            this.props.trigger();
        })
        .catch(() => {
            this.setState({loading: false});
        });
    }

    changes(e){
        this.setState({
            changes: {
                ...this.state.changes,
                [e.target.dataset.id]: e.target.value
            },
            msg: false,
            txt: ''
        });
    }

    remove(){
      fetch((settings.api + "serie/?s=" + this.props.data.id), {
          method: "DELETE",
          credentials: "include",
      }).then((response) => {
          if(response.status != '200'){throw response.statusText;}
          return response.json();
      }).then(response => {
          this.setState({redirect: true});
      });
    }

    show(){
        this.setState({remove: true});
    }

    close(){
        this.setState({remove: false});
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={settings.url + "manage/"}></Redirect>;
        }

        let submit = <div>Spara ändringar<input type="submit"></input></div>;
    		if(this.state.loading){
    			submit = <div className="loading"></div>;
        }

        let error = <div className="error-hide"></div>;
    		if(this.state.msg){
    			error = <div className={"error-show " + this.state.ok}>{this.state.txt}</div>;
        }

        const teams = this.state.data.teams.map((item, i) => {
          return(
            <div>
              <div>Lag {i + 1}</div>
              <input data-id={i} id="title" type="text" defaultValue={item} onChange={this.changes}></input>
            </div>
          );
        });

        return(
            <div className="wrap" id="settings">
                <Modal show={this.state.remove} onHide={this.close}>
                   <Modal.Body >
                    <div className="close" onClick={this.close}>&times;</div>
                    <h3>Är du säker på att du vill ta bort serien?</h3>
                     <div className="window-btns">
                       <div onClick={this.close}>Avbryt</div>
                       <div className="remove" onClick={this.remove}>Ta bort</div>
                     </div>
                   </Modal.Body>
               </Modal>


                <div className="head">
                  <h2>Inställningar</h2>
                  <div className="remove" onClick={this.show}>
                    <img className="deleteIcon" src={deleteIcon} alt="image/svg+xml"></img>
                  </div>
                </div>


                <div className="inputz">
                    <form onSubmit={this.submit}>
                        <label htmlFor="title">Serienamn</label>
                        <input data-id="name" id="title" type="text" defaultValue={this.props.data.name} onChange={this.changes}></input>
                        {/*}<label htmlFor="info">Information om turnering</label>
                        <textarea data-id="text" id="info" defaultValue={this.props.data.text} onChange={this.changes}></textarea>
                        {*/}
                        <label>Lagnamn</label>
                        <div className="teams">
                            {teams}
                        </div>

                        {error}
                        <div className="submit" onClick={this.submit}>
                            {submit}
                        </div>

                    </form>
                </div>



            </div>
        );
    }
}

export default Settings;
