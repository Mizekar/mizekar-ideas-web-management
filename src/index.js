import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import dashboard from "./reducers/dashboard.reducer";
import user from "./reducers/user.reducer";
//import * as api from "./utils/apiRequest.js";
import {BrowserRouter} from "react-router-dom";
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import {PersistGate} from 'redux-persist/integration/react'

const rootReducer = combineReducers({
    user,
    dashboard
});

const persistConfig = {
    key: 'root',
    storage,
    blacklist: []
}
const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(
    persistedReducer,
    undefined,
    compose(
        applyMiddleware(...middleware)
    )
    /*applyMiddleware(
        thunk.withExtraArgument({
            api
        })
    )*/
);
let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </PersistGate>

    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
