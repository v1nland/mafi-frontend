import React, { Component } from 'react';
import { AlertList } from 'react-bs-notifier';

class AlertsHandler extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            position: "top-right",
            timeout: 1500,
            errorMsg: "",
            alerts: []
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    generate(type, titulo, mensaje) {
        const newAlert ={
            id: (new Date()).getTime(),
            type: type,
            headline: `${titulo}`,
            message: `${mensaje}`
        };

        this.setState({
            alerts: [...this.state.alerts, newAlert]
        });
    }

    onAlertDismissed(alert) {
        const alerts = this.state.alerts;

        // find the index of the alert that was dismissed
        const idx = alerts.indexOf(alert);

        if (idx >= 0) {
            this.setState({
                // remove the alert from the array
                alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
    }

    clearAlerts() {
        this.setState({
            alerts: []
        });
    }

    onTimeoutChange({ target: { value } }) {
        this.setState({ timeout: (+value) * 1000 });
    }

    onNewMessageChange({ target: { value } }) {
        this.setState({ newMessage: value });
    }

    onPositionChange({ target: { value } }) {
        this.setState({
            position: value
        });
    }

    render(){
        return(
            <AlertList
                position={this.state.position}
                alerts={this.state.alerts}
                timeout={this.state.timeout}
                dismissTitle="Se ha ido!"
                onDismiss={this.onAlertDismissed.bind(this)}
            />
        )
    }
}
export default AlertsHandler;
