import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

class ProfileData extends Component{
    render(){
        return(
            <Card>
                <Row style={{ padding:"0 2%" }}>
                    <Col sm={4} className="profile-data">{this.props.icon} {this.props.title}</Col>
                    <Col sm={8}>{this.props.value} {this.props.badge}</Col>
                </Row>
            </Card>
        )
    }
}
export default ProfileData;
