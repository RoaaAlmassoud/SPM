import React from 'react';
import PageApi from "../api/page-api"
import { Modal, Button, Form, Input, Label } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import './page-css.css'

export default class DeleteAccountModal extends React.Component {

    constructor(props) {
        super(props);
        this.pageApi = new PageApi(this);

        this.state = {
            open: false,
            loading: false,

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

    deleteUser = async () => {
        this.setState({ loading: true })
        const response = localStorage.getItem('user_type') === 'user' ? await this.pageApi.deleteUser({})
            : await this.pageApi.deleteProvider({});
        this.setState({ loading: false })
        if (response.data) {
            localStorage.clear()
            this.props.props.props.props.notify(false, 'Operation completed successfully!')
            this.props.props.props.props.history.push('/delete-completed')
        } else {
            this.props.props.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { loading } = this.state;
        return (
            <Modal
                className={'delete-account-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='header-section'>
                        <p className={'header-text'}>注意事項をよく読み、<br />本当に退会いたしますか？</p>
                    </div>

                    <div className={'action-section'}>
                        <Button className='primary'
                            onClick={() => this.hide()}>
                            退会をキャンセル
                        </Button>
                        <Button className='secondary'
                            loading={loading}
                            onClick={() => this.deleteUser()}>
                            このまま退会する
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}