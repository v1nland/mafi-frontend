import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button, ButtonGroup } from 'react-bootstrap';
import DataTable, { defaultThemes }  from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItems, FetchOrders, InsertOrder, UpdateOrderState, DeleteOrder } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class OrderManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.CloseModal = this.CloseModal.bind(this);
        this.SwapOrderState = this.SwapOrderState.bind(this);
        this.HandleSwapOrderState = this.HandleSwapOrderState.bind(this);

        this.DeleteCurrentOrder = this.DeleteCurrentOrder.bind(this);
        this.HandleDeleteOrder = this.HandleDeleteOrder.bind(this);

        this.state = {
            fetchDone: false,
            idEdit: 0,
            submitted: false,
            showModal: false,
            items: [],
            orders: [],
            modalTitle: '',
            modalBody: '',
            modalFooter: '',
        };
    }

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
            "contact": parseInt(et[1].value, 10),
            "location": et[2].value,
            "date": et[3].value,
            "item_id": parseInt(et[4].value, 10),
            "source": et[5].value,
            "hour": et[6].value,
            "discount": parseFloat(et[7].value),
            "description": et[8].value,
            "finished": 0
        }

        InsertOrder( jsonData )
        .then(r => {
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos enviados correctamente al sistema.');
                this.RefreshOrders()
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron ingresados al sistema.');
            }
        })
    }

    CloseModal() {
        this.setState({ showModal: false });
    }

    HandleSwapOrderState( e ) {
        var idEdit = e.currentTarget.id;
        var currentValue = e.currentTarget.attributes[1].value;

        this.setState({ modalTitle: 'Cambio de estado del pedido', modalBody: '¿Quieres cambiar el estado del pedido?', modalFooter: (<div><Button className="btn btn-primary" onClick={this.SwapOrderState}>Cambiar</Button> <Button className="btn btn-secondary" onClick={this.CloseModal}>Cerrar</Button></div>), showModal: true });
        this.setState({ idEdit: idEdit, currentValue: currentValue });
    }

    SwapOrderState(){
        UpdateOrderState( this.state.idEdit, this.state.currentValue )
        .then( r => {
            this.RefreshOrders()
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos cambiados correctamente en el sistema.');
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron cambiados en el sistema.');
            }
        })
        .catch(err => console.error(err))

        this.setState({ showModal: false });
    }

    HandleDeleteOrder( e ) {
        var idEdit = e.currentTarget.id;

        this.setState({ modalTitle: 'Eliminar pedido', modalBody: '¿Estás seguro que quieres eliminar el pedido?', modalFooter: (<div><Button className="btn btn-danger" onClick={this.DeleteCurrentOrder}>Eliminar</Button> <Button className="btn btn-secondary" onClick={this.CloseModal}>Cerrar</Button></div>), showModal: true });
        this.setState({ idEdit: idEdit });
    }

    DeleteCurrentOrder(){
        DeleteOrder( this.state.idEdit )
        .then( r => {
            this.RefreshOrders()
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos eliminados correctamente del sistema.');
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron eliminados del sistema.');
            }
        })
        .catch(err => console.error(err))

        this.setState({ showModal: false });
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

                response.Data[i]['precio'] = FormatDiscount(response.Data[i]['item']['sell_price'], response.Data[i]['discount'])
                response.Data[i]['item_description'] = response.Data[i]['item']['description']
                response.Data[i]['date'] = FormatDate( response.Data[i]['date'] )
                response.Data[i]['contact'] = (response.Data[i]['contact'] ? '+569 '+response.Data[i]['contact'] : 'N/A')
                response.Data[i]['source'] = (response.Data[i]['source'] == 'F') ? <FontAwesomeIcon icon={faFacebookSquare} size="2x"/> : <FontAwesomeIcon icon={faInstagram} size="2x"/>
                response.Data[i]['acciones'] = <ButtonGroup><Button size="sm" id={current_id} cvalue={current_value} onClick={this.HandleSwapOrderState}> { response.Data[i]['finished'] ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimes} /> } </Button> <Button size="sm" variant="danger" id={current_id} onClick={this.HandleDeleteOrder}><FontAwesomeIcon icon={faTrash} /></Button></ButtonGroup>
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
        const { showModal, modalTitle, modalBody, modalFooter } = this.state;

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
                center: true
            },
            {
                name: 'Producto',
                selector: 'item_description',
                center: true
            },
            {
                name: 'Fecha',
                selector: 'date',
                center: true,
                width: '100px'
            },
            {
                name: 'Precio',
                selector: 'precio',
                center: true,
                width: '90px'
            },
            {
                name: 'RRSS',
                selector: 'source',
                center: true,
                width: '70px'
            },
            {
                name: 'Acciones',
                selector: 'acciones',
                center: true,
                width: '100px'
            }
        ];

        const conditionalRowStyles = [
            {
                when: row => row.finished,
                style: {
                    backgroundColor: '#3fc380',
                    color: 'white',
                    '&:hover': {
                        cursor: 'pointer',
                    },
                },
            },
            {
                when: row => !row.finished,
                style: {
                    backgroundColor: '#bb2124',
                    color: 'white',
                    '&:hover': {
                        cursor: 'pointer',
                    },
                },
            }
        ];

        const ExpandedComponent = ({ data }) => (
          <div className="expanded-row">
            <ol className="ol-triangle">
                <li className="li-triangle">
                    Precio a pagar: {data.precio}
                </li>
                <li className="li-triangle">
                    Producto a entregar: {data.item_description}
                </li>
                <li className="li-triangle">
                    Número de contacto: {data.contact}
                </li>
                <li className="li-triangle">
                    <b>{data.location}</b> a las {data.hour}hrs.
                </li>
                <li className="li-triangle">
                    Descripción: {data.description}
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
                                title="Lista de pedidos"
                                columns={columns}
                                data={orders}
                                expandableRowsComponent={<ExpandedComponent />}
                                expandableRows
                                highlightOnHover
                                pagination
                                paginationComponentOptions={paginationOptions}
                                conditionalRowStyles={conditionalRowStyles}
                            />
                        </Tab>

                        <Tab eventKey={2} title="Agendar nuevo pedido" className="form-tab">
                            <Form onSubmit={this.HandleSubmitNewOrder}>
                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Nombre (o Instagram)</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Teléfono de contacto</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="Martín Saavedra Núñez" id="buyer" name="buyer" type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="50731812" id="contact" name="contact" type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Indica la ubicación de encuentro</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Fecha de entrega</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
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

                                    <Form.Group as={Col}>
                                        <Form.Control as="input" id="date" name="date" type="date" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Selecciona el pedido</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Selecciona el medio de contacto</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="select" id="item_id" name="item_id">
                                            { items.map(this.renderItem) }
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Control as="select" id="source" name="source">
                                            <option value="I">Instagram</option>
                                            <option value="F">Facebook</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa la hora del encuentro</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa % de descuento</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="13:45" id="hour" name="hour" type="time" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="25" id="discount" name="discount" type="text"/>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Descripción y detalles adicionales</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="textarea" placeholder="Entregar en la salida XXXXX, lo retirará otra persona. Se debe realizar el envío al local XXXXX." id="description" name="description" type="description" rows="4"/>
                                    </Form.Group>
                                </Form.Row>

                                <center><Button type="submit" variant="primary">Enviar datos</Button></center>
                            </Form>
                        </Tab>
                    </Tabs>

                    <Modal show={ showModal } animation={true}>
                        <Modal.Header><Modal.Title>{ modalTitle }</Modal.Title></Modal.Header>
                        <Modal.Body>{ modalBody }</Modal.Body>
                        <Modal.Footer>{ modalFooter }</Modal.Footer>
                    </Modal>

                    <br />
                </div>
            )
        );
    }
}

export default OrderManagement;
