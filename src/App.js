import React, {Component} from 'react';
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
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
    loader: () => import('./components/Auth/Login'),
    loading
});
const Verify = Loadable({
    loader: () => import('./components/Auth/Verify'),
    loading
});
const Register = Loadable({
    loader: () => import('./components/Auth/Register'),
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
            <BrowserRouter>
                <Switch>
                    <Route path="/login" name="Login" component={Login}/>
                    <Route path="/verify" name="Verify" component={Verify}/>
                    <Route path="/register" name="Register" component={Register}/>
                    <Route exact={false} path="/" name="Home" component={DefaultLayout}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
