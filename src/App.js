import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DatabaseManagement from './components/DatabaseManagement';
import OrderManagement from './components/OrderManagement';
import PurchasesManagement from './components/PurchasesManagement';
import InventoryManagement from './components/InventoryManagement';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    < Navigation />

                    <div className="page-wrapper">
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/Dashboard" component={Dashboard} />
                        <Route path="/DatabaseManagement" component={DatabaseManagement} />
                        <Route path="/OrderManagement" component={OrderManagement} />
                        <Route path="/PurchasesManagement" component={PurchasesManagement} />
                        <Route path="/InventoryManagement" component={InventoryManagement} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
