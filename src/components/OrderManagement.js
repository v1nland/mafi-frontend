import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal } from 'react-bootstrap';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/orderManagement.css';

class OrderManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleShowSwap = this.handleShowSwap.bind(this);
        this.handleCloseSwap = this.handleCloseSwap.bind(this);

        this.handleSwap = this.handleSwap.bind(this);

        this.state = {
            curID: -1,
            submitted: false,
            show: false,
            showSwapState: false,
            items: [],
            item: {
                id: '',
                description: '',
                type: '',
                color: '',
                purchase_price: 0,
                sell_price: 0
            },
            orders: [],
            order: {
                id: 0,
                buyer: '',
                description: '',
                contact: 0,
                date: '0000-00-00',
                item_id: 0,
                source: 0,
                location: '',
                hour: '',
                discount: 0,
                finished: 0
            }
        };
    }

    // Modal stuff
    handleSubmit = (event) => {
        event.preventDefault();

        var buyer = event.target[0].value;
        var description = event.target[1].value;
        var contact = event.target[2].value;
        var date = event.target[3].value;
        var item_id = event.target[4].value;
        var source = event.target[5].value;
        var hour = event.target[6].value;
        var discount = event.target[7].value;
        var location = event.target[8].value;

        if ( buyer == '' || description == '' || contact == '' || date == '' || item_id == '' || source == '' || hour == '' || discount == '' ||location == '') {
            this.state.submitted = false;
            this.handleShow();
        }else{
            fetch(this.URL+`/orders/add?buyer=${buyer}&description=${description}&contact=${contact}&date=${date}&item_id=${item_id}&source=${source}&hour=${hour}&discount=${discount}&location=${location}&finished=0`)
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

    handleCloseSwap() {
        this.setState({ showSwapState: false });
    }

    handleShowSwap( id ) {
        this.setState({ showSwapState: true });
        this.setState({ curID: id });
    }

    handleSwap(){
        fetch(this.URL+`/orders/update?order_id=` + this.state.curID)
        .then(this.getOrders)
        .catch(err => console.error(err))

        this.setState({ showSwapState: false });
    }

    // Database stuff
    componentDidMount(){
        this.getItems();
        this.getOrders();
    }

    getItems = _ => {
        fetch(this.URL+`/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data }))
        .catch(err => console.error(err))
    }

    getOrders = _ => {
        fetch(this.URL+`/orders`)
        .then(response => response.json())
        .then(resp => this.setState({ orders: resp.data }))
        .catch(err => console.error(err))
    }

    numberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    renderItem = ({id, description, times_bought, times_sold, type, color, price} ) => <option key={id} value={id}> { description } </option>
    // renderOrder = ({id, buyer, date, description, contact, total_price, source, location ,finished}) => <tr key={id}><td>{buyer.toUpperCase()}</td><td>{description}</td><td>{date}</td><td>{"+569"+contact}</td><td>{"$"+this.numberWithDots(total_price)}</td><td><img src={ "https://mafi-backend.herokuapp.com/img?image=" + source } alt={!source?"Instagram":"Facebook"}/></td><td>{location}</td><td onClick={() => this.handleShowSwap(id)}><img src={ "https://mafi-backend.herokuapp.com/img?image=" + finished } alt={!finished?"¡Entregado!":"Por entregar"}/></td></tr>
    renderOrder = ({id, buyer, date, description, contact, total_price, source, location, hour, discount, finished}) => <tr key={id}><td>{buyer.toUpperCase()}</td><td>{description}</td><td>{date}</td><td>{"+569"+contact}</td><td>{"$"+this.numberWithDots(Math.round(total_price*(1-discount/100)))}</td><td><img src={ this.URL + "/img?image=" + source } alt={!source?"Instagram":"Facebook"}/></td><td>{location}</td><td>{hour}</td><td onClick={() => this.handleShowSwap(id)}><img src={ this.URL+"/img?image=" + finished } alt={!finished?"¡Entregado!":"Por entregar"}/></td></tr>

    render() {
        const { items, item } = this.state;
        const { orders, order } = this.state;

        return (
            !(orders.length || items.length) ? (
                <span>Loading...</span>
            ) : (
                <div>
                    <div className="page-title">
                        <h1>Gestión de pedidos</h1>
                        <hr />
                    </div>

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" animation={false}>
                        <Tab eventKey={1} title="Ver todos los pedidos">
                            <div className="tab-container">
                                <div className="long-block">
                                    <div className="block-title">Últimos pedidos</div>

                                    <div className="block-body">
                                        {
                                            (orders && orders.length)?
                                                <table className="table table-sm table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Nombre</th>
                                                            <th scope="col">Descripción</th>
                                                            <th scope="col">Fecha</th>
                                                            <th scope="col">Contacto</th>
                                                            <th scope="col">Precio</th>
                                                            <th scope="col">Fuente</th>
                                                            <th scope="col">Encuentro</th>
                                                            <th scope="col">Hora</th>
                                                            <th scope="col">Estado</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {
                                                            orders.map(this.renderOrder)
                                                        }
                                                    </tbody>
                                                </table>
                                                :
                                                <h1>No hay pedidos que mostrar</h1>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey={2} title="Agendar nuevo pedido">
                            <div className="tab-container">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="buyer">Nombre del comprador (o nombre de Instagram)</label>
                                            <input placeholder="Martín Saavedra Núñez" id="buyer" name="buyer" type="text" className="form-control" />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="description">Descripción</label>
                                            <input placeholder="Mochila estilo Kanken." id="description" name="description" type="description" className="form-control" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="contact">Teléfono de contacto</label>
                                            <input placeholder="50731812" id="contact" name="contact" type="text" className="form-control" />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="date">Fecha de entrega</label>
                                            <input placeholder="25/01/1998" id="date" name="date" type="text" className="form-control" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="item_id">Selecciona el pedido</label>

                                            <select id="item_id" name="item_id" className="form-control">
                                                { items.map(this.renderItem) }
                                            </select>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="source">Selecciona el medio de contacto con el comprador</label>

                                            <select id="source" name="source" className="form-control">
                                                <option value="I">Instagram</option>
                                                <option value="F">Facebook</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="hour">Ingresa la hora del encuentro</label>
                                            <input placeholder="13:45hrs." id="hour" name="hour" type="text" className="form-control" />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="discount">Ingresa % de descuento</label>
                                            <input placeholder="25" id="discount" name="discount" type="text" className="form-control" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Indica la ubicación de encuentro</label>
                                        <input placeholder="Estación de metro Los Héroes, 19:00hrs." id="location" name="location" className="form-control" />
                                    </div>

                                    <button type="submit" className="btn btn-primary">Enviar datos</button>
                                </form>
                            </div>
                        </Tab>
                    </Tabs>

                    <Modal show={this.state.show} onHide={this.handleClose} animation={true}>
                        <Modal.Header>
                            <Modal.Title>Acerca del pedido</Modal.Title>
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

                    <Modal show={this.state.showSwapState} onHide={this.handleCloseSwap} animation={true}>
                        <Modal.Header>
                            <Modal.Title>Cambio de estado del pedido</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            ¿Quieres cambiar el estado del pedido?
                        </Modal.Body>

                        <Modal.Footer>
                            <button className="btn btn-primary" onClick={this.handleSwap}>Cambiar</button>
                            <button className="btn btn-light" onClick={this.handleCloseSwap}>Cerrar</button>
                        </Modal.Footer>
                    </Modal>

                    <br />
                </div>
            )
        );
    }
}

export default OrderManagement;
