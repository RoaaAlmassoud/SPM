import React from 'react';
import PageApi from "../../../api/page-api"
import { Form, Header, Loader, Button, Input, Label, Accordion, TextArea, Checkbox } from 'semantic-ui-react'
import update from "immutability-helper";
import Helper from "../../../../../utils/helper"
import { ruleRunner, run } from "../../../../../utils/ruleRunner";
import { required, email } from "../../../../../utils/rules";
import AppContext from "../../../../../context/app-context";
import DeleteAccountModal from '../../delete-account-modal';

export default class UpdateAccount extends React.Component {

    static contextType = AppContext;
    financialFieldValidations = [
        ruleRunner("branch_name", 'branch_name', required),
        ruleRunner("account_type", 'account_type', required),
        ruleRunner("account_number", 'account_number', required),
        ruleRunner("account_holder", 'account_holder', required),
        ruleRunner("financial_institution_name", 'financial_institution_name', required),
    ];

    basicFieldValidations = [
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
        ruleRunner("m_surname", 'm_surname', required),
        ruleRunner("m_name", 'm_name', required),
        ruleRunner("m_last_name_kana", 'm_last_name_kana', required),
        ruleRunner("m_name_kana", 'm_name_kana', required),
    ];
    constructor(props) {
        super(props);

        this.pageApi = new PageApi(this);
        this.deleteAccountModalRef = React.createRef()
        this.state = {
            validationErrors: {},
            showErrors: false,
            loading: false,
            loader: true,
            deleteLoader: false,
            innerWidth: window.innerWidth,
            basicUserInfo: {
                address_1: "",
                address_2: "",
                business_name: "",
                classification: "common",
                commission_value: null,
                email: "",
                password: "",
                last_name_kana: "",
                m_last_name_kana: "",
                m_name: "",
                m_name_kana: "",
                m_surname: "",
                name: "",
                name_kana: "",
                phone: "",
                postcode: "",
                surname: ""
            },

            financialUserInfo: {
                branch_name: "",
                account_type: "",
                account_number: "",
                account_holder: "",
                financial_institution_name: ""
            }

        }
    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    validateState = (formType = 'basic') => {
        if (formType === 'basic') {
            this.setState({ validationErrors: run(this.state.basicUserInfo, this.basicFieldValidations) });
        } else {
            this.setState({ validationErrors: run(this.state.financialUserInfo, this.financialFieldValidations) });
        }
    };

    async componentDidMount() {
        let { basicUserInfo, financialUserInfo } = this.state;
        const accountResponse = await this.pageApi.getProviderAccount()
        if (accountResponse.data) {
            let user = accountResponse.data
            basicUserInfo = {
                address_1: user.address_1,
                address_2: user.address_2,
                business_name: user.business_name,
                classification: user.classification,
                commission_value: user.commission_value,
                email: user.email,
                last_name_kana: user.last_name_kana,
                m_last_name_kana: user.m_last_name_kana,
                m_name: user.m_name,
                m_name_kana: user.m_name_kana,
                m_surname: user.m_surname,
                name: user.name,
                name_kana: user.name_kana,
                phone: user.phone,
                postcode: user.postcode,
                surname: user.surname
            }
            financialUserInfo = {
                branch_name: user.branch_name,
                account_type: user.account_type,
                account_number: user.account_number,
                account_holder: user.account_holder,
                financial_institution_name: user.financial_institution_name
            }
            this.setState({
                basicUserInfo: basicUserInfo,
                financialUserInfo: financialUserInfo,
                loader: false
            }, this.validateState)
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    handleFieldChanged = (field, formType = 'basic') => {
        return (e, data) => {
            // let value = type === "number" ? parseFloat(data.value) :
            //     type === "check" ? data.checked : data.value
            let value = data.value
            let form = formType === 'basic' ? 'basicUserInfo' : 'financialUserInfo'
            this.setState({
                [form]: update(this.state[form], {
                    [field]: {
                        $set: value
                    }
                }),
            }, () => {
                this.validateState(formType)
            })
        }

    }

    handleDelete = async () => {
        this.setState({ deleteLoader: true })
        const deleteResponse = await this.pageApi.deleteProvider({})
        if (deleteResponse.data) {
            this.props.props.notify(false, 'Ddleted successfully')
            localStorage.clear();
            window.location.href = '/'
        } else {
            this.props.props.notify(true, 'Error! Please try again!')
        }
    }

    handleAction = async (formType) => {
        this.setState({ showErrors: true });
        this.validateState(formType)
        if (!Helper.isEmpty(this.state.validationErrors)) return null;

        let { basicUserInfo, financialUserInfo } = this.state

        if (formType === 'basic') {
            this.setState({ loadingBasic: true })
            const basicReponse = await this.pageApi.updateProviderAccount(basicUserInfo)
            this.setState({ loadingBasic: false })
            if (basicReponse.data) {
                this.props.props.notify(false, 'Updated successfully')
            } else {
                this.props.props.notify(true, basicReponse.message ? basicReponse.message : 'Error! Please try again!')
            }
        } else {
            this.setState({ loadingFinancial: true })
            const financiaResponse = await this.pageApi.updateProviderFinancialAccount(financialUserInfo)
            this.setState({ loadingFinancial: false })
            if (financiaResponse.data) {
                this.props.props.notify(false, 'Updated successfully')
            } else {
                this.props.props.notify(true, financiaResponse.message ? financiaResponse.message : 'Error! Please try again!')
            }
        }
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    openDeleteAccountModal = () => {
        this.deleteAccountModalRef.current.show()
    }

    renderFirstForm = () => {
        let { loadingBasic, basicUserInfo } = this.state;

        const emailError = this.context.errorFor(this.state, 'email', null, true);
        const nameError = this.context.errorFor(this.state, 'name', null, true);
        const passwordError = this.context.errorFor(this.state, 'password', null, true);
        const surnameError = this.context.errorFor(this.state, 'surname', null, true);
        const lastNameKanaError = this.context.errorFor(this.state, 'last_name_kana', null, true);
        const nameKanaError = this.context.errorFor(this.state, 'name_kana', null, true);
        const phoneError = this.context.errorFor(this.state, 'phone', null, true);
        const postcodeError = this.context.errorFor(this.state, 'postcode', null, true);
        const address1Error = this.context.errorFor(this.state, 'address_1', null, true);

        const address2Error = this.context.errorFor(this.state, 'address_2', null, true);
        const businessNameError = this.context.errorFor(this.state, 'business_name', null, true);
        const mSurnameError = this.context.errorFor(this.state, 'm_surname', null, true);
        const mNameError = this.context.errorFor(this.state, 'm_name', null, true);
        const mLastNameKanaError = this.context.errorFor(this.state, 'm_last_name_kana', null, true);
        const mNameKanaError = this.context.errorFor(this.state, 'm_name_kana', null, true);

        return (
            <div className='first-form'>
                <h2>基本情報</h2>
                <Form className={'provider-form'}>
                    <div className={'fields-section'}>
                        <Label>区分</Label>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <Checkbox
                                    radio
                                    label='法人'
                                    name='checkboxRadioGroup2'
                                    value={'common'}
                                    checked={basicUserInfo.classification === 'common'}
                                    onChange={this.handleFieldChanged("classification")}
                                />
                                <Checkbox
                                    radio
                                    label='個人'
                                    name='checkboxRadioGroup2'
                                    value={'individual'}
                                    checked={basicUserInfo.classification === 'individual'}
                                    onChange={this.handleFieldChanged("classification")}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Field required
                            error={!!businessNameError}>
                            <Label>会社名／事業名称</Label>
                            <Input
                                placeholder={'株式会社サブスク'}
                                value={basicUserInfo.business_name ? basicUserInfo.business_name : ''}
                                onChange={this.handleFieldChanged("business_name")}
                            />
                        </Form.Field>

                        <Label>代表者氏名</Label>
                        <Form.Group widths={'equal'}>
                            <Form.Field required
                                error={!!surnameError}>
                                <Input
                                    placeholder={'姓'}
                                    value={basicUserInfo.surname ? basicUserInfo.surname : ''}
                                    onChange={this.handleFieldChanged("surname")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!nameError}>
                                <Input
                                    placeholder={'名'}
                                    value={basicUserInfo.name ? basicUserInfo.name : ''}
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
                                    value={basicUserInfo.last_name_kana ? basicUserInfo.last_name_kana : ''}
                                    onChange={this.handleFieldChanged("last_name_kana")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!nameKanaError}>
                                <Input
                                    placeholder={'メイ'}
                                    value={basicUserInfo.name_kana ? basicUserInfo.name_kana : ''}
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
                                    value={basicUserInfo.m_surname ? basicUserInfo.m_surname : ''}
                                    onChange={this.handleFieldChanged("m_surname")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!mNameError}>
                                <Input
                                    placeholder={'名'}
                                    value={basicUserInfo.m_name ? basicUserInfo.m_name : ''}
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
                                    value={basicUserInfo.m_last_name_kana ? basicUserInfo.m_last_name_kana : ''}
                                    onChange={this.handleFieldChanged("m_last_name_kana")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!mNameKanaError}>
                                <Input
                                    placeholder={'メイ'}
                                    value={basicUserInfo.m_name_kana ? basicUserInfo.m_name_kana : ''}
                                    onChange={this.handleFieldChanged("m_name_kana")}
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Field required
                            error={!!emailError}>
                            <Label>メールアドレス</Label>
                            <Input
                                placeholder={'Sampke-email/@gmail.com'}
                                value={basicUserInfo.email ? basicUserInfo.email : ''}
                                onChange={this.handleFieldChanged("email")}
                            />
                        </Form.Field>
                        <Form.Field required
                            error={!!passwordError}>
                            <Label>パスワード</Label>
                            <Input
                                type={'password'}
                                placeholder={'10〜20文字の半角英数字'}
                                value={basicUserInfo.password ? basicUserInfo.password : ''}
                                onChange={this.handleFieldChanged("password")}
                            />
                        </Form.Field>
                        <Form.Field required
                            error={!!phoneError}>
                            <Label>電話番号（ハイフン無し）</Label>
                            <Input
                                placeholder={'09012349876'}
                                value={basicUserInfo.phone ? basicUserInfo.phone : ''}
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
                                value={basicUserInfo.postcode ? basicUserInfo.postcode : ''}
                                onChange={this.handleFieldChanged("postcode")}
                            />
                            <Input
                                placeholder={'東京都千代田区丸の内1-2-3'}
                                value={basicUserInfo.address_1 ? basicUserInfo.address_1 : ''}
                                onChange={this.handleFieldChanged("address_1")}
                            />
                            <Input
                                placeholder={'皇居マンション 1002'}
                                value={basicUserInfo.address_2 ? basicUserInfo.address_2 : ''}
                                onChange={this.handleFieldChanged("address_2")}
                            />
                        </Form.Field>
                    </div>
                    <div className={'action-section'}>
                        <Button loading={loadingBasic}
                            onClick={() => this.handleAction('basic')}>
                            変更を保存
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

    renderSecondForm = () => {
        let { loadingFinancial, financialUserInfo } = this.state;

        const branchNameError = this.context.errorFor(this.state, 'branch_name', null, true);
        const accountNumberError = this.context.errorFor(this.state, 'account_number', null, true);
        const accountHolderError = this.context.errorFor(this.state, 'account_holder', null, true);
        const financialInstitutionNameError = this.context.errorFor(this.state, 'financial_institution_name', null, true);

        return (
            <div className='second-form'>
                <h2>基本情報</h2>
                <Form>
                    <div className={'fields-section'}>
                        <Form.Field className={'custom-width'}
                            required
                            error={!!financialInstitutionNameError}>
                            <Label>お支払い先金融機関</Label>
                            <Input
                                value={financialUserInfo.financial_institution_name ? financialUserInfo.financial_institution_name : ''}
                                onChange={this.handleFieldChanged("financial_institution_name", "financial")}
                            />
                        </Form.Field>

                        <Form.Field className={'custom-width'}
                            required
                            error={!!branchNameError}>
                            <Label>支店名</Label>
                            <Input
                                value={financialUserInfo.branch_name ? financialUserInfo.branch_name : ''}
                                onChange={this.handleFieldChanged("branch_name", "financial")}
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
                                    checked={financialUserInfo.account_type === 'savings'}
                                    onChange={this.handleFieldChanged("account_type", "financial")}
                                />
                                <Checkbox
                                    radio
                                    label='当座預金口座'
                                    name='checkboxRadioGroup4'
                                    value={'checking'}
                                    checked={financialUserInfo.account_type === 'checking'}
                                    onChange={this.handleFieldChanged("account_type", "financial")}
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Field required
                            error={!!accountNumberError}>
                            <Label>口座番号</Label>
                            <Input
                                placeholder={'1234567'}
                                value={financialUserInfo.account_number ? financialUserInfo.account_number : ''}
                                onChange={this.handleFieldChanged("account_number", "financial")}
                            />
                        </Form.Field>

                        <Form.Field required
                            error={!!accountHolderError}>
                            <Label>口座名義（カナ）</Label>
                            <Input
                                placeholder={'カ）サブスク'}
                                value={financialUserInfo.account_holder ? financialUserInfo.account_holder : ''}
                                onChange={this.handleFieldChanged("account_holder", "financial")}
                            />
                        </Form.Field>
                    </div>
                    <div className={'action-section'}>
                        <Button loading={loadingFinancial}
                            onClick={() => this.handleAction('financial')}>
                            変更を保存
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

    renderThirdForm = () => {
        let { deleteLoader } = this.state;

        return (
            <div className='third-form'>
                <h2>解約</h2>
                <div className='first-text'>
                    <p>事業登録情報について</p>
                    <span>個人情報規定ならびに弊社のセキュリティシステム上、退会後の事業<br />登録内容の確認はできなくなります。</span>
                </div>
                <div className='second-text'>
                    <p>サブスクサービスのご契約について</p>
                    <span>すべてのサービス利用者に対して解約処理を行います。各利用者へ対して、nichijoよりサービス停止の一括通知を行います。</span>
                </div>
                <div className={'action-section'}>
                    <Button
                        onClick={() => this.openDeleteAccountModal()}
                    >
                        上記すべてを了承し、退会する
                    </Button>
                </div>
            </div>
        )
    }

    render() {
        let { loadingBasic, loadingFinancial, basicUserInfo,
            financialUserInfo, loader, deleteLoader, innerWidth, activeIndex } = this.state;

        return (
            <div className={'update-account'}>
                {
                    loader ?
                        <Loader active={loader} />
                        :
                        innerWidth <= 768 ?
                            <div className='right-side'>
                                <Accordion fluid className='update-account-accordion'>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={this.handleClick}
                                    >
                                        基本情報
                                        <img src='/images/main-images/plus-black.svg' />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                        {this.renderFirstForm()}
                                    </Accordion.Content>
                                    <Accordion.Title
                                        active={activeIndex === 1}
                                        index={1}
                                        onClick={this.handleClick}
                                    >
                                        口座情報
                                        <img src='/images/main-images/plus-black.svg' />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 1}>
                                        {this.renderSecondForm()}
                                    </Accordion.Content>
                                    <Accordion.Title
                                        active={activeIndex === 2}
                                        index={2}
                                        onClick={this.handleClick}
                                    >
                                        解約
                                        <img src='/images/main-images/plus-black.svg' />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 2}>
                                        {this.renderThirdForm()}
                                    </Accordion.Content>
                                </Accordion>
                            </div>
                            :
                            <>
                                <div className='left-side'>
                                    <a>基本情報</a>
                                    <a>口座情報</a>
                                    <a>解約</a>
                                </div>
                                <div className='right-side'>
                                    {this.renderFirstForm()}
                                    {this.renderSecondForm()}
                                    {this.renderThirdForm()}
                                </div>

                            </>
                }
                <DeleteAccountModal ref={this.deleteAccountModalRef} props={this} />
            </div >
        );
    }
}
