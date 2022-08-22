import React from 'react';
import PageApi from "../../../api/page-api"
import { Form, Header, Loader, Button, Input, Label, Dropdown, TextArea, Checkbox, Accordion, Menu } from 'semantic-ui-react'
import update from "immutability-helper";
import Helper from "../../../../../utils/helper"
import { ruleRunner, run } from "../../../../../utils/ruleRunner";
import { required, email } from "../../../../../utils/rules";
import AppContext from "../../../../../context/app-context";
import DeleteAccountModal from '../../delete-account-modal';

export default class UpdateUserAccount extends React.Component {

    static contextType = AppContext;

    fieldValidations = [
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
    constructor(props) {
        super(props);

        this.pageApi = new PageApi(this);
        this.deleteAccountModalRef = React.createRef()
        this.state = {
            validationErrors: {},
            showErrors: false,
            loading: false,
            loader: true,
            user: {
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
            },
            historyList: [],
            activeIndex: null,
            historyActiveIndex: 0,
            innerWidth: window.innerWidth
        }
    }

    validateState = () => {
        this.setState({ validationErrors: run(this.state.user, this.fieldValidations) });
    };

    async componentDidMount() {
        let { user, historyList } = this.state;
        const accountResponse = await this.pageApi.getUserAccount()
        if (accountResponse.data) {
            let user = accountResponse.data
            user.year = user.day_of_birth.split('-')[0]
            user.month = user.day_of_birth.split('-')[1]
            user.day = user.day_of_birth.split('-')[2]
            const subscriptionHistoryResponse = await this.pageApi.getSubscriptionHistory()
            if (subscriptionHistoryResponse.data) {
                historyList = !Helper.emptyString(subscriptionHistoryResponse.data.data) ? subscriptionHistoryResponse.data.data :
                    [{
                        date: '2021/8/25',
                        serviceName: '毎朝牛乳',
                        contract: 'ご契約'
                    },
                    {
                        date: '2021/8/25',
                        serviceName: '毎朝牛乳',
                        contract: 'ご契約'
                    },
                    {
                        date: '2021/8/25',
                        serviceName: '毎朝牛乳',
                        contract: 'ご契約'
                    },
                    {
                        date: '2021/8/25',
                        serviceName: '毎朝牛乳',
                        contract: 'ご契約'
                    }]
            }
            this.setState({
                user: user,
                loader: false,
                historyList: historyList
            }, this.validateState)
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    handleFieldChanged = (field) => {
        return (e, data) => {
            // let value = type === "number" ? parseFloat(data.value) :
            //     type === "check" ? data.checked : data.value
            let value = data.value

            this.setState({
                user: update(this.state.user, {
                    [field]: {
                        $set: value
                    }
                }),
            }, () => {
                this.validateState()
            })
        }

    }

    openDeleteAccountModal = () => {
        this.deleteAccountModalRef.current.show()
    }

    handleAction = async (formType) => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;

        let { user } = this.state
        this.setState({ loading: true })
        const response = await this.pageApi.updateUserAccount(user)

        this.setState({ loading: false })
        if (response.data) {
            this.props.props.notify(false, 'Updated successfully')
        } else {
            this.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    handleHistoryClick = (e, titleProps) => {
        const { index } = titleProps
        const { historyActiveIndex } = this.state
        const newIndex = historyActiveIndex === index ? -1 : index

        this.setState({ historyActiveIndex: newIndex })
    }

    renderFirstForm = () => {
        let { loading, user } = this.state;
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
            <div className='first-form'>
                <h2>基本情報</h2>
                <Form>
                    <div className={'fields-section'}>
                        <Label>氏名</Label>
                        <Form.Group widths={'equal'}>
                            <Form.Field required
                                error={!!surnameError}>
                                <Input
                                    placeholder={'姓'}
                                    value={user.surname ? user.surname : ''}
                                    onChange={this.handleFieldChanged("surname")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!nameError}>
                                <Input
                                    placeholder={'名'}
                                    value={user.name ? user.name : ''}
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
                                    value={user.last_name_kana ? user.last_name_kana : ''}
                                    onChange={this.handleFieldChanged("last_name_kana")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!nameKanaError}>
                                <Input
                                    placeholder={'メイ'}
                                    value={user.name_kana ? user.name_kana : ''}
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
                                    value={user.year ? user.year : ''}
                                    onChange={this.handleFieldChanged("year")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!monthError}>
                                <Input
                                    placeholder={'メイ(04)'}
                                    value={user.month ? user.month : ''}
                                    onChange={this.handleFieldChanged("month")}
                                />
                            </Form.Field>
                            <Form.Field required
                                error={!!dayError}>
                                <Input
                                    placeholder={'メイ(22)'}
                                    value={user.day ? user.day : ''}
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
                                    checked={user.gender === 'male'}
                                    onChange={this.handleFieldChanged("gender")}
                                />
                                <Checkbox
                                    radio
                                    label='女性'
                                    name='checkboxRadioGroup'
                                    value={'female'}
                                    checked={user.gender === 'female'}
                                    onChange={this.handleFieldChanged("gender")}
                                />
                                <Checkbox
                                    radio
                                    label='未回答'
                                    name='checkboxRadioGroup'
                                    value={'none'}
                                    checked={user.gender === 'none'}
                                    onChange={this.handleFieldChanged("gender")}
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Field required
                            error={!!emailError}>
                            <Label>メールアドレス</Label>
                            <Input
                                placeholder={'Sampke-email/@gmail.com'}
                                value={user.email ? user.email : ''}
                                onChange={this.handleFieldChanged("email")}
                            />
                        </Form.Field>
                        <Form.Field required
                            error={!!passwordError}>
                            <Label>パスワード</Label>
                            <Input
                                type={'password'}
                                placeholder={'10〜20文字の半角英数字'}
                                value={user.password ? user.password : ''}
                                onChange={this.handleFieldChanged("password")}
                            />
                        </Form.Field>
                        <Form.Field required
                            error={!!phoneError}>
                            <Label>電話番号（ハイフン無し）</Label>
                            <Input
                                placeholder={'09012349876'}
                                value={user.phone ? user.phone : ''}
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
                                value={user.postcode ? user.postcode : ''}
                                onChange={this.handleFieldChanged("postcode")}
                            />
                            <Input
                                placeholder={'東京都千代田区丸の内1-2-3'}
                                value={user.address_1 ? user.address_1 : ''}
                                onChange={this.handleFieldChanged("address_1")}
                            />
                            <Input
                                placeholder={'皇居マンション 1002'}
                                value={user.address_2 ? user.address_2 : ''}
                                onChange={this.handleFieldChanged("address_2")}
                            />
                        </Form.Field>
                    </div>
                    <div className={'action-section'}>
                        <Button loading={loading}
                            onClick={() => this.handleAction()}>
                            変更を保存
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

    renderSecondForm = () => {
        let { historyList, historyActiveIndex } = this.state;
        return (
            <div className='second-form'>
                <h2>利用履歴</h2>
                <Accordion as={Menu} vertical>
                    <Menu.Item>
                        <Accordion.Title
                            active={historyActiveIndex === 0}
                            content='利用履歴'
                            index={0}
                            onClick={this.handleHistoryClick}
                        >
                        </Accordion.Title>
                        <Accordion.Content active={historyActiveIndex === 0} >
                            {
                                historyList.map((item) => {
                                    return (
                                        <div className='item-list'>
                                            <span className='right-text'>{item.date}</span>
                                            <div className='left-text'>
                                                <span>
                                                    {item.serviceName}
                                                </span>
                                                <span>
                                                    {item.contract}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Accordion.Content>
                    </Menu.Item>
                </Accordion>
            </div>
        )
    }

    renderThirdForm = () => {
        return (
            <div className='third-form'>
                <h2>連携アカウント</h2>
                <div className={'register-options'}>
                    <img src={'/images/main-images/apple.svg'} />
                    <img src={'/images/main-images/twitter.svg'} />
                    <img src={'/images/main-images/google.svg'} />
                    <img src={'/images/main-images/facebook.svg'} />

                </div>

            </div>
        )
    }

    renderFourthForm = () => {
        return (
            <div className='third-form delete'>
                <h2>退会</h2>
                <div className='first-text'>
                    <p>会員登録情報について</p>
                    <span>個人情報規定ならびに弊社のセキュリティシステム上、退会後の会員<br />登録内容の確認はできなくなります。</span>
                </div>
                <div className='second-text'>
                    <p>ポイントについて</p>
                    <span>お持ちのポイントは無効となります。新しい会員登録へのポイントの<br />移行はできません。</span>
                </div>
                <div className='third-text'>
                    <p>サブスクサービスのご契約について</p>
                    <span>すべてのサービスの解約を行います。各サービスの規定に従い、最終<br />利用料は発生します。</span>
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

handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
}

render() {
    let { loader, innerWidth, activeIndex } = this.state;


    return (
        <div className={'update-account user'}>
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
                                    利用履歴
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
                                    連携アカウント
                                    <img src='/images/main-images/plus-black.svg' />
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 2}>
                                    {this.renderThirdForm()}
                                </Accordion.Content>
                                <Accordion.Title
                                    active={activeIndex === 3}
                                    index={3}
                                    onClick={this.handleClick}
                                >
                                    退会
                                    <img src='/images/main-images/plus-black.svg' />
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === 3}>
                                    {this.renderFourthForm()}
                                </Accordion.Content>
                            </Accordion>
                        </div>
                        :
                        <>
                            <div className='left-side'>
                                <a>基本情報</a>
                                <a>ポイント</a>
                                <a>利用履歴</a>
                                <a>連携アカウント</a>
                                <a>退会</a>
                            </div>
                            <div className='right-side'>
                                {this.renderFirstForm()}
                                {this.renderSecondForm()}
                                {this.renderThirdForm()}
                                {this.renderFourthForm()}
                            </div>
                        </>

            }
            <DeleteAccountModal ref={this.deleteAccountModalRef} props={this} />
        </div >
    );
}
}
