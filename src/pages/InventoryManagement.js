import React, { Component } from 'react';
import { Grid, Row, Col, Tab, Tabs, Modal, Table, Form, Button, ButtonGroup } from 'react-bootstrap';
import DataTable, { defaultThemes }  from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';

import { FetchItemsStock, FetchOrders, InsertItem } from '../functions/Database'
import { NumberWithDots, FormatDate, FormatDiscount } from '../functions/Helper'

class InventoryManagement extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            fetchDone: false,
            newProductSubmitted: false,
            showModal: false,
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

    HandleSubmitNewProduct = (event) => {
        event.preventDefault();
        const et = event.target;

        for (var i = 0; i < et.length - 1; i++) {
            if (et[i].value == ''){
                this.AlertsHandler.generate('danger', '¡Error!', 'Faltan datos por ingresar.');
                return
            }
        }

        let jsonData = {
            "description": et[0].value,
            "type": et[1].value,
            "color": et[2].value,
            "purchase_price": parseInt(et[3].value, 10),
            "sell_price": parseInt(et[4].value, 10)
        }

        InsertItem( jsonData )
        .then(r => {
            if ( r.Status == 200 ) {
                this.AlertsHandler.generate('success', '¡Éxito!', 'Datos enviados correctamente al sistema.');
            }else{
                this.AlertsHandler.generate('danger', '¡Error!', 'Los datos no fueron ingresados al sistema.');
            }
        })
    }

    componentDidMount(){
        this.RefreshItemsStock()
    }

    RefreshItemsStock(){
        FetchItemsStock()
        .then(response => {
            for (var i = 0; i < response.Data.length; i++) {
                var current_id = response.Data[i]['id']
                var current_value = response.Data[i]['finished']

                response.Data[i]['sell_price'] = '$'+NumberWithDots( response.Data[i]['sell_price'] )
                response.Data[i]['stock'] = response.Data[i]['times_bought']-response.Data[i]['times_sold']
                response.Data[i]['acciones'] = <ButtonGroup> <Button size="sm" variant="primary" id={current_id} onClick={this.HandleEditModalData}><FontAwesomeIcon icon={faPencilAlt} /></Button></ButtonGroup>
            }

            return response
        })
        .then(res => {
            this.setState({ items: res.Data, fetchDone: true }, () => console.log(res) )
        })
    }

    render() {
        const { items } = this.state;

        const paginationOptions = { rowsPerPageText: 'Filas por página', rangeSeparatorText: 'de' };

        const columns = [
            {
                name: '#',
                selector: 'id',
                sortable: true,
                center: true,
                width: '60px'
            },
            {
                name: 'Producto',
                selector: 'description',
                center: true
            },
            {
                name: 'Stock',
                selector: 'stock',
                center: true,
                width: '90px'
            },
            {
                name: 'Tipo',
                selector: 'type',
                center: true,
                width: '150px'
            },
            {
                name: 'Precio',
                selector: 'sell_price',
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
                    Producto comprado {data.times_bought} veces.
                </li>
                <li className="li-triangle">
                    Producto vendido {data.times_sold} veces.
                </li>
                <li className="li-triangle">
                    Stock restante del producto {data.stock}
                </li>
            </ol>
          </div>
        );

        const conditionalRowStyles = [
            {
                when: row => !row.stock,
                style: {
                    backgroundColor: '#bb2124',
                    color: 'white',
                    '&:hover': {
                        cursor: 'pointer',
                    },
                },
            }
        ];

        return (
            !(this.state.fetchDone) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <AlertsHandler onRef={ref => (this.AlertsHandler = ref)} />
                    <PageTitle text="Gestión de inventario" />

                    <Tabs defaultActiveKey={1} id="uncontrolled-tab">
                        <Tab eventKey={1} title="Ver productos">
                            <DataTable
                                title="Lista de productos"
                                columns={columns}
                                data={items}
                                expandableRowsComponent={<ExpandedComponent />}
                                expandableRows
                                highlightOnHover
                                pagination
                                paginationComponentOptions={paginationOptions}
                                conditionalRowStyles={conditionalRowStyles}
                            />
                        </Tab>

                        <Tab eventKey={2} title="Agregar productos" className="form-tab">
                                <Form onSubmit={this.HandleSubmitNewProduct}>
                                    <Form.Row className="label-row">
                                        <Form.Group as={Col}>
                                            <Form.Label>Descripción del producto</Form.Label>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control as="input" placeholder="Mochila Kanken Rojo" id="description" name="description" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row className="label-row">
                                        <Form.Group as={Col}>
                                            <Form.Label>Tipo de producto</Form.Label>
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Color primario</Form.Label>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control as="select" id="type" name="type">
                                                <optgroup label="Tipos">
                                                    <option>Mochila</option>
                                                    <option>Funda de Notebook</option>
                                                    <option>Estuche</option>
                                                    <option>Calcetines</option>
                                                    <option>Totebag</option>
                                                    <option>Lonchera</option>
                                                    <option>Scrunchy</option>
                                                    <option>Otro</option>
                                                </optgroup>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control as="select" id="color" name="color">
                                                <optgroup label="Colores">
                                                    <option>Amarillo</option>
                                                    <option>Azul</option>
                                                    <option>Café</option>
                                                    <option>Dorado</option>
                                                    <option>Morado</option>
                                                    <option>Negro</option>
                                                    <option>Plateado</option>
                                                    <option>Rojo</option>
                                                    <option>Rosado</option>
                                                    <option>Verde</option>
                                                </optgroup>
                                                <optgroup label="Múltiples colores">
                                                    <option>Blanco y celeste</option>
                                                    <option>Blanco y negro</option>
                                                    <option>Blanco y rojo</option>
                                                </optgroup>
                                                <optgroup label="Especiales">
                                                    <option>Surtido</option>
                                                    <option>N/A</option>
                                                </optgroup>
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row className="label-row">
                                        <Form.Group as={Col}>
                                            <Form.Label>Indica el precio de compra</Form.Label>
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Label>Indica el precio de venta</Form.Label>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control as="input" placeholder="5500" id="purchase_price" name="purchase_price" type="text" />
                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            <Form.Control as="input" placeholder="11000" id="sell_price" name="sell_price" type="text" />
                                        </Form.Group>
                                    </Form.Row>

                                    <center><Button type="submit">Enviar datos</Button></center>
                                </Form>
                        </Tab>
                    </Tabs>

                    <br />
                </div>
            )
        );
    }
}

export default InventoryManagement;
