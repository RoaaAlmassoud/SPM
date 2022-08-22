import React from 'react';
import { Button, Form, Modal, TextArea } from 'semantic-ui-react'
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import { ruleRunner, run } from "../../../utils/ruleRunner";
import { required, email } from "../../../utils/rules";
import AppContext from "../../../context/app-context";
import update from "immutability-helper";
import Helper from "../../../utils/helper";
import AuthenticationApi from '../api/authentication-api'

export default class ResetPasswordFirstStepModal extends React.Component {
    static contextType = AppContext;
    fieldsValidations = [
        ruleRunner("email", 'email', required, required),
    ]

    constructor(props) {
        super(props);
        this.authenticationApi = new AuthenticationApi(this);
        let type = props.type ? props.type : 'user';
        this.state = {
            open: false,
            validationErrors: {},
            showErrors: false,
            loaded: false,
            type: type,
            userForm: {
                email: ""
            },
        }
    }

    validateState = () => {
        this.setState({
            validationErrors: run(this.state.userForm, this.fieldsValidations)
        });

    };

    componentDidMount() {
        this.validateState()
    }

    handleFieldChange = (field) => {
        return (e, data) => {
            this.setState({
                userForm: update(this.state.userForm, {
                    [field]: {
                        $set: data.value
                    }
                }),
            }, this.validateState);
        }
    };

    forgotPassword = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;
        let { userForm, type } = this.state;
        let body = { email: userForm.email };
        this.setState({ loaded: true });
        const forgotResponse = type === 'user' ?
            await this.authenticationApi.userResetPasswordFirstStep(body) : await this.authenticationApi.providerResetPasswordFirstStep(body);
        this.setState({ loaded: false });
        if (forgotResponse.data) {  
        } else {
            this.props.props.props.notify(true, forgotResponse.message ? forgotResponse.message : 'Error! please try again!')
        }
    };

    show = (type) => {
        this.setState({
            open: true,
            type: type
        })
    };

    hide = () => {
        this.setState({
            open: false,
            userForm: {
                email: ''
            }
        })
    };

    render() {
        let { loaded, userForm } = this.state;
        const emailError = this.context.errorFor(this.state, 'email', null, true);
        return (
            <Modal
                className={'reset-password-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='close-section'>
                        <img src='/images/main-images/close-grey.svg'
                            onClick={() => this.hide()}
                        />
                    </div>
                    <div className='header-section'>
                        <p className={'header-text'}>ご登録のメールアドレスに、</p>
                        <p className={'header-text'}>パスワードリセット用のURLをお送りします。</p>
                    </div>
                    <Form onSubmit={() => this.forgotPassword()}>
                        <Form.Field required error={!!emailError}>
                            <label>メールアドレス</label>
                            <Input placeholder={'Sampke-email/@gmail.com'}
                                value={userForm.email ? userForm.email : ""}
                                onChange={this.handleFieldChange('email')}
                            />
                        </Form.Field>
                    </Form>
                    <div className={'action-section'}>
                        <Button loading={loaded}
                            onClick={() => this.forgotPassword()}>
                            URLを送信
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}