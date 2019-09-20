import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

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
            FetchDone: false,
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
        .then(resp => this.setState({ orders: resp.data, FetchDone: true }))
        .catch(err => console.error(err))
    }

    NumberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
    FormatDiscount = (x, d) => { return "$"+this.NumberWithDots(Math.round(x*(1-d/100))); }

    renderItem = ({id, description, times_bought, times_sold, type, color, price} ) => <option key={id} value={id}> { description } </option>
    renderOrder = ({id, buyer, date, description, contact, total_price, source, location, hour, discount, finished}) => (
        <tr key={id}> <td>{buyer.toUpperCase()}</td> <td>{description}</td> <td>{date}</td> <td>{"+569 "+contact}</td> <td>{this.FormatDiscount(total_price, discount)}</td> <td> <img src={this.URL+"/img?image="+source} /> </td> <td>{location}</td> <td>{hour}</td> <td onClick={() => this.handleShowSwap(id)}> <img src={ this.URL+"/img?image=" + finished } /></td></tr>
    )

    render() {
        const { items, item } = this.state;
        const { orders, order } = this.state;

        return (
            (this.state.FetchDone === false) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <PageTitle text="Gestión de pedidos" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" animation={false}>
                        <Tab eventKey={1} title="Ver todos los pedidos">
                            <Table responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Fecha</th>
                                        <th>Contacto</th>
                                        <th>Precio</th>
                                        <th>Fuente</th>
                                        <th>Encuentro</th>
                                        <th>Hora</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { orders.map(this.renderOrder) }
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey={2} title="Agendar nuevo pedido">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Nombre del comprador (o Instagram)</Form.Label>
                                        <Form.Control as="input" placeholder="Martín Saavedra Núñez" id="buyer" name="buyer" type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Descripción y detalles</Form.Label>
                                        <Form.Control as="input" placeholder="Mochila estilo Kanken." id="description" name="description" type="description" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Teléfono de contacto</Form.Label>
                                        <Form.Control as="input" placeholder="50731812" id="contact" name="contact" type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Fecha de entrega</Form.Label>
                                        <Form.Control as="input" placeholder="25/01/1998" id="date" name="date" type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Selecciona el pedido</Form.Label>

                                        <Form.Control as="select" id="item_id" name="item_id">
                                            { items.map(this.renderItem) }
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Selecciona el medio de contacto con el comprador</Form.Label>

                                        <Form.Control as="select" id="source" name="source">
                                            <option value="I">Instagram</option>
                                            <option value="F">Facebook</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa la hora del encuentro</Form.Label>
                                        <Form.Control as="input" placeholder="13:45hrs." id="hour" name="hour" type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa % de descuento</Form.Label>
                                        <Form.Control as="input" placeholder="25" id="discount" name="discount" type="text"/>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Indica la ubicación de encuentro</Form.Label>
                                        <Form.Control as="input" placeholder="Estación de metro Los Héroes, 19:00hrs." id="location" name="location" />
                                    </Form.Group>
                                </Form.Row>

                                <Button type="submit" variant="primary">Enviar datos</Button>
                            </Form>
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
