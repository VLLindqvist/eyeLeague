import React, { Component } from 'react';

import '../css/games.scss';

class Games extends Component {
    constructor(props){
        super(props);

        console.log("skapad");

        this.state = {
            data: props.data.filter((item) => {
                if(item.group === props.id){return true;}
                return false;
            })
        };
    }

    componentWillReceiveProps(input){
        if(input.id !== this.state.id){
            this.setState({
                data: input.data.filter((item) => {
                    if(item.group === input.id){return true;}
                    return false;
                })
            });
        }
    }


	render() {
        let time;
        const data = this.state.data.map((item, i) => {
            const d = new Date(item.edit);
            if(item.edit != null){
                let day = d.getDate();
                let month = d.getMonth() + 1;
                if(day < 10){day = "0" + day.toString();}
                if(month < 10){month = "0" + month.toString();}
                time = d.getFullYear() + "-" + month + "-" + day;
            }else {
                time = "-";
            }

            return(
                <div className="item">
                    <div className="left">
                        <div className="n">{i + 1}.</div>
                        <div className="date">{time}</div>
                    </div>

                    <div className="right">
                        <div className="team">{this.props.teams[item.teams[0]]}</div>
                        <div className="res">{item.results[0]}&nbsp;-&nbsp;{item.results[1]}</div>
                        <div className="team">{this.props.teams[item.teams[1]]}</div>
                    </div>
                </div>
            );
        });

        return(
            <div id="games">
                {data}
            </div>
        );
    }

}

export default Games;
