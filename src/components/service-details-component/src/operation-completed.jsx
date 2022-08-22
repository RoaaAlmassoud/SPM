import React from 'react';
import ServiceApi from "../api/service-api"
import { Breadcrumb, Header, Loader, Button } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"
import AppContext from "../../../context/app-context";

export default class OperationCompleted extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    goToService = () => {
        if(this.context.service){
            this.props.history.push(`/${this.context.service.id}`)
        }
    }

    render() {
        let { loading, related_services, service, loader } = this.state;
        return (
            <div className={'operation-completed-page'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>サービス一覧</Breadcrumb.Section>
                </Breadcrumb>

                <div className='text-section'>
                    <img src='/images/main-images/check-circle.svg' />
                    <h1>ご契約が完了しました</h1>
                    <div className='border-section'>
                        <h2>{this.context? this.context.service? this.context.service.name: '': ''}</h2>
                        <p onClick={() => this.goToService()}>サービス詳細</p>
                    </div>
                    <Button onClick={() => this.props.history.push('/my-page')}>マイページへ</Button>
                </div>
            </div>
        );
    }
}
