import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

class StatWidget extends Component{
    static propTypes = {
        style: PropTypes.string,
        count: PropTypes.string,
        headerText: PropTypes.string,
        icon: PropTypes.string,
        footerText: PropTypes.string,
    }

    render() {
        return (
            <Card bg={this.props.color} text="white" border={this.props.color}>
                <Card.Header>
                    <Row>
                        <Col xs={3}>
                            <i className={this.props.icon} />
                        </Col>

                        <Col xs={9}>
                            <div className="huge">
                                {this.props.count}
                            </div>

                            <div className="header-text">
                                {this.props.headerText}
                            </div>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Footer>
                    <span>
                        <a href={this.props.linkTo} className="link"><span><FontAwesomeIcon icon={faAngleDoubleRight} /> {this.props.footerText}</span></a>
                    </span>
                </Card.Footer>
            </Card>
        );
    }
}

export default StatWidget;
