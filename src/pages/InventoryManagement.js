import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItems, FetchOrders, InsertOrder } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class InventoryManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.OpenModal = this.OpenModal.bind(this);
        this.CloseModal = this.CloseModal.bind(this);

        this.state = {
            FetchDone: false,
            NewProductSubmitted: false,
            ShowModal: false,
            items: [],
            item: {
                id: '',
                description: '',
                times_bought: 0,
                times_sold: 0,
                type: '',
                color: '',
                sell_price: 0
            }
        };
    }

    SubmitNewProduct = (event) => {
        event.preventDefault();

        var description = event.target[0].value;
        var type = event.target[1].value;
        var color = event.target[2].value;
        var purchase_price = event.target[3].value;
        var sell_price = event.target[4].value;

        if ( description == '' || type == '' || color == '' || purchase_price == '' || sell_price == '') {
            this.setState({ NewProductSubmitted: false });
            this.OpenModal();
        }else{
            fetch(this.URL+`/items/add?description=${description}&type=${type}&color=${color}&purchase_price=${purchase_price}&sell_price=${sell_price}`)
            .then(this.GetItems)
            .catch(err => console.error(err))

            this.setState({ NewProductSubmitted: true });
            this.OpenModal();
        }
    }

    CloseModal() {
        this.setState({ ShowModal: false });
    }

    OpenModal() {
        this.setState({ ShowModal: true });
    }

    componentDidMount(){
        this.GetItems();
    }

    GetItems = _ => {
        fetch(this.URL+`/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data, FetchDone: true }))
        .catch(err => console.error(err))
    }

    NumberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    RenderItems = ({id, description, times_bought, times_sold, type, color, sell_price} ) => <tr key={id}><td>{id}</td><td>{description}</td><td>{times_bought}</td><td>{times_sold}</td><td>{times_bought-times_sold}</td><td><img src={ this.URL+"/img?image=" + type } alt={type}/></td><td>{"$"+this.NumberWithDots(sell_price)}</td></tr>

    render() {
        const { items, item } = this.state;

        return (
            !(this.state.FetchDone) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <PageTitle text="Gestión de inventario" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" animation={false}>
                        <Tab eventKey={1} title="Ver productos">
                            <Table responsive size="sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Descripción</th>
                                        <th>Veces comprado</th>
                                        <th>Veces vendido</th>
                                        <th>Stock</th>
                                        <th>Tipo</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { items.map(this.RenderItems) }
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey={2} title="Agregar productos">
                                <Form onSubmit={this.SubmitNewProduct}>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Descripción del producto</Form.Label>
                                            <Form.Control as="input" placeholder="Mochila Kanken Rojo" id="description" name="description" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Estilo del producto</Form.Label>
                                            <Form.Control as="input" placeholder="KANKEN" id="type" name="type" type="text" />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Color del producto (Usar color neutro: ROJO, ROSADO, AMARILLO)</Form.Label>
                                            <Form.Control as="input" placeholder="ROSADO" id="color" name="color" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Indica el precio de compra</Form.Label>
                                            <Form.Control as="input" placeholder="5500" id="purchase_price" name="purchase_price" type="text" />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Indica el precio de venta</Form.Label>
                                            <Form.Control as="input" placeholder="11000" id="sell_price" name="sell_price" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Button type="submit">Enviar datos</Button>
                                </Form>
                        </Tab>
                    </Tabs>

                    <Modal show={this.state.ShowModal} onHide={this.CloseModal} animation={true}>
                        <Modal.Header>
                            <Modal.Title>Acerca del producto</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                                {(!this.state.NewProductSubmitted)?
                                    <p>Faltan datos por ingresar.</p>
                                    :
                                    <p>¡Enviado!</p>}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={this.CloseModal}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        );
    }
}

export default InventoryManagement;
