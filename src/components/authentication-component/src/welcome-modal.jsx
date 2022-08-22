import React from 'react';
import { Button, Form, Modal, TextArea } from 'semantic-ui-react'
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import { ruleRunner, run } from "../../../utils/ruleRunner";
import { required, email } from "../../../utils/rules";
import update from "immutability-helper";
import Helper from "../../../utils/helper";

export default class WelcomeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }
    show = () => {
        this.setState({
            open: true
        })
    };

    hide = () => {
        this.setState({
            open: false,
        })
    };

    render() {

        return (
            <Modal
                className={'welcome-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='main'>
                        <img src='/images/main-images/right-image.svg' />
                        <div className='content-section'>
                            <h1 className={'header-text'}>ご登録ありがとうございます！</h1>
                            <div className='text-section'>
                                <p>会員登録の受付が完了いたしました。</p>
                                <p>まずはご利用中のサービスを</p>
                                <p>登録してみましょう！</p>
                            </div>
                            <div className={'action-section'}>
                                <Button
                                    onClick={() => this.hide()}>
                                    利用中サービスを登録する
                                </Button>
                                <p onClick={() => this.hide()}>マイページへ</p>
                            </div>
                        </div>
                        <img src='/images/main-images/left-image.svg' />
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}