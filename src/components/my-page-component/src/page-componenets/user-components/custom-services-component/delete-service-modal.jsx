import React from 'react';
import PageApi from "../../../../api/page-api"
import { Grid, Label, Loader, Button, Modal } from 'semantic-ui-react'

export default class DeleteSeriveModal extends React.Component {

    constructor(props) {
        super(props);
        this.pageApi = new PageApi(this);
        this.state = {
            loading: false
        }
    }

    show = (service) => {
        this.setState({
            open: true,
            service: service
        })
    };

    hide = () => {
        this.setState({
            open: false
        })
    };

    delete = async () => {
        this.setState({ loading: true })
        const { service } = this.state;
        const response = await this.pageApi.deleteExternalService({ id: service.id })
        this.setState({ loading: false })
        if (response.data) {
            this.props.getCustomServices()
            this.setState({ open: false })
            this.props.props.props.props.notify(false, 'Deleted successfully')
        } else {
            this.props.props.props.props.notify(true, response.message? response.message: 'Error! please try again!')
        }
    }

    render() {
        let { loading } = this.state;
        return (
            <Modal
                className={'delete-service-modal'}
                // dimmer={'inverted'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <p className={'header-text'}>サービスを削除しますか？</p>
                    <div className={'actions-section'}>
                        <Button
                            onClick={() => this.hide()}
                        >
                            削除をキャンセル
                        </Button>
                        <Button loading={loading}
                            onClick={() => this.delete()}
                        >
                            このまま削除する
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}