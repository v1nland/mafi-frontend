import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal } from 'react-bootstrap';

class DatabaseManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            items: [],
            item: {
                id: '',
                description: '',
                times_bought: 0,
                stock: 0,
                type: '',
                color: '',
                price: 0
            }
        };
    }

    // Modal stuff
    handleSubmit = (event) => {
        event.preventDefault()

        const { order } = this.state;

        fetch(`https://mafi-backend.herokuapp.com/orders/`)
            .then(this.getOrders)
            .catch(err => console.error(err))

        if ( event.target[0].value == '' || event.target[1].value == '' || event.target[2].value == '' ) {
            this.handleShow();
        }
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    // Database stuff
    componentDidMount(){
        this.getItems();
    }

    getItems = _ => {
        fetch(`https://mafi-backend.herokuapp.com/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data }))
        .catch(err => console.error(err))
    }

    renderItem = ({id, description, times_bought, stock, type, color, price} ) => <option value={id}> { description } </option>

    render() {
        return (
            <div className="page-title">
                <h1>Gestión de bases de datos</h1>
                <hr />
            </div>
        );
    }
}

export default DatabaseManagement;
