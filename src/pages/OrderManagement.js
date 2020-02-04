import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faMobileAlt, faCheckCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItems, FetchOrders, InsertOrder } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class OrderManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.HandleSwapOrderState = this.HandleSwapOrderState.bind(this);
        this.CloseSwapStateModal = this.CloseSwapStateModal.bind(this);
        this.SwapOrderState = this.SwapOrderState.bind(this);

        this.state = {
            fetchDone: false,
            idEdit: 0,
            submitted: false,
            showOrderStateSwapModal: false,
            items: [],
            orders: [],
        };
    }

    // Modal stuff
    handleSubmit = (event) => {
        event.preventDefault();
        const et = event.target;

        for (var i = 0; i < et.length - 1; i++) {
            if (et[i].value == ''){
                this.AlertsHandler.generate('danger', '¡Error!', 'Faltan datos por ingresar.');
                return
            }
        }

        let jsonData = {
            "buyer": et[0].value,
            "description": et[1].value,
            "contact": parseInt(et[2].value, 10),
            "date": et[3].value,
            "item_id": parseInt(et[4].value, 10),
            "source": et[5].value,
            "hour": et[6].value,
            "discount": parseFloat(et[7].value),
            "location": et[8].value,
            "finished": 0
        }

        InsertOrder( jsonData )
        .then(r => {
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos enviados correctamente al sistema.');
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron ingresados al sistema.');
            }
        })
    }

    CloseSwapStateModal() {
        this.setState({ showOrderStateSwapModal: false });
    }

    HandleSwapOrderState( e ) {
        var idEdit = e.currentTarget.id;

        this.setState({ showOrderStateSwapModal: true });
        this.setState({ idEdit: idEdit });
    }

    SwapOrderState(){
        console.log(this.URL+`/orders/update?order_id=` + this.state.idEdit);

        fetch(this.URL+`/orders/update?order_id=` + this.state.idEdit)
        .then( r => this.RefreshOrders() )
        .catch(err => console.error(err))

        this.setState({ showOrderStateSwapModal: false });
    }

    componentDidMount(){
        FetchItems().then(res => this.setState({ items: res.Data }))
        this.RefreshOrders();
    }

    RefreshOrders(){
        FetchOrders()
        .then(res => {
            this.setState({ orders: res.Data, fetchDone: true }, () => {
                for (var i = 0; i < this.state.orders.length; i++) {
                    var current_id = this.state.orders[i]['ID']

                    this.state.orders[i]['precio'] = '$'+NumberWithDots( this.state.orders[i]['item']['sell_price'] )
                    this.state.orders[i]['date'] = FormatDate( this.state.orders[i]['date'] )
                    this.state.orders[i]['contact'] = '+569 '+this.state.orders[i]['contact']
                    this.state.orders[i]['source'] = (this.state.orders[i]['source'] == 'F') ? <FontAwesomeIcon icon={faLaptop} /> : <FontAwesomeIcon icon={faMobileAlt} />
                    this.state.orders[i]['finished'] = <Button size="sm" id={current_id} onClick={this.HandleSwapOrderState}> { this.state.orders[i]['finished'] ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimes} /> } </Button>
                    this.state.orders[i]['acciones'] = <Button size="sm" variant="danger" id={current_id} onClick={this.HandleEditModalData}><FontAwesomeIcon icon={faTrash} /></Button>
                }
            });
        })
    }

    renderItem = ({ID, description} ) => <option key={ID} value={ID}> { description } </option>

    render() {
        const { items, item } = this.state;
        const { orders, order } = this.state;
        const { showOrderStateSwapModal } = this.state;

        const data = {
            columns: [
                {
                    label: '#',
                    field: 'ID',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Comprador',
                    field: 'buyer',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Producto',
                    field: 'description',
                    sort: 'desc',
                    width: 200
                },
                {
                    label: 'Fecha',
                    field: 'date',
                    sort: 'desc',
                    width: 100
                },
                {
                    label: 'Contacto',
                    field: 'contact',
                    sort: 'desc',
                    width: 270
                },
                {
                    label: 'Precio',
                    field: 'precio',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Fuente',
                    field: 'source',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Ubicación',
                    field: 'location',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Hora',
                    field: 'hour',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: 'Estado',
                    field: 'finished',
                    sort: 'desc',
                    width: 150
                },
                {
                    label: '',
                    field: 'acciones',
                    sort: 'asc',
                    width: 50
                }
            ],
            rows: orders
        };

        return (
            (this.state.fetchDone === false) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <AlertsHandler onRef={ref => (this.AlertsHandler = ref)} />
                    <PageTitle text="Gestión de pedidos" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab">
                        <Tab eventKey={1} title="Ver pedidos">
                            <MDBDataTable
                                striped
                                bordered
                                data={data}
                            />
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
                                        <Form.Control as="input" placeholder="2020-01-25" id="date" name="date" type="text" />
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

                                <center><Button type="submit" variant="primary">Enviar datos</Button></center>
                            </Form>
                        </Tab>
                    </Tabs>

                    <Modal show={ showOrderStateSwapModal } animation={true}>
                        <Modal.Header><Modal.Title>Cambio de estado del pedido</Modal.Title></Modal.Header>
                        <Modal.Body>¿Quieres cambiar el estado del pedido?</Modal.Body>
                        <Modal.Footer>
                            <Button className="btn btn-primary" onClick={this.SwapOrderState}>Cambiar</Button>
                            <Button className="btn btn-secondary" onClick={this.CloseSwapStateModal}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>

                    <br />
                </div>
            )
        );
    }
}

export default OrderManagement;
