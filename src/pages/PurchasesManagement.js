import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

class PurchasesManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.OpenModal = this.OpenModal.bind(this);
        this.CloseModal = this.CloseModal.bind(this);

        this.state = {
            FetchDone: false,
            NewPurchaseSubmitted: false,
            ShowModal: false,
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

    SubmitNewPurchase = (event) => {
        event.preventDefault();

        var date = event.target[0].value;
        var item_id = event.target[1].value;
        var item_qty = event.target[2].value;
        var description = event.target[3].value;

        if ( date == '' || item_id == '' || item_qty == '' || description == '') {
            this.setState({ NewPurchaseSubmitted: false });
            this.OpenModal();
        }else{
            fetch(this.URL+`/purchases/add?date=${date}&item_id=${item_id}&item_qty=${item_qty}&description=${description}`)
            .then(this.GetPurchases)
            .catch(err => console.error(err))

            this.setState({ NewPurchaseSubmitted: true });
            this.OpenModal();
        }
    }

    CloseModal() {
        this.setState({ ShowModal: false });
    }

    OpenModal() {
        this.setState({ ShowModal: true });
    }

    // Database stuff
    componentDidMount(){
        this.GetPurchases();
        this.GetItems();
    }

    GetPurchases = _ => {
        fetch(this.URL+`/purchases`)
        .then(response => response.json())
        .then(resp => this.setState({ purchases: resp.data, FetchDone: true }))
        .catch(err => console.error(err))
    }

    GetItems = _ => {
        fetch(this.URL+`/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data }))
        .catch(err => console.error(err))
    }

    NumberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    RenderItems = ({id, description, times_bought, times_sold, type, color, sell_price} ) => <option key={id} value={id}> { description } </option>
    RenderPurchases = ({id, date, description, item_qty, unit_price } ) => <tr key={id}><td>{ id }</td><td>{ date }</td><td>{ description }</td><td>{ item_qty }</td><td>{ "$"+this.NumberWithDots(unit_price*item_qty) }</td></tr>

    render() {
        const { purchases, purchase } = this.state;
        const { items, item } = this.state;

        return (
            !(purchases.length || items.length) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <PageTitle text="Gestión de compras" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" animation={false}>
                        <Tab eventKey={1} title="Ver compras realizadas">
                            <Table responsive size="sm">
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
                                        purchases.map(this.RenderPurchases)
                                    }
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey={2} title="Agregar compras">
                                <Form onSubmit={this.SubmitNewPurchase}>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Fecha de la compra</Form.Label>
                                            <Form.Control as="input" placeholder="25/01/1998" id="date" name="date" type="text" />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Selecciona el artículo que se compró</Form.Label>

                                            <Form.Control as="select" id="item_id" name="item_id">
                                                { items.map(this.RenderItems) }
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Ingresa la cantidad que se compró</Form.Label>
                                            <Form.Control as="input" placeholder="4" id="item_qty" name="item_qty" type="text" />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Descripción de la compra</Form.Label>
                                            <Form.Control as="input" placeholder="Compra de tres pañaleras" id="description" name="description" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Button type="submit">Enviar datos</Button>
                                </Form>
                        </Tab>
                    </Tabs>

                    <Modal show={this.state.ShowModal} onHide={this.CloseModal} animation={true}>
                        <Modal.Header>
                            <Modal.Title>Acerca de la compra</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                                {
                                    (!this.state.NewPurchaseSubmitted)?
                                        <p>Faltan datos por ingresar.</p>
                                        :
                                        <p>¡Enviado!</p>
                                }
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.CloseModal}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>

                    <br />
                </div>
            )
        );
    }
}

export default PurchasesManagement;
