import React, { Component } from 'react';
import { Row, Col, Card, CardDeck, Dropdown, DropdownButton } from 'react-bootstrap';

import StatWidget from '../components/Widget/Widget';
import Donut from '../components/Donut/Donut';
import TimelineElement from '../components/Utility/TimelineElement';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLaptop, faMobileAlt, faArchive } from '@fortawesome/free-solid-svg-icons';

import CenteredSpinner from '../components/Utility/CenteredSpinner';
import PageTitle from '../components/Utility/PageTitle';
import AlertsHandler from '../components/Utility/AlertsHandler';
import { Tooltip, XAxis, YAxis, Area, CartesianGrid, AreaChart, Bar, BarChart, ResponsiveContainer } from '../vendor/recharts';

import { FetchPendingOrders, FetchMostSoldItem, FetchBox, FetchSources } from '../functions/Database'
import { NumberWithDots } from '../functions/Helper'

class Dashboard extends Component {
    constructor(props, context){
        super(props, context);

        this.state = {
            fetchDone: false,
            revenue: {
                Income: 0,
                Outcome: 0,
                Currency: 0
            },
            fbSales: 0,
            igSales: 0,
            orders: [],
        };
    }

    componentDidMount(){
        FetchPendingOrders().then(res => this.setState({ orders: res.Data, fetchDone: true }) )
        FetchMostSoldItem().then(res => this.setState({ mostSoldItem: res.Data[0] }))
        FetchBox().then(res => this.setState({ revenue: res.Data }))
        FetchSources().then(res => this.setState({ fbSales: res.Data[0].Quantity, igSales: res.Data[1].Quantity }))
    }

    render() {
        const { fetchDone } = this.state;
        const { revenue } = this.state;
        const { fbSales } = this.state;
        const { igSales } = this.state;
        const { orders } = this.state;
        const { mostSoldItem } = this.state;

        return (
            (fetchDone === false) ? (
                <CenteredSpinner />
            ) : (
                <div>
                    <PageTitle text="Escritorio" />

                    <Row>
                        <Col>
                            <CardDeck>
                                <StatWidget
                                    color="primary"
                                    icon=<FontAwesomeIcon icon={faCalendar} size="3x" />
                                    count={orders.length.toString()}
                                    headerText="Pedidos pendientes"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="danger"
                                    icon=<FontAwesomeIcon icon={faLaptop} size="3x" />
                                    count={fbSales.toString()}
                                    headerText="Ventas Facebook"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="success"
                                    icon=<FontAwesomeIcon icon={faMobileAlt} size="3x" />
                                    count={igSales.toString()}
                                    headerText="Ventas Instagram"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="warning"
                                    icon=<FontAwesomeIcon icon={faArchive} size="3x" />
                                    count={"$"+NumberWithDots(revenue.Currency)}
                                    headerText="Dinero en caja"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />
                            </CardDeck>
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>Línea de tiempo</Card.Header>

                                <div className="timeline">
                                    <TimelineElement
                                        inverted=""
                                        color="timeline-badge success"
                                        icon="fa fa-check"
                                        title={mostSoldItem.Description}
                                        source={"Vendido "+mostSoldItem.Times +" veces"}
                                        body={"El producto "+mostSoldItem.Description+" (id "+mostSoldItem.Id+") es el más popular, habiéndose vendido "+ mostSoldItem.Times+ " veces."}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        );
    }
}

export default Dashboard;
