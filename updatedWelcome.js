import React, { Component } from 'react';
import { Card, CardHeader, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import LightBulbIcon from 'material-ui/svg-icons/action/lightbulb-outline';
import HomeIcon from 'material-ui/svg-icons/action/home';
import CodeIcon from 'material-ui/svg-icons/action/code';
import FlatButton from 'material-ui/FlatButton';

class Welcome extends Component {
    state = {
        orders: [],
        order: {
            name: 'sample order',
            ordered_product: 'muchisisisimas mochilas',
            phone: 87654321
        }
    }

    componentDidMount(){
        this.getOrders();
    }

    getOrders = _ => {
        fetch('http://localhost:4000/orders')
            .then(response => response.json())
            .then(response => this.setState({ orders: response.data }))
            .catch(err => console.error(err))

        // fetch('http://localhost:4000/orders')
        //     .then(function(response) {
        //         return response.json();
        //     })
        //     .then(function(myJson) {
        //         console.log(myJson);
        //     });
        // return fetch('http://localhost:4000/orders')
        // .then(response => {
        //     return response.json();
        // })
        // .catch((error) => {
        //     console.log(error);
        // })
    }

    addOrder = _ => {
        const { order } = this.state;

        fetch(`http://localhost:4000/orders/add?name=${order.name}&ordered_product=${order.ordered_product}&phone=${order.phone}`)
            .then(this.getOrders)
            .catch(err => console.error(err))
    }

    renderOrder = ({id, name, ordered_product, phone}) => <div key={id}>{name} : {ordered_product} : {phone}</div>

    render(){
        const { style } = this.props;
        const { orders, order } = this.state;

        return(
            <Card style={style}>
                { orders.map(this.renderOrder) }

                <div>
                    <input value={order.name} onChange = {e => this.setState({order: { ...order, name: e.target.value }})}/>
                    <input value={order.ordered_product} onChange={e => this.setState({order: { ...order, ordered_product: e.target.value }})} />
                    <input value={order.phone} onChange={e => this.setState({order: { ...order, phone: e.target.value }})} />

                    <button onClick={this.addOrder}>Add Order</button>
                </div>

                <CardHeader
                    title={'pos.dashboard.welcome.title'}
                    subtitle={ 'subtitle' }
                    avatar={<Avatar backgroundColor="#FFEB3B" icon={<LightBulbIcon />} />}
                />

                <CardActions style={{ textAlign: 'right' }}>
                    <FlatButton label={'pos.dashboard.welcome.aor_button'} icon={<HomeIcon />} href="https://marmelab.com/admin-on-rest/" />
                    <FlatButton label={'pos.dashboard.welcome.demo_button'} icon={<CodeIcon />} href="https://github.com/marmelab/admin-on-rest-demo" />
                </CardActions>
            </Card>
        );
    }
}

export default Welcome;
