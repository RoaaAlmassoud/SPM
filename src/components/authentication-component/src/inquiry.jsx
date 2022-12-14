import React from 'react';
import { ruleRunner, run } from "../../../utils/ruleRunner";
import { required, email } from "../../../utils/rules";
import AppContext from "../../../context/app-context";
import AuthenticationApi from "../api/authentication-api"
import Helper from "../../../utils/helper"
import update from "immutability-helper";
import './authentication-css.css';
import { Form, Breadcrumb, Input, Label, TextArea, Button } from 'semantic-ui-react'


export default class Inquiry extends React.Component {

    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("first_name", 'first_name', required),
        ruleRunner("last_name", 'last_name', required),
        ruleRunner("kana_first_name", 'kana_first_name', required),
        ruleRunner("kana_last_name", 'kana_last_name', required),
        ruleRunner("phone", 'phone', required),
        ruleRunner("email", 'email', required),
        ruleRunner("description", 'description', required),
        ruleRunner("company", 'company', required)
    ];

    constructor(props) {
        super(props);
        this.authenticationApi = new AuthenticationApi(this);

        this.state = {
            validationErrors: {},
            showErrors: false,
            loading: false,
            inquiryForm:
            {
                first_name: "",
                last_name: "",
                kana_first_name: "",
                kana_last_name: "",
                phone: "",
                email: "",
                description: "",
                company: ""
            }
        }

    }

    componentDidMount() {
        this.validateState()
    }

    validateState = () => {
        this.setState({ validationErrors: run(this.state.inquiryForm, this.fieldValidations) });
    };


    handleFieldChanged = (field, type = "") => {
        return (e, data) => {
            let value = data.value;

            this.setState({
                inquiryForm: update(this.state.inquiryForm, {
                    [field]: {
                        $set: value
                    }
                })
            }, this.validateState)
        }
    };

    clicked = () => {
        window.location = window.location.origin
    };

    inquiry = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;

        let { inquiryForm } = this.state;

        this.setState({ loading: true })
        const inquiryResponse = await this.authenticationApi.inquiry(inquiryForm)
        if (inquiryResponse.data) {
            this.props.notify(false, 'AAdded successfully!')

        } else {
            this.props.notify(true, inquiryResponse.message ? inquiryResponse.message : 'Error, please try again!')
        }
        this.setState({ loading: false })
    };

    render() {
        let { inquiryForm, loading } = this.state;

        const firstNameError = this.context.errorFor(this.state, 'first_name', null, true);
        const lastNameError = this.context.errorFor(this.state, 'last_name', null, true);
        const kanaFirstNameError = this.context.errorFor(this.state, 'kana_first_name', null, true);
        const kanaLastNameError = this.context.errorFor(this.state, 'kana_last_name', null, true);
        const phoneError = this.context.errorFor(this.state, 'phone', null, true);
        const emailError = this.context.errorFor(this.state, 'email', null, true);
        const descriptionError = this.context.errorFor(this.state, 'description', null, true);
        const companyError = this.context.errorFor(this.state, 'company', null, true);

        return (
            <div className={'register-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`??????????????????`}</Breadcrumb.Section>
                </Breadcrumb>

                <Form className={'inquiry-form'}>
                    <div className={'form-header'}>
                        <h1>??????????????????</h1>
                        <p>?????????????????????</p>
                    </div>

                    <div className={'fields-section'}>
                        <Label>?????????<span className='required-span'>???</span></Label>
                        <Form.Group widths={'equal'}>
                            <Form.Field required
                                error={!!lastNameError}>
                                <Input
                                    placeholder={'??? ???: ??????'}
                                    value={inquiryForm.last_name ? inquiryForm.last_name : ''}
                                    onChange={this.handleFieldChanged("last_name")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!firstNameError}>
                                <Input
                                    placeholder={'?????? ???: ??????'}
                                    value={inquiryForm.first_name ? inquiryForm.first_name : ''}
                                    onChange={this.handleFieldChanged("first_name")}
                                />
                            </Form.Field>

                        </Form.Group>
                        <Label>????????????<span className='required-span'>???</span></Label>
                        <Form.Group widths={'equal'}>
                            <Form.Field required
                                error={!!kanaLastNameError}>
                                <Input
                                    placeholder={'??? ???: ?????????'}
                                    value={inquiryForm.kana_last_name ? inquiryForm.kana_last_name : ''}
                                    onChange={this.handleFieldChanged("kana_last_name")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!kanaFirstNameError}>
                                <Input
                                    placeholder={'??? ???: ?????????'}
                                    value={inquiryForm.kana_first_name ? inquiryForm.kana_first_name : ''}
                                    onChange={this.handleFieldChanged("kana_first_name")}
                                />
                            </Form.Field>

                        </Form.Group>

                        <Form.Field required
                            error={!!companyError}>
                            <Label>????????? / ??????</Label>
                            <Input
                                placeholder={'?????????????????? / ?????????'}
                                value={inquiryForm.company ? inquiryForm.company : ''}
                                onChange={this.handleFieldChanged("company")}
                            />
                        </Form.Field>

                        <Form.Field required
                            error={!!emailError}>
                            <Label>?????????????????????<span className='required-span'>???</span>???????????????????????????????????????</Label>
                            <Input
                                placeholder={'mail@nichijo.media.s-pm.co.jp'}
                                value={inquiryForm.email ? inquiryForm.email : ''}
                                onChange={this.handleFieldChanged("email")}
                            />
                        </Form.Field>

                        <Form.Field required
                            error={!!phoneError}>
                            <Label>????????????<span className='required-span'>???</span>???????????????????????????????????????</Label>
                            <Input
                                placeholder={'???:000-0000-0000  ??????????????????'}
                                value={inquiryForm.phone ? inquiryForm.phone : ''}
                                onChange={this.handleFieldChanged("phone")}
                            />
                        </Form.Field>
                        

                        <Form.Field required
                            error={!!descriptionError}>
                            <Label>????????????????????????<span className='required-span'>???</span> (1,000????????????)</Label>
                            <TextArea
                            placeholder={'????????????????????????????????????????????????????????????'}
                                rows={10}
                                value={inquiryForm.description}
                                onChange={this.handleFieldChanged('description')}
                            />
                        </Form.Field>

                    </div>
                    <div className={'action-section'}>
                        <p>
                            <img src='/images/main-images/circle.svg' />
                            <span onClick={() => this.props.history.push('/privacy-policy')}>??????????????????????????????</span>
                             ?????????????????????
                        </p>
                        <Button loading={loading}
                            onClick={() => this.inquiry()}>
                            ????????????
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }


}