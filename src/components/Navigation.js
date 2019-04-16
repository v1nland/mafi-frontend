import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Navigation extends Component{
    render(){
        return(
            <div className="nav-side-menu">
                <div className="brand"><img src="https://mafi-backend.herokuapp.com/img?image=MAFI_LOGO" alt="Mafi Mochilas"/>Mafi Mochilas&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

                <div className="menu-list">
                    <ul id="menu-content" className="menu-content collapse out">
                        <li>
                            <Link to="/Dashboard">
                                <div className="button-wrapper">
                                    <i className="fa fa-book fa-fw"></i>Escritorio
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/OrderManagement">
                                <div className="button-wrapper">
                                    <i className="fa fa-calendar fa-fw"></i>Gestión de pedidos
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/InventoryManagement">
                                <div className="button-wrapper">
                                    <i className="fa fa-briefcase fa-fw"></i>Gestión de inventario
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/PurchasesManagement">
                                <div className="button-wrapper">
                                    <i className="fa fa-credit-card fa-fw"></i>Gestión de compras
                                </div>
                            </Link>
                        </li>

                        {/*<li>
                            <Link to="/DatabaseManagement">
                                <div className="button-wrapper">
                                    <i className="fa fa-database fa-lg"></i>Gestión de base de datos
                                </div>
                            </Link>
                        </li>*/}

                    </ul>
                </div>
            </div>
        )
    }
}

export default Navigation;
