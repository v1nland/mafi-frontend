import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBuilding, faTachometerAlt, faUser, faUsers, faTicketAlt, faCreditCard, faBalanceScale } from '@fortawesome/free-solid-svg-icons';

class Navigation extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {

        }
    }

    render(){
        return(
            <div className="nav-side-menu">
                <div className="brand">
                    <FontAwesomeIcon icon={faBuilding} fixedWidth /> Te administro &nbsp; &nbsp; &nbsp;
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
                            <Link to="/Profile">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faUser} fixedWidth /> Mi Perfil
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/Neighbors">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faUsers} fixedWidth /> Datos vecinos
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/SendTicket">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faTicketAlt} fixedWidth /> Enviar ticket
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/ViewTickets">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faTicketAlt} fixedWidth /> Ver tickets
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/UploadCommonExpenses">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faCreditCard} fixedWidth /> Subir gastos comunes
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/CommonExpensesBalance">
                                <div className="button-wrapper">
                                    <FontAwesomeIcon icon={faBalanceScale} fixedWidth /> Balance gastos comunes
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
