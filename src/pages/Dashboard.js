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

class Dashboard extends Component {
    constructor(props, context){
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.state = {
            FetchDone: false,
            Revenue: {
                income: 0,
                inverted: 0,
                box_money: 0
            },
            FacebookSales: 0,
            InstagramSales: 0,
            orders: [],
            mostSoldItem: {
                id: 0,
                description: '',
                type: '',
                color: '',
                timesSold: 0
            }
        };
    }

    componentDidMount(){
        this.FetchPendingOrders();
        this.FetchMostSoldItem();
        this.FetchBoxRevenue();
        this.FetchSalesBySource();
    }

    FetchPendingOrders = _ => {
        fetch(this.URL+`/orders/pending`)
        .then(response => response.json())
        .then(resp => this.setState({ orders: resp.data, FetchDone: true }))
        .catch(err => console.error(err))
    }

    FetchMostSoldItem = _ => {
        fetch(this.URL+`/items/mostSold`)
        .then(response => response.json())
        .then(resp => this.setState({ mostSoldItem: resp.data[0] }))
        .catch(err => console.error(err))
    }

    FetchBoxRevenue = _ => {
        fetch(this.URL+`/stats/box`)
        .then(response => response.json())
        .then(resp => this.setState({ Revenue: resp.data[0] }))
        .catch(err => console.error(err))
    }

    FetchSalesBySource = _ => {
        fetch(this.URL+`/stats/salesBySource`)
        .then(response => response.json())
        .then(resp => this.setState({ FacebookSales: resp.data[0].quantity, InstagramSales: resp.data[1].quantity }))
        .catch(err => console.error(err))
    }

    numberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    render() {
        return (
            (this.state.FetchDone === false) ? (
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
                                    count={this.state.orders.length.toString()}
                                    headerText="Pedidos pendientes"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="danger"
                                    icon=<FontAwesomeIcon icon={faLaptop} size="3x" />
                                    count={this.state.FacebookSales.toString()}
                                    headerText="Ventas Facebook"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="success"
                                    icon=<FontAwesomeIcon icon={faMobileAlt} size="3x" />
                                    count={this.state.InstagramSales.toString()}
                                    headerText="Ventas Instagram"
                                    footerText="Ver detalles"
                                    linkTo="/#/OrderManagement"
                                />

                                <StatWidget
                                    color="warning"
                                    icon=<FontAwesomeIcon icon={faArchive} size="3x" />
                                    count={"$"+this.numberWithDots(this.state.Revenue.box_money)}
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
                                        title={this.state.mostSoldItem.description}
                                        source={"Vendido "+this.state.mostSoldItem.timesSold +" veces"}
                                        body={"El producto "+this.state.mostSoldItem.description+" (id "+this.state.mostSoldItem.id+") es el más popular, habiéndose vendido "+ this.state.mostSoldItem.timesSold+ " veces."}
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
