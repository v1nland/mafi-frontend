import React, { Component } from 'react';

class TimelineElement extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {

        }
    }

    render(){
        return(
            <li className={this.props.inverted}>
                <div className={this.props.color}>
                    <i className={this.props.icon} />
                </div>

                <div className="timeline-panel">
                    <div className="timeline-heading">
                        <h4 className="timeline-title">{this.props.title}</h4>

                        <p><small className="text-muted"><i className="fa fa-clock-o" /> {this.props.source}</small></p>
                    </div>

                    <div className="timeline-body">
                        <p>{this.props.body}</p>
                    </div>
                </div>
            </li>
        );
    }
}
export default TimelineElement;
