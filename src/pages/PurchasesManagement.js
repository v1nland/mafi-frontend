import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button, ButtonGroup } from 'react-bootstrap';
import DataTable, { defaultThemes }  from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive, faTrash } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItems, FetchPurchases, InsertPurchase, DeletePurchase } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class PurchasesManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.CloseModal = this.CloseModal.bind(this);
        this.DeleteCurrentPurchase = this.DeleteCurrentPurchase.bind(this);
        this.HandleDeletePurchase = this.HandleDeletePurchase.bind(this);

        this.state = {
            fetchDone: false,
            purchases: [],
            items: [],
            showModal: false,
            modalTitle: '',
            modalBody: '',
            modalFooter: '',
        };
    }

    HandleSubmitNewPurchase = (event) => {
        event.preventDefault();
        const et = event.target;

        for (var i = 0; i < et.length - 1; i++) {
            if (et[i].value == ''){
                this.AlertsHandler.generate('danger', '¡Error!', 'Faltan datos por ingresar.');
                return
            }
        }

        let jsonData = {
            "date": et[0].value,
            "item_id": parseInt(et[1].value, 10),
            "item_qty": parseInt(et[2].value, 10),
            "description": et[3].value
        }

        InsertPurchase( jsonData )
        .then(r => {
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos enviados correctamente al sistema.');
                this.RefreshPurchases()
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron ingresados al sistema.');
            }
        })
    }

    CloseModal() {
        this.setState({ showModal: false });
    }

    componentDidMount(){
        this.RefreshPurchases()
        this.RefreshItems()
    }

    RefreshPurchases(){
        FetchPurchases()
        .then(response => {
            for (var i = 0; i < response.Data.length; i++) {
                var current_id = response.Data[i]['ID']

                response.Data[i]['final_price'] = "$"+NumberWithDots(response.Data[i]['item']['purchase_price']*response.Data[i]['item_qty'])
                response.Data[i]['date'] = FormatDate( response.Data[i]['date'] )
                response.Data[i]['producto'] = response.Data[i]['item']['description']
                response.Data[i]['acciones'] = <ButtonGroup> <Button size="sm" variant="danger" id={current_id} onClick={this.HandleDeletePurchase}><FontAwesomeIcon icon={faTrash} /> </Button> </ButtonGroup>
            }

            return response
        })
        .then(res => {
            this.setState({ purchases: res.Data, fetchDone: true }, () => console.log(res) );
        })
    }

    RefreshItems(){
        FetchItems()
        .then(res => {
            this.setState({ items: res.Data }, () => console.log(res) )
        })
    }

    HandleDeletePurchase( e ) {
        var idEdit = e.currentTarget.id;

        this.setState({ modalTitle: 'Eliminar compra', modalBody: '¿Estás seguro que quieres eliminar la compra?', modalFooter: (<div><Button className="btn btn-danger" onClick={this.DeleteCurrentPurchase}>Eliminar</Button> <Button className="btn btn-secondary" onClick={this.CloseModal}>Cerrar</Button></div>), showModal: true });
        this.setState({ idEdit: idEdit });
    }

    DeleteCurrentPurchase(){
        DeletePurchase( this.state.idEdit )
        .then( r => {
            this.RefreshPurchases()
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos eliminados correctamente del sistema.');
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron eliminados del sistema.');
            }
        })
        .catch(err => console.error(err))

        this.setState({ showModal: false });
    }

    renderItem = ({ID, description} ) => <option key={ID} value={ID}> { description } </option>

    render() {
        const { purchases } = this.state;
        const { items } = this.state;
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
                name: 'Fecha',
                selector: 'date',
                center: true,
                width: '100px'
            },
            {
                name: 'Producto',
                selector: 'producto',
                center: true
            },
            {
                name: 'Cantidad',
                selector: 'item_qty',
                center: true,
                width: '150px'
            },
            {
                name: 'Precio final',
                selector: 'final_price',
                center: true,
                width: '100px'
            },
            {
                name: 'Acciones',
                selector: 'acciones',
                center: true,
                width: '100px'
            }
        ];

        const ExpandedComponent = ({ data }) => (
          <div className="expanded-row">
            <ol className="ol-triangle">
                <li className="li-triangle">
                    Este producto se vende por ${NumberWithDots(data.item.sell_price)} la unidad.
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
                    <PageTitle text="Gestión de compras" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab">
                        <Tab eventKey={1} title="Ver compras">
                            <DataTable
                                title="Lista de compras"
                                columns={columns}
                                data={purchases}
                                expandableRowsComponent={<ExpandedComponent />}
                                expandableRows
                                highlightOnHover
                                pagination
                                paginationComponentOptions={paginationOptions}
                            />
                        </Tab>

                        <Tab eventKey={2} title="Agregar compras" className="form-tab">
                            <Form onSubmit={this.HandleSubmitNewPurchase}>
                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Fecha de la compra</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Selecciona el artículo comprado</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="25/01/1998" id="date" name="date" type="date" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Control as="select" id="item_id" name="item_id">
                                            { items.map(this.renderItem) }
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row className="label-row">
                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa la cantidad</Form.Label>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>Descripción de la compra</Form.Label>
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="4" id="item_qty" name="item_qty" type="text" />
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Control as="input" placeholder="Compra de tres pañaleras en el local XXXXX." id="description" name="description" type="text" />
                                    </Form.Group>
                                </Form.Row>

                                <center><Button type="submit">Enviar datos</Button></center>
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

export default PurchasesManagement;
