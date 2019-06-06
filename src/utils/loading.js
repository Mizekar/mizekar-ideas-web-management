import React from 'react';
import { HashLoader} from 'react-spinners';



const override = `
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    render() {
        return (
            <div className='sweet-loading' >
                <HashLoader
                    css={override}
                    sizeUnit={"px"}
                    size={30}
                    color={this.props.color?this.props.color:'#b4f4a4'}
                    loading={this.state.loading}
                />
            </div>
        )
    }
}
