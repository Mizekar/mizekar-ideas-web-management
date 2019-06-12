import React from 'react';
import {Modal, ModalHeader, ModalBody, Alert} from 'reactstrap';

export default class ModalAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            title: props.title,
            message: props.message,
            icon: props.icon,
            type: props.type
        };

      this.onDismiss = this.onDismiss.bind(this);

    }

    componentDidMount() {
        setTimeout(() => {
        this.setState({
          modal: false

        })
      }, 2000)


    }
  onDismiss() {
    this.setState({ modal: false });
  }

    /*render() {
        return (

            <Modal isOpen={this.state.modal} >
                <ModalHeader toggle={this.toggle} className={"bg-"+this.state.type}>
                    <i className={this.state.icon} />
                    &nbsp;
                    {this.state.title}
                </ModalHeader>
                <ModalBody>
                    {this.state.message}
                </ModalBody>
            </Modal>

        );
    }*/

    render() {
      return(
        <Alert color={this.state.type} isOpen={this.state.modal} toggle={this.onDismiss} className="alert-position">
          {this.state.message}
        </Alert>
      )
    }
}
