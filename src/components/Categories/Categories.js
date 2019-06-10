import React, {Component} from 'react';

import List from './view/List'
import Add from './view/Add'
import Edit from './view/Edit'

class Categories extends Component {
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

        }


    }

}

export default Categories;