import React from 'react';
import './authentication-css.css';

import { Form, Divider, Breadcrumb, Input, Label, Checkbox, Button } from 'semantic-ui-react'


export default class Logout extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }

    }

    componentDidMount() {
        localStorage.clear();
    }

    clicked = () => {
        window.location = window.location.origin
    };

    changePage = (page) => {
        this.props.history.push(`/${page? page: ''}`)
    }
    render() {

        return (
            <div className={'register-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`ログアウト`}</Breadcrumb.Section>
                </Breadcrumb>
                <div className='description-section'>
                    <div className='header-text'>
                        <h1>ログアウト</h1>
                        <p className='first-text'>ログアウトしました。</p>
                        <p>別のアカウントでログインする場合は、以下リンクからログインをお願いします。</p>
                    </div>
                    <div className='action-section'>
                        <Button onClick={() => this.changePage('login')}>
                            ログイン
                        </Button>
                        <Button onClick={() => this.changePage()}>
                            トップページへ
                        </Button>
                    </div>
                </div>

            </div>
        );
    }


}