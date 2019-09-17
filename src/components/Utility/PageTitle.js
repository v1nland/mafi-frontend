import React, { Component } from 'react';

class PageTitle extends Component {
    render() {
        return (
            <div className="page-title">
                <h1>{this.props.text}</h1>
                <hr />
            </div>
        );
    }
}
export default PageTitle;
