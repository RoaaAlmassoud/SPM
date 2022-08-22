import React from 'react';
import ServiceApi from "../api/service-api"
import { Modal, Button, Form, Input, Label, Dropdown } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"
import { ruleRunner, run } from "../../../utils/ruleRunner";
import { required } from "../../../utils/rules";
import update from "immutability-helper";
import AppContext from "../../../context/app-context";
import { type } from '@testing-library/user-event/dist/type';

export default class SubscripeModal extends React.Component {
    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("card_number", 'card_number', required),
        ruleRunner("card_cvc", 'card_cvc', required),
        ruleRunner("exp_year", 'exp_year', required),
        ruleRunner("exp_month", 'exp_month', required),
    ];
    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        let currentYear = new Date().getFullYear()
        let years = []
        let months = []
        for (let i = currentYear + 1; i <= currentYear + 10; i++) {
            let formattedNumber = i.toString()
            if (formattedNumber.length === 1) {
                formattedNumber = `0${formattedNumber}`
            }
            years.push({
                key: formattedNumber,
                text: formattedNumber,
                value: formattedNumber
            })
        }

        for (let i = 0 + 1; i <= 12; i++) {
            let formattedNumber = i.toString()
            if (formattedNumber.length === 1) {
                formattedNumber = `0${formattedNumber}`
            }
            months.push({
                key: formattedNumber,
                text: formattedNumber,
                value: formattedNumber
            })
        }

        let yearsArray =
            this.state = {
                validationErrors: {},
                showErrors: false,
                open: false,
                activeIndex: 0,
                loading: false,
                years: years,
                months: months,
                service: {
                    "card_number": "",
                    "card_cvc": "",
                    "exp_year": "",
                    "exp_month": ""
                }
            }
    }

    componentDidMount() {
        this.validateState()
    }

    validateState = () => {
        this.setState({
            validationErrors: run(this.state.service, this.fieldValidations)
        });

    };

    show = (id) => {
        this.setState({
            open: true,
            id: id
        })
    };

    hide = () => {
        this.setState({
            open: false,
        })
    };

    handleFieldChanged = (field, type = "") => {
        return (e, data) => {
            let value = type === "number" ? parseFloat(data.value) :
                type === "check" ? data.checked : data.value

            this.setState({
                service: update(this.state.service, {
                    [field]: {
                        $set: value
                    }
                }),
            }, () => {
                this.validateState();
            })
        }

    }

    subcripe = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;
        let { service, id } = this.state

        this.context.service = this.props.service;
        service.service_id = id;
        this.setState({ loading: true })
        const response = await this.serviceApi.subscripe(service);
        this.setState({ loading: false })

        if (response.data) {
            this.props.props.props.props.props.notify(false, 'Operation completed successfully!')
            this.props.props.props.props.props.history.push('/service-completed')
        } else {
            this.props.props.props.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { service, loading, months, years } = this.state;
        const cardNumberError = this.context.errorFor(this.state, 'card_number', null, true);
        const expMonthError = this.context.errorFor(this.state, 'exp_month', null, true);
        const expYearError = this.context.errorFor(this.state, 'exp_year', null, true);
        const CardCvcError = this.context.errorFor(this.state, 'card_cvc', null, true);
        return (
            <Modal
                className={'subscribe-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='header-section'>
                        <p className={'header-text'}>このサービスに登録を申し込んでよろしいですか？</p>
                    </div>
                    <Form>
                        <Form.Field required
                            error={!!cardNumberError}>
                            <Label>クレジットカード番号</Label>
                            <Input
                                value={service ? service.card_number : ""}
                                onChange={this.handleFieldChanged("card_number")}
                                placeholder={'0000111122223333'}
                            />
                        </Form.Field>
                        <Label>クレジットカード有効期限</Label>
                        <Form.Group>
                            <Form.Field required
                                error={!!expMonthError}>
                                {/* <Input
                                    value={service ? service.exp_month : ""}
                                    onChange={this.handleFieldChanged("exp_month")}
                                    placeholder={'月 (04)'}
                                /> */}
                                <Dropdown
                                    search
                                    fluid
                                    selection
                                    selectOnBlur={false}
                                    value={service.exp_month}
                                    placeholder={'月'}
                                    onChange={this.handleFieldChanged('exp_month')}
                                    clearable
                                    options={months}
                                />
                            </Form.Field>
                            <span>/</span>
                            <Form.Field required
                                error={!!expYearError}>
                                {/* <Input
                                    value={service ? service.exp_year : ""}
                                    onChange={this.handleFieldChanged("exp_year")}
                                    placeholder={'年 (2024)'}
                                /> */}
                                <Dropdown
                                    search
                                    fluid
                                    selection
                                    selectOnBlur={false}
                                    value={service.exp_year}
                                    placeholder={'年'}
                                    onChange={this.handleFieldChanged('exp_year')}
                                    clearable
                                    options={years}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field required
                            error={!!CardCvcError}>
                            <Label>クレジットカードセキュリティーコード</Label>
                            <Input
                                value={service ? service.card_cvc : ""}
                                onChange={this.handleFieldChanged("card_cvc")}
                                placeholder={'012'}
                            />
                        </Form.Field>
                        <p>カード裏面の下3桁のコード<br />
                            （AMEXは表面のクレジットカード番号の右上４桁）</p>
                    </Form>
                    <div className={'action-section'}>
                        <Button loading={loading}
                            onClick={() => this.subcripe()}>
                            申し込む
                        </Button>
                        <p onClick={() => this.hide()}>前の画面に戻る</p>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}