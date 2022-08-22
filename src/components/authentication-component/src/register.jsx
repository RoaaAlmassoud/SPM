import React from 'react';
import {ruleRunner, run} from "../../../utils/ruleRunner";
import {required, email} from "../../../utils/rules";
import AppContext from "../../../context/app-context";
import AuthenticationApi from "../api/authentication-api"
import Helper from "../../../utils/helper"
import update from "immutability-helper";
import './authentication-css.css';
import {Form, Divider, Breadcrumb, Input, Label, Checkbox, Button} from 'semantic-ui-react'


export default class Register extends React.Component {
    static contextType = AppContext;
    userFieldValidations = [
        ruleRunner("email", 'email', required, email),
        ruleRunner("name", 'name', required),
        ruleRunner("password", 'password', required),
        ruleRunner("surname", 'surname', required),
        ruleRunner("name_kana", 'name_kana', required),
        ruleRunner("last_name_kana", 'last_name_kana', required),
        ruleRunner("year", 'year', required),
        ruleRunner("month", 'month', required),
        ruleRunner("day", 'day', required),
        //ruleRunner("day_of_birth", 'day_of_birth', required),
        ruleRunner("phone", 'phone', required),
        ruleRunner("postcode", 'postcode', required),
        ruleRunner("address_1", 'address_1', required),
        ruleRunner("address_2", 'address_2', required),
    ];

    providerFieldValidations = [
        ruleRunner("email", 'email', required, email),
        ruleRunner("name", 'name', required),
        ruleRunner("password", 'password', required),
        ruleRunner("surname", 'surname', required),
        ruleRunner("last_name_kana", 'last_name_kana', required),
        ruleRunner("name_kana", 'name_kana', required),
        ruleRunner("phone", 'phone', required),
        ruleRunner("postcode", 'postcode', required),
        ruleRunner("address_1", 'address_1', required),
        ruleRunner("address_2", 'address_2', required),
        ruleRunner("business_name", 'business_name', required),
        ruleRunner("branch_name", 'branch_name', required),
        ruleRunner("account_number", 'account_number', required),
        ruleRunner("account_holder", 'account_holder', required),
        ruleRunner("financial_institution_name", 'financial_institution_name', required),
        ruleRunner("m_surname", 'm_surname', required),
        ruleRunner("m_name", 'm_name', required),
        ruleRunner("m_last_name_kana", 'm_last_name_kana', required),
        ruleRunner("m_name_kana", 'm_name_kana', required),
    ];

    constructor(props) {
        super(props);
        this.authenticationApi = new AuthenticationApi(this);
        let userType = 'user'
        //props ? props.type === 'provider' ? 'provider' : 'user' : 'user';

        this.state = {
            validationErrors: {},
            showErrors: false,
            userType: userType,
            loading: false,
            registerForm: userType === 'user' ?
                {
                    email: "",
                    name: "",
                    password: "",
                    surname: "",
                    name_kana: "",
                    last_name_kana: "",
                    day_of_birth: "",
                    phone: "",
                    postcode: "",
                    address_1: "",
                    address_2: "",
                    exp_year: "",
                    exp_month: "",
                    card_cvc: "",
                    card_number: "",
                    gender: "male",
                    year: '',
                    month: '',
                    day: ''
                }
                :
                {
                    email: "",
                    name: "",
                    password: "",
                    surname: "",
                    last_name_kana: "",
                    name_kana: "",
                    phone: "",
                    postcode: "",
                    address_1: "",
                    address_2: "",
                    classification: "common",
                    business_name: "",
                    // will remove
                    branch_name: "",
                    account_type: "savings",
                    account_number: "",
                    account_holder: "",
                    financial_institution_name: "",
                    //
                    m_surname: "",
                    m_name: "",
                    m_last_name_kana: "",
                    m_name_kana: ""
                }
        }

    }

    componentDidMount() {
        this.validateState()
    }

    validateState = () => {
        if (this.state.userType === 'user') {
            this.setState({validationErrors: run(this.state.registerForm, this.userFieldValidations)});
        } else {
            this.setState({validationErrors: run(this.state.registerForm, this.providerFieldValidations)});
        }
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
                registerForm: update(this.state.registerForm, {
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

    register = async () => {
        this.setState({showErrors: true});
        if (!Helper.isEmpty(this.state.validationErrors)) return null;

        let {registerForm, userType} = this.state;
        if (userType === 'user') {
            registerForm.day_of_birth = `${registerForm.year.trim()}-${registerForm.month.trim()}-${registerForm.day.trim()}`
        }
        this.setState({loading: true})
        const registerResponse = userType === 'user' ? await this.authenticationApi.userRegister(registerForm)
         : await this.authenticationApi.providerRegister(registerForm)
        if (registerResponse.data) {
            this.props.notify(false, 'Created successfully!')
            this.context.userType = userType
            this.props.history.push({
                pathname: `/registration-completed`,
                state: {userType: userType}
            })

        } else {
            this.props.notify(true, registerResponse.message ? registerResponse.message : 'Error, please try again!')
        }
        this.setState({loading: false})
    };

    switch = () => {
        let {userType} = this.state;
        let type = userType === 'user' ? 'provider' : 'user';

        let registerForm = type === 'user' ? {
                gender: 'male'
            }
            : {
                classification: 'common',
                account_type: 'savings'
            };
        this.setState({
            userType: type,
            registerForm: registerForm
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
        let {registerForm, userType, loading} = this.state;

        const businessNameError = this.context.errorFor(this.state, 'business_name', null, true);
        const branchNameError = this.context.errorFor(this.state, 'branch_name', null, true);
        const accountNumberError = this.context.errorFor(this.state, 'account_number', null, true);
        const accountHolderError = this.context.errorFor(this.state, 'account_holder', null, true);
        const financialInstitutionNameError = this.context.errorFor(this.state, 'financial_institution_name', null, true);
        const mSurnameError = this.context.errorFor(this.state, 'm_surname', null, true);
        const mNameError = this.context.errorFor(this.state, 'm_name', null, true);
        const mLastNameKanaError = this.context.errorFor(this.state, 'm_last_name_kana', null, true);
        const mNameKanaError = this.context.errorFor(this.state, 'm_name_kana', null, true);


        const emailError = this.context.errorFor(this.state, 'email', null, true);
        const nameError = this.context.errorFor(this.state, 'name', null, true);
        const passwordError = this.context.errorFor(this.state, 'password', null, true);
        const surnameError = this.context.errorFor(this.state, 'surname', null, true);
        const nameKanaError = this.context.errorFor(this.state, 'name_kana', null, true);
        const lastNameKanaError = this.context.errorFor(this.state, 'last_name_kana', null, true);
        const phoneError = this.context.errorFor(this.state, 'phone', null, true);
        const postcodeError = this.context.errorFor(this.state, 'postcode', null, true);
        const address1Error = this.context.errorFor(this.state, 'address_1', null, true);
        const address2Error = this.context.errorFor(this.state, 'address_2', null, true);
        const yearError = this.context.errorFor(this.state, 'year', null, true);
        const monthError = this.context.errorFor(this.state, 'month', null, true);
        const dayError = this.context.errorFor(this.state, 'day', null, true);


        return (
            <div className={'register-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron'/>
                    <Breadcrumb.Section active>{`${userType === 'user' ? 'ユーザー登録' : 'プロバイダー登録'}`}</Breadcrumb.Section>
                </Breadcrumb>
                {
                    userType === 'user' ?
                        <Form className={'user-form'}>
                            <div className={'form-header'}>
                                <h1>ユーザー登録</h1>
                                <p>ソーシャルアカウントを利用しての登録、または以下の入力項目を全て記入してください。</p>
                            </div>
                            <div className={'register-options'}>
                                <img src={'/images/main-images/apple.svg'}/>
                                <img src={'/images/main-images/twitter.svg'}/>
                                <img src={'/images/main-images/google.svg'}/>
                                <img src={'/images/main-images/facebook.svg'}/>

                            </div>
                            <Divider horizontal>または</Divider>
                            <div className={'fields-section'}>
                                <Label>氏名</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!surnameError}>
                                        <Input
                                            placeholder={'姓'}
                                            value={registerForm.surname ? registerForm.surname : ''}
                                            onChange={this.handleFieldChanged("surname")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!nameError}>
                                        <Input
                                            placeholder={'名'}
                                            value={registerForm.name ? registerForm.name : ''}
                                            onChange={this.handleFieldChanged("name")}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Label>フリガナ</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!lastNameKanaError}>
                                        <Input
                                            placeholder={'セイ'}
                                            value={registerForm.last_name_kana ? registerForm.last_name_kana : ''}
                                            onChange={this.handleFieldChanged("last_name_kana")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!nameKanaError}>
                                        <Input
                                            placeholder={'メイ'}
                                            value={registerForm.name_kana ? registerForm.name_kana : ''}
                                            onChange={this.handleFieldChanged("name_kana")}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Label>生年月日</Label>
                                <Form.Group widths={'equal'} className={'dob-fields'}>
                                    <Form.Field required
                                                error={!!yearError}>
                                        <Input
                                            placeholder={'セイ(1999)'}
                                            value={registerForm.year ? registerForm.year : ''}
                                            onChange={this.handleFieldChanged("year")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!monthError}>
                                        <Input
                                            placeholder={'メイ(04)'}
                                            value={registerForm.month ? registerForm.month : ''}
                                            onChange={this.handleFieldChanged("month")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!dayError}>
                                        <Input
                                            placeholder={'メイ(22)'}
                                            value={registerForm.day ? registerForm.day : ''}
                                            onChange={this.handleFieldChanged("day")}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Label>性別</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field>
                                        <Checkbox
                                            radio
                                            label='男性'
                                            name='checkboxRadioGroup'
                                            value={'male'}
                                            checked={registerForm.gender === 'male'}
                                            onChange={this.handleFieldChanged("gender")}
                                        />
                                        <Checkbox
                                            radio
                                            label='女性'
                                            name='checkboxRadioGroup'
                                            value={'female'}
                                            checked={registerForm.gender === 'female'}
                                            onChange={this.handleFieldChanged("gender")}
                                        />
                                        <Checkbox
                                            radio
                                            label='未回答'
                                            name='checkboxRadioGroup'
                                            value={'none'}
                                            checked={registerForm.gender === 'none'}
                                            onChange={this.handleFieldChanged("gender")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Field required
                                            error={!!emailError}>
                                    <Label>メールアドレス</Label>
                                    <Input
                                        placeholder={'Sampke-email/@gmail.com'}
                                        value={registerForm.email ? registerForm.email : ''}
                                        onChange={this.handleFieldChanged("email")}
                                    />
                                </Form.Field>
                                <Form.Field required
                                            error={!!passwordError}>
                                    <Label>パスワード</Label>
                                    <Input
                                        type={'password'}
                                        placeholder={'10〜20文字の半角英数字'}
                                        value={registerForm.password ? registerForm.password : ''}
                                        onChange={this.handleFieldChanged("password")}
                                    />
                                </Form.Field>
                                <Form.Field required
                                            error={!!phoneError}>
                                    <Label>電話番号（ハイフン無し）</Label>
                                    <Input
                                        placeholder={'09012349876'}
                                        value={registerForm.phone ? registerForm.phone : ''}
                                        onChange={this.handleFieldChanged("phone")}
                                    />
                                </Form.Field>
                                <Form.Field className={'address-field'}
                                            required
                                            error={!!postcodeError || !!address1Error || !!address2Error}>
                                    <Label>住所</Label>
                                    <Input
                                        className={'post-code-input'}
                                        placeholder={'1230123'}
                                        value={registerForm.postcode ? registerForm.postcode : ''}
                                        onChange={this.handleFieldChanged("postcode")}
                                    />
                                    <Input
                                        placeholder={'東京都千代田区丸の内1-2-3'}
                                        value={registerForm.address_1 ? registerForm.address_1 : ''}
                                        onChange={this.handleFieldChanged("address_1")}
                                    />
                                    <Input
                                        placeholder={'皇居マンション 1002'}
                                        value={registerForm.address_2 ? registerForm.address_2 : ''}
                                        onChange={this.handleFieldChanged("address_2")}
                                    />
                                </Form.Field>
                            </div>
                            <div className={'action-section'}>
                                <Button loading={loading}
                                        onClick={() => this.register()}>
                                    登録
                                </Button>
                            </div>
                            <div className={'switch-section'}>
                                <Button onClick={() => this.switch()}>
                                    {'プロバイダー登録'}
                                </Button>
                            </div>
                        </Form>
                        :
                        <Form className={'provider-form'}>
                            <div className={'form-header'}>
                                <h1>プロバイダー登録</h1>
                                <p>以下の項目を全て記入してください</p>
                            </div>
                            <div className={'fields-section'}>
                                <Label>区分</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field>
                                        <Checkbox
                                            radio
                                            label='法人'
                                            name='checkboxRadioGroup2'
                                            value={'common'}
                                            checked={registerForm.classification === 'common'}
                                            onChange={this.handleFieldChanged("classification")}
                                        />
                                        <Checkbox
                                            radio
                                            label='個人'
                                            name='checkboxRadioGroup2'
                                            value={'individual'}
                                            checked={registerForm.classification === 'individual'}
                                            onChange={this.handleFieldChanged("classification")}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Field required
                                            error={!!businessNameError}>
                                    <Label>会社名／事業名称</Label>
                                    <Input
                                        placeholder={'株式会社サブスク'}
                                        value={registerForm.business_name ? registerForm.business_name : ''}
                                        onChange={this.handleFieldChanged("business_name")}
                                    />
                                </Form.Field>

                                <Label>代表者氏名</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!surnameError}>
                                        <Input
                                            placeholder={'姓'}
                                            value={registerForm.surname ? registerForm.surname : ''}
                                            onChange={this.handleFieldChanged("surname")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!nameError}>
                                        <Input
                                            placeholder={'名'}
                                            value={registerForm.name ? registerForm.name : ''}
                                            onChange={this.handleFieldChanged("name")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Label>代表者氏名（カナ）</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!lastNameKanaError}>
                                        <Input
                                            placeholder={'セイ'}
                                            value={registerForm.last_name_kana ? registerForm.last_name_kana : ''}
                                            onChange={this.handleFieldChanged("last_name_kana")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!nameKanaError}>
                                        <Input
                                            placeholder={'メイ'}
                                            value={registerForm.name_kana ? registerForm.name_kana : ''}
                                            onChange={this.handleFieldChanged("name_kana")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Label>担当者氏名</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!mSurnameError}>
                                        <Input
                                            placeholder={'姓'}
                                            value={registerForm.m_surname ? registerForm.m_surname : ''}
                                            onChange={this.handleFieldChanged("m_surname")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!mNameError}>
                                        <Input
                                            placeholder={'名'}
                                            value={registerForm.m_name ? registerForm.m_name : ''}
                                            onChange={this.handleFieldChanged("m_name")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Label>担当者氏名（カナ）</Label>
                                <Form.Group widths={'equal'}>
                                    <Form.Field required
                                                error={!!mLastNameKanaError}>
                                        <Input
                                            placeholder={'セイ'}
                                            value={registerForm.m_last_name_kana ? registerForm.m_last_name_kana : ''}
                                            onChange={this.handleFieldChanged("m_last_name_kana")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                                error={!!mNameKanaError}>
                                        <Input
                                            placeholder={'メイ'}
                                            value={registerForm.m_name_kana ? registerForm.m_name_kana : ''}
                                            onChange={this.handleFieldChanged("m_name_kana")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Field required
                                            error={!!emailError}>
                                    <Label>メールアドレス</Label>
                                    <Input
                                        placeholder={'Sampke-email/@gmail.com'}
                                        value={registerForm.email ? registerForm.email : ''}
                                        onChange={this.handleFieldChanged("email")}
                                    />
                                </Form.Field>
                                <Form.Field required
                                            error={!!passwordError}>
                                    <Label>パスワード</Label>
                                    <Input
                                        type={'password'}
                                        placeholder={'10〜20文字の半角英数字'}
                                        value={registerForm.password ? registerForm.password : ''}
                                        onChange={this.handleFieldChanged("password")}
                                    />
                                </Form.Field>
                                <Form.Field required
                                            error={!!phoneError}>
                                    <Label>電話番号（ハイフン無し）</Label>
                                    <Input
                                        placeholder={'09012349876'}
                                        value={registerForm.phone ? registerForm.phone : ''}
                                        onChange={this.handleFieldChanged("phone")}
                                    />
                                </Form.Field>
                                <Form.Field className={'address-field'}
                                            required
                                            error={!!postcodeError || !!address1Error || !!address2Error}>
                                    <Label>住所</Label>
                                    <Input
                                        className={'post-code-input'}
                                        placeholder={'1230123'}
                                        value={registerForm.postcode ? registerForm.postcode : ''}
                                        onChange={this.handleFieldChanged("postcode")}
                                    />
                                    <Input
                                        placeholder={'東京都千代田区丸の内1-2-3'}
                                        value={registerForm.address_1 ? registerForm.address_1 : ''}
                                        onChange={this.handleFieldChanged("address_1")}
                                    />
                                    <Input
                                        placeholder={'皇居マンション 1002'}
                                        value={registerForm.address_2 ? registerForm.address_2 : ''}
                                        onChange={this.handleFieldChanged("address_2")}
                                    />
                                </Form.Field>

                                <Form.Field className={'custom-width'}
                                            required
                                            error={!!financialInstitutionNameError}>
                                    <Label>お支払い先金融機関</Label>
                                    <Input
                                        value={registerForm.financial_institution_name ? registerForm.financial_institution_name : ''}
                                        onChange={this.handleFieldChanged("financial_institution_name")}
                                    />
                                </Form.Field>

                                <Form.Field className={'custom-width'}
                                            required
                                            error={!!branchNameError}>
                                    <Label>支店名</Label>
                                    <Input
                                        value={registerForm.branch_name ? registerForm.branch_name : ''}
                                        onChange={this.handleFieldChanged("branch_name")}
                                    />
                                </Form.Field>

                                <Label>口座種別</Label>
                                <Form.Group widths={'equal'} className={'custom-check-width'}>
                                    <Form.Field>
                                        <Checkbox
                                            radio
                                            label='普通預金口座'
                                            name='checkboxRadioGroup4'
                                            value={'savings'}
                                            checked={registerForm.account_type === 'savings'}
                                            onChange={this.handleFieldChanged("account_type")}
                                        />
                                        <Checkbox
                                            radio
                                            label='当座預金口座'
                                            name='checkboxRadioGroup4'
                                            value={'checking'}
                                            checked={registerForm.account_type === 'checking'}
                                            onChange={this.handleFieldChanged("account_type")}
                                        />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Field required
                                            error={!!accountNumberError}>
                                    <Label>口座番号</Label>
                                    <Input
                                        placeholder={'1234567'}
                                        value={registerForm.account_number ? registerForm.account_number : ''}
                                        onChange={this.handleFieldChanged("account_number")}
                                    />
                                </Form.Field>

                                <Form.Field required
                                            error={!!accountHolderError}>
                                    <Label>口座名義（カナ）</Label>
                                    <Input
                                        placeholder={'カ）サブスク'}
                                        value={registerForm.account_holder ? registerForm.account_holder : ''}
                                        onChange={this.handleFieldChanged("account_holder")}
                                    />
                                </Form.Field>
                            </div>
                            <div className={'action-section'}>
                                <Button loading={loading}
                                        onClick={() => this.register()}>
                                    登録
                                </Button>
                            </div>
                            <div className={'switch-section'}>
                                <Button onClick={() => this.switch()}>
                                    {'ユーザー登録'}
                                </Button>
                            </div>
                        </Form>
                }


            </div>
        );
    }


}