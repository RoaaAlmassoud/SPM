import React from 'react';
import AppContext from "../../../context/app-context";
import './page-css.css';

import { Form, Divider, Breadcrumb, Input, Label, Checkbox, Button } from 'semantic-ui-react'


export default class DeleteCompleted extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            innerWidth: window.innerWidth,
        }

    }

    clicked = () => {
        window.location = window.location.origin
    };

    changePage = (page) => {
        this.props.history.push(`/${page ? page : ''}`)
    }

    render() {

        return (
            <div className={'register-container delete completed'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{'ユーザー退会完了'}</Breadcrumb.Section>
                </Breadcrumb>

                <div className='description-section'>
                    <div className='header-text'>
                        <h1>{'退会完了'}</h1>
                    </div>
                    <div className='first-section'>
                        <p>ご利用いただき、ありがとうございました。</p>
                        <p>またのご利用を心よりお待ちしております。</p>
                    </div>
                    <div className='action-section'>
                        <Button className='secondary' onClick={() => this.changePage()}>
                            トップページへ
                        </Button>
                    </div>
                </div >
            </div>
        );
    }


}