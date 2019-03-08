import React, { Component } from 'react';

import '../css/group.scss';

class Group extends Component {
    constructor(props){
		super(props);

        this.state = {
			left: {visibility: "visible", opacity: 1},
			right: {visibility: "visible", opacity: 1}
        }

        this.ref = React.createRef();
		this.resize = this.resize.bind(this);
		this.scroll = this.scroll.bind(this);
		this.onscroll = this.onscroll.bind(this);
    }

    resize(){
        if(this.ref.current.clientWidth < this.ref.current.children[1].children[0].clientWidth){
			let {l, r} = this.scroll();
			this.setState({left: l, right: r});		
		}else {
			this.setState({left: {visibility: "hidden"}, right: {visibility: "hidden"}});
        }
	}
	
	scroll(){
		const offset = this.ref.current.children[1].scrollLeft;
		const width = this.ref.current.children[1].scrollWidth;
		const seen = this.ref.current.children[1].clientWidth;

		let l = {visibility: "visible", opacity: 1};
		let r = {visibility: "visible", opacity: 1};

		if(offset < 30){
			l.opacity = 1*(offset / 30);
		}else {
			l.opacity = 1;
		}
		
		if((seen + offset) > (width - 30)){
			r.opacity = 1*((width - seen - offset) / 30);
		}else {
			r.opacity = 1;
		}

		return { l, r };
	}

	onscroll(){
		let { l, r } = this.scroll();
		this.setState({left: l, right: r});
	}

    componentWillMount(){
		window.addEventListener('resize', this.resize);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.resize);
    }

    componentDidMount(){
		this.resize();
	}

    render() {
		let data = this.props.data.rank.map((item, i) => {
			return(
				<li>
					<div className="pos">{i + 1}.</div>
					<div className="text">{this.props.teams[this.props.data.teams[item]]}</div>
					<div className="res">{this.props.data.stats[item][0]}</div>
					<div className="res">{this.props.data.stats[item][1]}</div>
					<div className="res">{this.props.data.stats[item][2]}</div>
					<div className="res">{this.props.data.stats[item][3]}</div>
					<div className="res">{this.props.data.stats[item][4]}</div>
					<div className="res">{this.props.data.stats[item][5]}</div>
					<div className="res">{this.props.data.points[item]}</div>
				</li>
			);
		});

		return(
			<div className="groups" ref={this.ref}>
				<div className="shadow shadow-right" style={this.state.right}></div>
				<ul onScroll={this.onscroll}>
					<li className="group_head">
						<div className="pos"></div>
						<div className="text">Lagnamn</div>
						<div className="res">M</div>
						<div className="res">V</div>
						<div className="res">O</div>
						<div className="res">GM</div>
						<div className="res">IM</div>
						<div className="res">+/-</div>
						<div className="res">P</div>
					</li>
					{data}
				</ul>
				<div className="shadow shadow-left" style={this.state.left}></div>
			</div>
		);
	}
}

export default Group;
