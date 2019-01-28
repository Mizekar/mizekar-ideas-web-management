import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import {Container} from 'reactstrap';

import {
    AppAside,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import {setUser,emptyUser} from "../../actions/action.user";
import {connect} from "react-redux";
import {get, postMain} from "../../utils/apiRequest"

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));



class DefaultLayout extends Component {

    loading = () => <div className="animated fadeIn pt-1 text-center">در حال بارگذاری ...</div>


    constructor(props) {
        super(props)
    }
    componentDidMount() {
        if(this.props.user.apiToken==='')
        {
            this.props.history.push('/login')
        }
       //console.log(routes)
       //this.getCategories();
    }

 /*   async getCategories()
    {
        let response1=await postMain("v1/ideas/Categories", {
            "displayOrder": 0,
            "name": "string",
            "description": "string",
            "isPublished": true

        },this.props.user.apiToken)

        console.log(response1)
        let response = await get("v1/ideas/Categories", this.props.user.apiToken)

        console.log(response)
    }*/

    signOut(e) {
        e.preventDefault()
        this.props.emptyUser()
        this.props.history.push('/login')
    }

    render() {
        //console.log(routes)
        return (
            <div className="app">
                <AppHeader fixed>
                    <Suspense fallback={this.loading()}>
                        <DefaultHeader onLogout={e => this.signOut(e)}/>
                    </Suspense>
                </AppHeader>
                <div className="app-body">
                    <AppSidebar fixed display="lg">
                        <AppSidebarHeader/>
                        <AppSidebarForm/>
                        <Suspense>
                            <AppSidebarNav navConfig={navigation} {...this.props} />
                        </Suspense>
                        <AppSidebarFooter/>
                        <AppSidebarMinimizer/>
                    </AppSidebar>
                    <main className="main">
                        {/*<AppBreadcrumb appRoutes={routes}/>*/}
                        <Container fluid>
                            <Suspense fallback={this.loading()}>
                                <Switch>
                                    {routes.map((route, idx) => {
                                        //console.log(route.path)
                                        return route.component ? (
                                            <Route
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                render={props => (
                                                    <route.component {...props} />
                                                )}/>
                                        ) : (null);
                                    })}
                                    <Redirect from="/" to="/dashboard"/>
                                </Switch>
                            </Suspense>
                        </Container>
                    </main>
                    <AppAside fixed>
                        <Suspense fallback={this.loading()}>
                            <DefaultAside/>
                        </Suspense>
                    </AppAside>
                </div>
                <AppFooter>
                    <Suspense fallback={this.loading()}>
                        <DefaultFooter/>
                    </Suspense>
                </AppFooter>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setUser: (info) => {
            dispatch(setUser(info));
        },
        emptyUser: () => {
            dispatch(emptyUser());
        }
    };
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};


export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultLayout));

