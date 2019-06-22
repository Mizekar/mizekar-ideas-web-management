import React, {Component} from 'react';

import List from './view/List'
import Add from './view/Add'
import Edit from './view/Edit'
import Detail from './view/Detail'
import Upload from './view/Upload';
import Assessment from "./view/Assessment";

export default class Ideas extends Component {
    constructor(props) {
        super(props);

        let params = this.props.match.params;

        //alert(params.act)



        this.state = {
            act: params.act !== undefined ? params.act : '',
            id: params.id !== undefined ? params.id : ''
        }

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        let params = nextProps.match.params
        this.setState({
                act: params.act !== undefined ? params.act : '',
                id: params.id !== undefined ? params.id : ''
            }
        )
    }


    render() {
        const {act, id} = this.state

        switch (act) {
            case '':
                return (
                    <List/>
                );
                break;
            case 'add':
                return (
                    <Add/>
                )
            case 'edit':
                return (
                    <Edit id={id}/>
                )
            case 'detail':
                return (
                    <Detail id={id}/>
                )
            case 'upload':
                return (
                    <Upload id={id}/>
                )
          case 'assessment':
            return (
              <Assessment id={id} history={this.props.history}/>
            )

        }


    }

}
