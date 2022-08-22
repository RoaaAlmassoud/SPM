import React from 'react';
import AppContext from "../../../context/app-context";
import './authentication-css.css';

import { Form, Divider, Breadcrumb, Input, Label, Checkbox, Button } from 'semantic-ui-react'


export default class RegistrationCompleted extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            userType: props.location ?
                props.location.state.userType ? props.location.state.userType : '' : '',
            innerWidth: window.innerWidth,
        }

    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        this.changeInnerWidth();
    }

    componentDidMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    clicked = () => {
        window.location = window.location.origin
    };

    changePage = (page) => {
        this.props.history.push(`/${page ? page : ''}`)
    }

    render() {
        let { userType, innerWidth } = this.state;

        return (
            <div className={'register-container completed'}>
                {
                    userType ?
                        <>
                            <Breadcrumb>
                                <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section active>{userType === 'user' ? 'ユーザー登録完了' : 'プロバイダー登録完了'}</Breadcrumb.Section>
                            </Breadcrumb>

                            <div className='description-section'>
                                <div className='header-text'>
                                    <h1>{userType === 'user' ? 'ユーザー登録完了' : 'プロバイダー登録完了'}</h1>

                                </div>
                                <div className='first-section'>
                                    {
                                        innerWidth <= 500 ?
                                            <>
                                                <p className='first-text'>{userType === 'user' ?
                                                    <span>ユーザー登録いただき、<br />ありがとうございます。</span> :
                                                    <span>プロバイダー登録いただき、<br />ありがとうございます。</span>}</p>
                                                <p>入力いただいたメールアドレスに<br />登録完了メールをお送りしました。</p>
                                                <p>メールに記載のURLをクリックし、<br />登録の承認をおこなって下さい。</p>
                                            </>
                                            :
                                            <>
                                                <p className='first-text'>{userType === 'user' ?
                                                    'ユーザー登録いただき、<br/>ありがとうございます。' : 'プロバイダー登録いただき、ありがとうございます。'}</p>
                                                <p>入力いただいたメールアドレスに登録完了メールをお送りしました。</p>
                                                <p>メールに記載のURLをクリックし、登録の承認をおこなって下さい。</p>
                                            </>
                                    }
                                </div>

                                <div className='second-section'>
                                    {
                                        innerWidth <= 500 ?
                                            <>
                                                <p className='first-text'>本メールは info@nichijo.s-pm.co.jp から<br />お送りしております。</p>
                                                <p>万が一メールが届いていない場合、<br />「迷惑メール」フォルダをご確認ください。</p>
                                                <p>メールの確認が取れない場合、<span onClick={() => this.changePage('inquiry')}>お問い合わせフォーム</span><br />より
                                                    お名前とお電話番号をお送りいただけますよう<br />お願い申し上げます。</p>
                                            </>
                                            :
                                            <>
                                                <p className='first-text'>本メールは info@nichijo.s-pm.co.jp からお送りしております。</p>
                                                <p>万が一メールが届いていない場合、「迷惑メール」フォルダをご確認ください。</p>
                                                <p>メールの確認が取れない場合、<span onClick={() => this.changePage('inquiry')}>お問い合わせフォーム</span>より</p>
                                                <p>お名前とお電話番号をお送りいただけますようお願い申し上げます。</p>
                                            </>
                                    }
                                </div>
                                <div className='action-section'>
                                    <Button onClick={() => this.changePage()}>
                                        トップページへ
                                    </Button>
                                </div>
                            </div >
                        </>
                        : null
                }


            </div>
        );
    }


}