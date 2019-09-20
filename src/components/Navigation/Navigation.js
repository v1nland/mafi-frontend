import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCat, faTachometerAlt, faCalendar, faBriefcase, faCreditCard } from '@fortawesome/free-solid-svg-icons';

class Navigation extends Component{
    render(){
        return(
            <div className="nav-side-menu">
                <div className="brand">
                    <FontAwesomeIcon icon={faCat} fixedWidth /> Mafi Mochilas &nbsp; &nbsp; &nbsp;
                </div>

                <FontAwesomeIcon className='toggle-btn' icon={faBars} fixedWidth data-toggle="collapse" data-target="#menu-content" />

                <div className="menu-list">
                    <ul id="menu-content" className="menu-content collapse out">
                        <li>
                            <Link to="/">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faTachometerAlt} fixedWidth /> Escritorio
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/OrderManagement">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faCalendar} fixedWidth /> Gestión de pedidos
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/InventoryManagement">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faBriefcase} fixedWidth /> Gestión de inventario
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/PurchasesManagement">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faCreditCard} fixedWidth /> Gestión de compras
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Navigation;
