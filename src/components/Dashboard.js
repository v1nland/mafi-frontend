import React, { Component } from 'react';
import '../css/dashboard.css';

class Dashboard extends Component {
    constructor(props, context){
        super(props, context);

        this.URL = "https://mafi-backend.herokuapp.com";

        this.state = {
            boxData: [],
            box: {
                income: 0,
                inverted: 0,
                box_money: 0
            },
            orders: [],
            order: {
                id: 0,
                buyer: '',
                product_description: '',
                contact: 0,
                date: '0000-00-00',
                item_id: 0,
                total_price: 1000,
                source: 0,
                location: '',
                finished: 0
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
            },
            mostSoldItems: [],
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
        this.getPendingOrders();
        this.getItems();
        this.getMostSoldItem();
        this.getBoxMoney();
        this.getSalesBySource();
    }

    getPendingOrders = _ => {
        fetch(this.URL+`/orders/pending`)
        .then(response => response.json())
        .then(resp => this.setState({ orders: resp.data }))
        .catch(err => console.error(err))
    }

    getItems = _ => {
        fetch(this.URL+`/items`)
        .then(response => response.json())
        .then(resp => this.setState({ items: resp.data }))
        .catch(err => console.error(err))
    }

    getMostSoldItem = _ => {
        fetch(this.URL+`/items/mostSold`)
        .then(response => response.json())
        .then(resp => this.setState({ mostSoldItems: resp.data }))
        .catch(err => console.error(err))
    }

    getBoxMoney = _ => {
        fetch(this.URL+`/stats/box`)
        .then(response => response.json())
        .then(resp => this.setState({ boxData: resp.data }))
        .catch(err => console.error(err))
    }

    getSalesBySource = _ => {
        fetch(this.URL+`/stats/salesBySource`)
        .then(response => response.json())
        .then(resp => this.setState({ facebookSales: resp.data[0].quantity, instagramSales: resp.data[1].quantity}))
        .catch(err => console.error(err))
    }

    numberWithDots = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

    renderOrder = ({id, buyer, date, product_description, contact, total_price, source, finished}) => <tr key={id}><td>{buyer.toUpperCase()}</td><td>{date}</td><td>{"+569"+contact}</td><td>{"$"+this.numberWithDots(total_price)}</td><td><img src={"https://mafi-backend.herokuapp.com/img?image=" + source} alt={!source?"Instagram":"Facebook"}/></td><td><img src={ "https://mafi-backend.herokuapp.com/img?image=" + finished } alt={!finished?"¡Entregado!":"Por entregar"}/></td></tr>
    renderItem = ({id, description, times_bought, times_sold, type, color, price} ) => <tr key={id}><td>{id}</td><td>{times_bought}</td><td>{times_sold}</td><td><img src={ this.URL+"/img?image=" + type } alt={type}/></td> <td>{color}</td><td>{"$"+this.numberWithDots(price)}</td></tr>
    renderMostSold = ({id, description, type, color, timesSold} ) => <div className="row" style={{background: 'white'}} key={id}><div className="col-"><img className="most-sold-img" src={ this.URL+"/img?image=" + type } alt={type}/></div> <div className="col" style={{color: 'black'}}><dl><br/ ><dt>Descripción</dt> <dd>{description}</dd><dt>Color</dt> <dd>{color}</dd> <dt>Veces vendido</dt> <dd>{timesSold}</dd></dl></div> </div>
    renderTotalValue = ({income, inverted, box_money}) => <div key={1}>${this.numberWithDots(box_money)}</div>

    render() {
        const { orders, order } = this.state;
        const { items, item } = this.state;
        const { mostSoldItems, mostSoldItem } = this.state;
        const { boxData, box } = this.state;

        return (
            !(orders.length || items.length) ? (
                <span>Loading...</span>
            ) : (
                <div>
                    <div className="page-title">
                        <h1>Escritorio</h1>
                        <hr />
                    </div>

                    <div className="blocks-container">
                        <div className="row">
                            <div className="col">
                                <div className="info-block">
                                    <div className="block-title">Pedidos pendientes</div>

                                    <div className="block-body">
                                        {
                                            (orders && orders.length)?
                                                <table className="table table-sm table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Nombre</th>
                                                            <th scope="col">Fecha</th>
                                                            <th scope="col">Contacto</th>
                                                            <th scope="col">Precio</th>
                                                            <th scope="col">Fuente</th>
                                                            <th scope="col">Estado</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {
                                                            orders.map(this.renderOrder)
                                                        }
                                                    </tbody>
                                                </table>
                                                :
                                                <h4> <hr className="box-hr"/>No hay pedidos que mostrar</h4>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="col">
                                <div className="info-block">
                                    <div className="block-title">Producto más vendido</div>

                                    <div className="block-body">
                                        {
                                            mostSoldItems.map(this.renderMostSold)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                        <br />


                        <div className="row">
                            <div className="col">
                                <div className="info-block">
                                    <div className="block-title">Fuentes de venta</div>

                                    <div className="block-body">
                                        <h2> <hr className="box-hr"/> { this.state.facebookSales } ventas a través de Facebook.</h2>
                                        <h2> { this.state.instagramSales } ventas a través de Instagram.</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col">
                                <div className="info-block">
                                    <div className="block-title">Ganancia total</div>

                                    <div className="block-body">
                                        <h2> <hr className="box-hr"/>
                                            <div>{ boxData.map(this.renderTotalValue) }</div>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    }
}

export default Dashboard;
