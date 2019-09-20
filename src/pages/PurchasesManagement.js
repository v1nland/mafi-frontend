import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal } from 'react-bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class PurchasesManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            submitted: false,
            show: false,
            purchases: [],
            purchase: {
                id: '',
                date: '',
                item_id: 0,
                item_qty: 0,
                description: '',
                unit_price: 0
            },
            items: [],
            item: {
                id: '',
                description: '',
                times_bought: 0,
                times_sold: 0,
                type: '',
                color: '',
                price: 0
            }
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var date = event.target[0].value;
        var item_id = event.target[1].value;
        var item_qty = event.target[2].value;
        var description = event.target[3].value;

        if ( date == '' || item_id == '' || item_qty == '' || description == '') {
            this.state.submitted = false;
            this.handleShow();
        }else{
            fetch(this.URL+`/purchases/add?date=${date}&item_id=${item_id}&item_qty=${item_qty}&description=${description}`)
                .then(this.getOrders)
                .catch(err => console.error(err))

            this.state.submitted = true;
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
        this.getPurchases();
        this.getItems();
    }

    getPurchases = _ => {
        fetch(this.URL+`/purchases`)
        .then(response => response.json())
        .then(resp => this.setState({ purchases: resp.data }))
        .catch(err => console.error(err))
    }

    getItems = _ => {
        fetch(this.URL+`/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data }))
        .catch(err => console.error(err))
    }

    numberWithDots = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // renderPurchases = ({id, date, item_id, item_qty, description, total_price} ) => <option key={id} value={id}> { description } </option>
    renderItem = ({id, description, times_bought, times_sold, type, color, sell_price} ) => <option key={id} value={id}> { description } </option>
    renderPurchases = ({id, date, description, item_qty, unit_price } ) => <tr key={id}><td>{ id }</td><td>{ date }</td><td>{ description }</td><td>{ item_qty }</td><td>{ "$"+this.numberWithDots(unit_price*item_qty) }</td></tr>

    render() {
        const { purchases, purchase } = this.state;
        const { items, item } = this.state;

        return (
            !(purchases.length || items.length) ? (
                <span>Loading...</span>
            ) : (
                <div>
                    <div className="page-title">
                        <h1>Gestión de compras</h1>
                        <hr />
                    </div>

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" animation={false}>
                        <Tab eventKey={1} title="Ver compras realizadas">
                            <div className="tab-container">
                                <div className="long-block">
                                    <div className="block-title">Compras realizadas</div>

                                    <div className="block-body">
                                        <table className="table table-sm table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Fecha</th>
                                                    <th scope="col">Producto comprado</th>
                                                    <th scope="col">Cantidad comprada</th>
                                                    <th scope="col">Precio total</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    purchases.map(this.renderPurchases)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey={2} title="Agregar compras">
                            <div className="tab-container">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="date">Fecha de la compra</label>
                                            <input placeholder="25/01/1998" id="date" name="date" type="text" className="form-control" />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="item_id">Selecciona el artículo que se compró</label>

                                            <select id="item_id" name="item_id" className="form-control">
                                                { items.map(this.renderItem) }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="item_qty">Ingresa la cantidad que se compró</label>
                                            <input placeholder="4" id="item_qty" name="item_qty" type="text" className="form-control" />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="description">Descripción de la compra</label>
                                            <input placeholder="Compra de tres pañaleras" id="description" name="description" type="text" className="form-control" />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Enviar datos</button>
                                </form>
                            </div>
                        </Tab>
                    </Tabs>

                    <Modal show={this.state.show} onHide={this.handleClose} animation={true}>
                        <Modal.Header>
                            <Modal.Title>Acerca de la compra</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                                {
                                    (!this.state.submitted)?
                                        <p>Faltan datos por ingresar.</p>
                                        :
                                        <p>¡Enviado!</p>
                                }
                        </Modal.Body>

                        <Modal.Footer>
                            <button className="btn btn-primary" onClick={this.handleClose}>Cerrar</button>
                        </Modal.Footer>
                    </Modal>

                    <br />
                </div>
            )
        );
    }
}

export default PurchasesManagement;
