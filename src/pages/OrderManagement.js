import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button, ButtonGroup } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import DataTable, { defaultThemes }  from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faMobileAlt, faCheckCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItems, FetchOrders, InsertOrder, UpdateOrderState } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class OrderManagement extends Component {
    constructor(props, context) {
        super(props, context);

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
    HandleSubmitNewOrder = (event) => {
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
        var currentValue = e.currentTarget.attributes[1].value

        this.setState({ showOrderStateSwapModal: true });
        this.setState({ idEdit: idEdit, currentValue: currentValue });
    }

    SwapOrderState(){
        UpdateOrderState( this.state.idEdit, this.state.currentValue )
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
        .then(response => {
            for (var i = 0; i < response.Data.length; i++) {
                var current_id = response.Data[i]['ID']
                var current_value = response.Data[i]['finished']

                response.Data[i]['precio'] = '$'+NumberWithDots( response.Data[i]['item']['sell_price'] )
                response.Data[i]['date'] = FormatDate( response.Data[i]['date'] )
                response.Data[i]['contact'] = '+569 '+response.Data[i]['contact']
                response.Data[i]['source'] = (response.Data[i]['source'] == 'F') ? <FontAwesomeIcon icon={faLaptop} /> : <FontAwesomeIcon icon={faMobileAlt} />
                // response.Data[i]['finished'] =
                response.Data[i]['acciones'] = <ButtonGroup aria-label="Basic example"><Button size="sm" id={current_id} cvalue={current_value} onClick={this.HandleSwapOrderState}> { response.Data[i]['finished'] ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimes} /> } </Button> <Button size="sm" variant="danger" id={current_id} onClick={this.HandleEditModalData}><FontAwesomeIcon icon={faTrash} /></Button></ButtonGroup>
            }

            return response
        })
        .then(res => {
            this.setState({ orders: res.Data, fetchDone: true }, () => console.log(res) );
        })
    }

    renderItem = ({ID, description} ) => <option key={ID} value={ID}> { description } </option>

    render() {
        const { items } = this.state;
        const { orders } = this.state;
        const { showOrderStateSwapModal } = this.state;

        const paginationOptions = { rowsPerPageText: 'Filas por página', rangeSeparatorText: 'de' };

        const columns = [
            {
                name: '#',
                selector: 'ID',
                sortable: true,
                center: true,
                width: '60px'
            },
            {
                name: 'Comprador',
                selector: 'buyer',
                sortable: true,
                center: true
            },
            {
                name: 'Producto',
                selector: 'description',
                sortable: true,
                center: true
            },
            {
                name: 'Fecha',
                selector: 'date',
                sortable: true,
                center: true,
                width: '100px'
            },
            {
                name: 'Precio',
                selector: 'precio',
                sortable: true,
                center: true,
                width: '90px'
            },
            {
                name: 'RRSS',
                selector: 'source',
                sortable: true,
                center: true,
                width: '70px'
            },
            {
                name: 'Acciones',
                selector: 'acciones',
                sortable: true,
                center: true,
                width: '100px'
            }
        ];

        const SampleExpandedComponent = ({ data }) => (
          <div className="expanded-row">
            <ol className="ol-triangle">
                <li className="li-triangle">
                    Precio a pagar: {data.precio}
                </li>
                <li className="li-triangle">
                    Producto a entregar: {data.description}
                </li>
                <li className="li-triangle">
                    Número de contacto: {data.contact}
                </li>
                <li className="li-triangle">
                    {data.location} a las {data.hour}hrs.
                </li>
            </ol>
          </div>
        );

        return (
            (this.state.fetchDone === false) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <AlertsHandler onRef={ref => (this.AlertsHandler = ref)} />
                    <PageTitle text="Gestión de pedidos" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab">
                        <Tab eventKey={1} title="Ver pedidos">
                            <DataTable
                                title="Listado de pedidos"
                                columns={columns}
                                data={orders}
                                paginationComponentOptions={paginationOptions}
                                expandableRowsComponent={<SampleExpandedComponent />}
                                expandableRows
                                highlightOnHover
                                pagination
                            />
                        </Tab>

                        <Tab eventKey={2} title="Agendar nuevo pedido">
                            <Form onSubmit={this.HandleSubmitNewOrder}>
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
                                        {/*<Form.Control as="input" placeholder="Estación de metro Los Héroes, 19:00hrs." id="location" name="location" />*/}
                                        <Form.Control as="select" id="location" name="location">
                                            <optgroup label="Línea 1">
                                                <option>Estación San Pablo (L1)</option>
                                                <option>Estación Neptuno</option>
                                                <option>Estación Pajaritos</option>
                                                <option>Estación Las Rejas</option>
                                                <option>Estación Ecuador</option>
                                                <option>Estación San Alberto Hurtado</option>
                                                <option>Estación Usach</option>
                                                <option>Estación Central</option>
                                                <option>Estación ULA</option>
                                                <option>Estación República</option>
                                                <option>Estación Los Héroes (L1)</option>
                                                <option>Estación Moneda</option>
                                                <option>Estación U. de Chile</option>
                                                <option>Estación Santa Lucía</option>
                                                <option>Estación U. Católica</option>
                                                <option>Estación Baquedano</option>
                                            </optgroup>
                                            <optgroup label="Línea 2">
                                                <option>Estación La Cisterna</option>
                                                <option>Estación El Parrón</option>
                                                <option>Estación Lo Ovalle</option>
                                                <option>Estación Cuidad del niño</option>
                                                <option>Estación Departamental</option>
                                                <option>Estación Lo Vial</option>
                                                <option>Estación San Miguel</option>
                                                <option>Estación El ano</option>
                                                <option>Estación Franklin</option>
                                                <option>Estación Rondizzoni</option>
                                                <option>Estación Parque O'Higgins</option>
                                                <option>Estación Toesca</option>
                                                <option>Estación Los Héroes (L2)</option>
                                            </optgroup>
                                            <optgroup label="Línea 5">
                                                <option>Estación Plaza Maipú</option>
                                                <option>Estación Santiago Bueras</option>
                                                <option>Estación Del Sol</option>
                                                <option>Estación Monte Tabor</option>
                                                <option>Estación Las Parcelas</option>
                                                <option>Estación Laguna Sur</option>
                                                <option>Estación Barrancas</option>
                                                <option>Estación Pudahuel</option>
                                                <option>Estación San Pablo (L5)</option>
                                                <option>Estación Lo Prado</option>
                                                <option>Estación Blanqueado</option>
                                                <option>Estación Gruta de Lourdes</option>
                                                <option>Estación Quinta Normal </option>
                                                <option>Estación Cummings</option>
                                                <option>Estación Santa Ana</option>
                                                <option>Estación Plaza de Armas</option>
                                                <option>Estación Bellas Artes</option>
                                                <option>Estación Baquedano</option>
                                            </optgroup>
                                            <optgroup label="Envíos">
                                                <option>Envío Starken</option>
                                                <option>Envío Chilexpress</option>
                                            </optgroup>
                                        </Form.Control>
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
