import React from 'react';
import { ruleRunner, run } from "../../../utils/ruleRunner";
import { required, email } from "../../../utils/rules";
import AppContext from "../../../context/app-context";
import AuthenticationApi from "../api/authentication-api"
import Helper from "../../../utils/helper"
import update from "immutability-helper";
import './authentication-css.css';
import ResetPasswordFirstStepModal from './reset-password-first-step-modal'

import { Form, Divider, Breadcrumb, Input, Label, Checkbox, Button } from 'semantic-ui-react'


export default class Login extends React.Component {
    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("email", 'email', required, email),
        ruleRunner("password", 'password', required),
    ];
    constructor(props) {
        super(props);
        this.authenticationApi = new AuthenticationApi(this);
        this.resetPasswordFirstStepModalRef = React.createRef();
        let userType = props.location.state ?
            props.location.state.type === 'provider' ? 'provider' : 'user' : 'user'
        //props ? props.type === 'provider' ? 'provider' : 'user' : 'user';

        this.state = {
            validationErrors: {},
            showErrors: false,
            userType: userType,
            loading: false,
            loginForm: {
                email: '',
                password: ''
            }
        }

    }

    componentDidMount() {
        this.validateState()
    }

    validateState = () => {
        this.setState({ validationErrors: run(this.state.loginForm, this.fieldValidations) });
    };


    handleFieldChanged = (field, type = "") => {
        return (e, data) => {
            let value = type === "number" ? parseFloat(data.value) :
                type === "check" ? data.checked : data.value;
            if (type === "number") {
                if (value <= 0) {
                    value = 1
                }
            }
            let documentType = this.state.documentType

            this.setState({
                loginForm: update(this.state.loginForm, {
                    [field]: {
                        $set: value
                    }
                }), documentType: documentType
            }, this.validateState)
        }

    };

    clicked = () => {
        window.location = window.location.origin
    };

    login = async () => {
        this.setState({ showErrors: true });

        if (!Helper.isEmpty(this.state.validationErrors)) return null;

        let { loginForm, userType } = this.state;

        this.setState({ loading: true })
        const loginResponse = userType === 'user' ? await this.authenticationApi.userLogin(loginForm)
            : await this.authenticationApi.providerLogin(loginForm)

        if (loginResponse.data) {
            let account = loginResponse.data
            if (account.redirect_url) {
                window.open(account.redirect_url)
            }
            localStorage.setItem('api_token', account.api_token)
            localStorage.setItem('name', account.name)
            localStorage.setItem('surname', account.surname)
            localStorage.setItem('user_type', userType)
            window.location.href = window.location.origin;

        } else {
            this.props.notify(true, loginResponse ? loginResponse.message
                ? loginResponse.message : 'Error, please try again!' : 'Error, please try again!')
        }
        this.setState({ loading: false })
    };

    switch = () => {
        let { userType } = this.state;
        let type = userType === 'user' ? 'provider' : 'user';

        this.setState({
            userType: type,
            loginForm: {
                email: '',
                password: ''
            }
        }, () => {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            this.validateState()
        })
    };

    registerPage = () => {
        this.props.history.push('/register')
    }

    showForgotPasswordModal = () => {
        this.resetPasswordFirstStepModalRef.current.show(this.state.userType);
    }

    switchAccountType = () => {
        let { userType } = this.state;
        let type = userType === 'user' ? 'provider' : 'user';
        this.setState({
            userType: type,
            loginForm: {
                email: '',
                password: ''
            }
        }, () => {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            this.validateState()
        })
    };

    render() {
        let { loginForm, userType, loading } = this.state;
        const emailError = this.context.errorFor(this.state, 'email', null, true);
        const passwordError = this.context.errorFor(this.state, 'password', null, true);


        return (
            <div className={'register-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`${userType === 'user' ? '??????????????????????????????' : '????????????????????????????????????'}`}</Breadcrumb.Section>
                </Breadcrumb>
                <div className={`${userType === 'user' ? 'user' : 'provider'} form-container`}>
                    <h1>{`${userType === 'user' ? '??????????????????????????????' : '????????????????????????????????????'}`}</h1>
                    <Form>
                        <div className='fields-section'>
                            <Form.Field required
                                error={!!emailError}>
                                <Label>?????????????????????</Label>
                                <Input
                                    placeholder={'Sampke-email/@gmail.com'}
                                    value={loginForm.email ? loginForm.email : ''}
                                    onChange={this.handleFieldChanged("email")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!passwordError}>
                                <Label>???????????????</Label>
                                <Input
                                    type={'password'}
                                    placeholder={'10???20????????????????????????'}
                                    value={loginForm.password ? loginForm.password : ''}
                                    onChange={this.handleFieldChanged("password")}
                                />
                            </Form.Field>
                            <div className='forget-password-section'>
                                <a onClick={() => this.showForgotPasswordModal()}>???????????????????????????</a>
                            </div>
                            <div className='action-section'>
                                <Button loading={loading}
                                    onClick={() => this.login()}>
                                    ????????????
                                </Button>
                            </div>
                        </div>
                        {
                            userType === 'user' ?
                                <div className='login-options'>
                                    <p>???????????????????????????????????????</p>
                                    <img src={'/images/main-images/apple.svg'} />
                                    <img src={'/images/main-images/twitter.svg'} />
                                    <img src={'/images/main-images/google.svg'} />
                                    <img src={'/images/main-images/facebook.svg'} />
                                </div>
                                : null
                        }
                    </Form>
                </div>
                <div className='switch-section'>
                    <div className='switch-register'>
                        <h1>?????????????????????????????????????????????</h1>
                        <Button onClick={() => this.registerPage()}>
                            ????????????????????????
                        </Button>
                    </div>
                    <div className='switch-login'>
                        <h1>{`${userType === 'user' ? '??????????????????????????????????????????' : '????????????????????????????????????'}`}</h1>
                        <Button onClick={() => this.switchAccountType()}>
                            {`${userType === 'user' ? '????????????????????????????????????' : '??????????????????????????????'}`}
                        </Button>
                    </div>
                </div>
                <ResetPasswordFirstStepModal ref={this.resetPasswordFirstStepModalRef}
                    props={this} />
            </div>
        );
    }


}