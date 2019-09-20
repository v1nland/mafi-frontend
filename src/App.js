import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import PurchasesManagement from './pages/PurchasesManagement';
import InventoryManagement from './pages/InventoryManagement';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className="App">
                    < Navigation />

                    <div className="page-wrapper">
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/OrderManagement" component={OrderManagement} />
                        <Route exact path="/PurchasesManagement" component={PurchasesManagement} />
                        <Route exact path="/InventoryManagement" component={InventoryManagement} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;
