import React, {Component} from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';



const loading = () => <div className="animated fadeIn pt-3 text-center">در حال بارگذاری ...</div>;


// Containers
const DefaultLayout = Loadable({
    loader: () => import('./containers/DefaultLayout'),
    loading
});

// Pages
const Login = Loadable({
    loader: () => import('./views/Auth/Login'),
    loading
});
const Verify = Loadable({
    loader: () => import('./views/Auth/Verify'),
    loading
});

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            login: 1
        }
        //this.props.history.push('/login')
    }
    componentDidMount() {

    }

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login" name="Login" component={Login}/>
                    <Route path="/verify" name="Verify" component={Verify}/>
                    <Route exact={false} path="/" name="Home" component={DefaultLayout}/>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;
