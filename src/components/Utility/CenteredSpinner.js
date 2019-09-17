import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';

class CenteredSpinner extends Component {
    render() {
        return (
            <div style={ {'textAlign' : 'center' } }>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }
}
export default CenteredSpinner;
