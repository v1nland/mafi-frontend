import React, { Component } from 'react';
import { Card, Accordion, Button } from 'react-bootstrap';

class SupportTicket extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {

        }
    }

    render(){
        return(
            <Card bg={this.props.color}>
                <Card.Header>
                    <Accordion.Toggle as={Button} className="link" variant="link" eventKey={this.props.id}>
                        {this.props.title}
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={this.props.id}>
                    <Card.Body>
                        <p>{this.props.body}</p>

                        {this.props.responseButton}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }
}
export default SupportTicket;
