import React, { Component } from 'react';

import '../css/bracket.scss';

class Bracket extends Component {
    constructor(props){
		super(props);

		this.item = props.games.map((item) => {
			let game = ['', '', '', ''];//class 1, lag 1, class 2, lag 2
			
			if(item.teams[0] === null){
				game[0] = 'empty';
				game[1] = item.placeholder[0];
			}else {
				if(item.teams[0] === false){
					game[0] = 'empty';
					game[1] = item.placeholder[0];
				}else {
					let res = '-';
					if(item.results[0] !== null && item.results[0] !== false){
						res = item.results[0];
					}
					game[1] = <div className="team"><div className="team-name">{props.teams[item.teams[0]]}</div><div class="res">{res}</div></div>;

				}
			}

			if(item.teams[1] === null){
				game[2] = 'empty';
				game[3] = item.placeholder[1];
			}else {
				if(item.teams[1] === false){
					game[2] = 'empty';
					game[3] = item.placeholder[1];
				}else {
					let res = '-';
					if(item.results[1] !== null && item.results[1] !== false){
						res = item.results[1];
					}
					game[3] = <div className="team"><div className="team-name">{props.teams[item.teams[1]]}</div><div class="res">{res}</div></div>;
				
				}
			}

			if(item.status){
				if(item.teams[0] !== false || item.teams[1] !== false){
					if(item.teams[0] === false && item.teams[1] !== false){
						game[2] = 'winner';
					}else {
						if(item.teams[1] === false && item.teams[0] !== false){
							game[0] = 'winner';
						}else {
							if(item.results[0] > item.results[1]){
								game[0] = 'winner';
								game[2] = 'loser';
							}else {
								game[2] = 'winner';
								game[0] = 'loser';
							}
						}
					}
				}
			}

			return game;
        });

        this.state = {
            data: this.item
        };
    }
    
    render() {
    	return (
			<div id="bracket">
					<div className="side">
						<div className="top f">
							<div className="half-1">
								<div className="top half-1 half-2 yellow">
									<div className="top f gray">
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[0][0]}>
                                                {this.state.data[0][1]}
											</div>
										</div>
										<div className="line-1"></div>
									</div>

									<div className="bottom f red">
										<div className="box-1">
											<div className={"t1 " + this.state.data[0][2]}>
                                                {this.state.data[0][3]}
											</div>
										</div>
										<div className="line-0"></div>
									</div>
								</div>			

								<div className="bottom half-1 half-2 gray">
								<div className="top f gray">
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[1][0]}>
												{this.state.data[1][1]}
											</div>
										</div>
										<div className="line-2"></div>
									</div>

									<div className="bottom f red">
										<div className="box-1">
											<div className={"t1 " + this.state.data[1][2]}>
                                                {this.state.data[1][3]}
											</div>
										</div>
										<div className="line-3"></div>
									</div>
								</div>	
							</div>
							

							<div className="half-1">
								<div className="half-2 f yellow">
									<div className="line-bottom"></div>
									<div className="box-2 f">
										<div className={"t2 " + this.state.data[4][0]}>
											{this.state.data[4][1]}
										</div>
									</div>
								</div>

								<div className="half-2 f red">
									<div className="line-top"></div>
									<div className="box-2 f">
										<div className={"t3 " + this.state.data[4][2]}>
											{this.state.data[4][3]}
										</div>
									</div>
								</div>
							</div>
						</div>	
						
						<div className="bottom f">							
							<div className="half-1">
								<div className="top half-1 half-2 yellow">
									<div className="top f gray">
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[2][0]}>
												{this.state.data[2][1]}
											</div>
										</div>
										<div className="line-1"></div>
									</div>

									<div className="bottom f red">
										<div className="box-1">
											<div className={"t1 " + this.state.data[2][2]}>
												{this.state.data[2][3]}
											</div>
										</div>
										<div className="line-0"></div>
									</div>
								</div>			

							<div className="bottom half-1 half-2 gray">
								<div className="top f gray">
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[3][0]}>
												{this.state.data[3][1]}
											</div>
										</div>
										<div className="line-2"></div>
									</div>

									<div className="bottom f red">
										<div className="box-1">
											<div className={"t1 " + this.state.data[3][2]}>
												{this.state.data[3][3]}
											</div>
										</div>
										<div className="line-3"></div>
									</div>
								</div>	
							</div>
							

							<div className="half-1">
								<div className="half-2 f yellow">
									<div className="line-bottom"></div>
									<div className="box-2 f">
										<div className={"t2 " + this.state.data[5][0]}>
											{this.state.data[5][1]}
										</div>
									</div>
									
								</div>

								<div className="half-2 f red">
									<div className="line-top"></div>
									<div className="box-2 f">
										<div className={"t3 " + this.state.data[5][2]}>
											{this.state.data[5][3]}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="lines">
						<div className="quarter f">
							<div className="line-1"></div>
						</div>
						<div className="quarter f">
							<div className="line-0"></div>
						</div>
						<div className="quarter f">
							<div className="line-2"></div>
						</div>
						<div className="quarter f">
							<div className="line-3"></div>
						</div>
					</div>

					<div className="semi">
						<div class="half-2 f">
							<div className="line-bottom"></div>

							<div className="box-2 f">
								<div className={"t2 " + this.state.data[6][0]}>
									{this.state.data[6][1]}
								</div>
							</div>
						</div>

						<div class="half-2 f">
							<div className="line-top"></div>

							<div className="box-2 f">
								<div className={"t3 " +  this.state.data[6][2]}>
									{this.state.data[6][3]}
								</div>
							</div>
						</div>
						
					</div>

					<div className="final">
						<div className="top f">
							<div className="line-1"></div>
							<div className={"t2 " + this.state.data[7][0]}>
								{this.state.data[7][1]}
							</div>
							<div className="line-1"></div>
						</div>

						<div className="bottom f">
							<div className="line-3"></div>
							<div className={"t3 " + this.state.data[7][2]}>
								{this.state.data[7][3]}
							</div>
							<div className="line-3"></div>
						</div>
					</div>

					<div className="semi">
						<div class="half-2 f">
							<div className="box-2 f">
								<div className={"t2 " + this.state.data[8][0]}>
									{this.state.data[8][1]}
								</div>
							</div>

							<div className="line-bottom"></div>
						</div>

						<div class="half-2 f">
							<div className="box-2 f">
								<div className={"t3 " + this.state.data[8][2]}>
									{this.state.data[8][3]}
								</div>
							</div>

							<div className="line-top"></div>
						</div>
						
					</div>

					<div className="lines">
						<div className="quarter f">
							<div className="line-1"></div>
						</div>
						<div className="quarter f">
							<div className="line-4"></div>
						</div>
						<div className="quarter f">
							<div className="line-5"></div>
						</div>
						<div className="quarter f">
							<div className="line-3"></div>
						</div>
					</div>
						
					<div className="side">
						<div className="top f">
							<div className="half-1">
								<div className="half-2 f yellow">
									<div className="box-2 f">
										<div className={"t2 " + this.state.data[9][0]}>
											{this.state.data[9][1]}
										</div>
									</div>
									<div className="line-bottom"></div>
								</div>

								<div className="half-2 f red">
									<div className="box-2 f">
										<div className={"t3 " + this.state.data[9][2]}>
											{this.state.data[9][3]}
										</div>
									</div>
									<div className="line-top"></div>
								</div>
							</div>
							
							<div className="half-1">
								<div className="top half-1 half-2 yellow">
									<div className="top f gray">
										<div className="line-1"></div>
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[11][0]}>
												{this.state.data[11][1]}
											</div>
										</div>
									</div>

									<div className="bottom f red">
										<div className="line-4"></div>
										<div className="box-1">
											<div className={"t1 " + this.state.data[11][2]}>
												{this.state.data[11][3]}
											</div>
										</div>
									</div>
								</div>			

								<div className="bottom half-1 half-2 gray">
									<div className="top f gray">
										<div className="line-5"></div>
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[12][0]}>
												{this.state.data[12][1]}
											</div>
										</div>
									</div>

									<div className="bottom f red">
										<div className="line-3"></div>
										<div className="box-1">
											<div className={"t1 " + this.state.data[12][2]}>
												{this.state.data[12][3]}
											</div>
										</div>
									</div>
								</div>	
							</div>
						</div>


						<div className="bottom f">
							<div className="half-1">
								<div className="half-2 f yellow">
									<div className="box-2 f">
										<div className={"t2 " + this.state.data[10][0]}>
											{this.state.data[10][1]}
										</div>
									</div>
									<div className="line-bottom"></div>
								</div>

								<div className="half-2 f red">
									<div className="box-2 f">
										<div className={"t3 " + this.state.data[10][2]}>
											{this.state.data[10][3]}
										</div>
									</div>
									<div className="line-top"></div>
								</div>
							</div>
							
							<div className="half-1">
								<div className="top half-1 half-2 yellow">
									<div className="top f gray">
										<div className="line-1"></div>
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[13][0]}>
												{this.state.data[13][1]}
											</div>
										</div>
									</div>

									<div className="bottom f red">
										<div className="line-4"></div>
										<div className="box-1">
											<div className={"t1 " + this.state.data[13][2]}>
												{this.state.data[13][3]}
											</div>
										</div>
									</div>
								</div>			

								<div className="bottom half-1 half-2 gray">
									<div className="top f gray">
										<div className="line-5"></div>
										<div className="box-1 f">
											<div className={"t2 " + this.state.data[14][0]}>
												{this.state.data[14][1]}
											</div>
										</div>
									</div>

									<div className="bottom f red">
										<div className="line-3"></div>
										<div className="box-1">
											<div className={"t1 " + this.state.data[14][2]}>
												{this.state.data[14][3]}
											</div>
										</div>
									</div>
								</div>	
							</div>
						</div>
					</div>
				</div>
		);
	}
}

export default Bracket;