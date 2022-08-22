import React, { Component } from "react"
import MainLayout from './components/main-layout/main-layout'
import TopPage from './components/top-page/src/top-page'
import ServiceDetails from './components/service-details-component/src/service-details'
import Register from './components/authentication-component/src/register'
import Login from './components/authentication-component/src/login'
import Inquiry from "./components/authentication-component/src/inquiry"
import PageTabs from './components/my-page-component/src/page-tabs'
import VerifyAccount from "./components/authentication-component/src/verify-account"
import PrivacyPolicy from './components/static-pages/privacy-policy'
import Terms from './components/static-pages/terms'
import OperatingCompany from './components/static-pages/operating-company'
import About from './components/static-pages/about'
import Logout from './components/authentication-component/src/logout'
import OperationCompleted from "./components/service-details-component/src/operation-completed"
import RegistrationCompleted from "./components/authentication-component/src/registraion-completed"
import DeleteCompleted from "./components/my-page-component/src/delete-completed"
//import Logout from './components/logout/logout'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppContext from './context/app-context';
import Helper from '../src/utils/helper'
import { css } from 'glamor';
import { toast, ToastContainer } from 'react-toastify';
import { Icon, Label } from 'semantic-ui-react'

export default class App extends Component {
    constructor(props) {

        super(props);
        this.pathName = window.location.pathname;
        this.state = {
            errorFor: this.errorFor
        }
    }


    notify = (error, message, duration = 5000) =>
        (message) ? toast(
            error ?
                <div><Icon size="large" name='warning' /> {message}</div>
                : <div><Icon link name='check' /> {message}</div>,
            {
                autoClose: duration,
                className: css({
                    padding: '10px',
                    color: error ? '#912d2b !important' : 'teal !important',
                }),
                progressClassName: css({
                    background: error ? '#912d2b !important' : 'teal !important',
                }),
                // This position to determine where should the toast appear . (default top right)
                position: toast.POSITION.TOP_RIGHT,
            }) : null;

    errorFor = (state, field, component, direction) => {
        let { isMobile, screenSize } = this.state;
        if (component === 'login' || component === 'register') {
            isMobile = screenSize <= 990;
        }

        let hide = state.validationErrors[field] ? state.validationErrors[field].includes('required') : false;
        if (state.validationErrors[field] && state.showErrors) {
            return <div className={`error-section ${state.serverError && !hide ? '' : 'invisible'}`}>
                <Label
                    basic color='red' pointing={direction || isMobile ? `above` : 'right'}>
                    {state.validationErrors[field]}
                </Label>
            </div>
        }
        return null
    }


    render() {
        return (
            <BrowserRouter>
                <AppContext.Provider value={this.state}>
                    <MainLayout props={this} notify={this.notify} key={Helper.unique()}>
                        <Switch>

                            <Route exact path="/my-page/:tab?"
                                render={(props) => {
                                    if (localStorage.getItem('api_token')) {
                                        return <PageTabs notify={this.notify} {...props} />
                                    } else {
                                        return <TopPage notify={this.notify} {...props} />
                                    }
                                }
                                } />

                            <Route exact path="/service-completed"
                                render={(props) =>
                                    <OperationCompleted notify={this.notify} {...props} />} />


                            <Route exact path="/registration-completed"
                                render={(props) =>
                                    <RegistrationCompleted notify={this.notify} {...props} />} />

                            <Route exact path="/delete-completed"
                                render={(props) =>
                                    <DeleteCompleted notify={this.notify} {...props} />} />

                            <Route exact path="/"
                                render={(props) => <TopPage notify={this.notify} {...props} />} />

                            <Route exact path="/register"
                                render={(props) => <Register notify={this.notify} {...props} />} />

                            <Route exact path="/login"
                                render={(props) => <Login notify={this.notify} {...props} />} />



                            <Route exact path="/privacy-policy"
                                render={(props) => <PrivacyPolicy notify={this.notify} {...props} />} />

                            <Route exact path="/terms"
                                render={(props) => <Terms notify={this.notify} {...props} />} />

                            <Route exact path="/operating-company"
                                render={(props) => <OperatingCompany notify={this.notify} {...props} />} />

                            <Route exact path="/about"
                                render={(props) => <About notify={this.notify} {...props} />} />

                            <Route exact path="/logout"
                                render={(props) => <Logout notify={this.notify} {...props} />} />

                            <Route exact path="/verify-provider"
                                render={(props) => <VerifyAccount notify={this.notify} {...props} />} />

                            <Route exact path="/verify-user"
                                render={(props) => <VerifyAccount notify={this.notify} {...props} />} />

                            <Route exact path="/inquiry"
                                render={(props) => <Inquiry notify={this.notify} {...props} />} />

                            <Route exact path="/:id"
                                render={(props) => <ServiceDetails notify={this.notify} {...props} />} />
                        </Switch>
                        <ToastContainer autoClose={5000} />
                    </MainLayout>
                </AppContext.Provider>
            </BrowserRouter>
        )
    }

}

