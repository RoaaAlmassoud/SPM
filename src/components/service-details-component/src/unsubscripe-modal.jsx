import React from 'react';
import ServiceApi from "../api/service-api"
import { Modal, Button, Accordion, Menu } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"

export default class UnsubscripeModal extends React.Component {

    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        this.subscripeModalRef = React.createRef();
        this.state = {
            open: false,
            activeIndex: 0,
            loader: false
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
            open: false,
        })
    };

    openSubscripeModal = () => {
        this.subscripeModalRef.current.show(this.state.service.id);
    }


    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    unsubscripe = async () => {
        this.setState({ loader: true })
        let { service } = this.state;
        const response = await this.serviceApi.unsubscripe({ id: service.id })
        this.setState({ loader: false })
        if (response.data) {
            this.props.props.props.notify(false, 'Operation completed successfully!')
        } else {
            this.props.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { service, activeIndex, loader } = this.state;
        return (
            <Modal
                className={'subscribe-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='header-section'>
                        <p className={'header-text'}>このサービスを解約いたしますか</p>
                        <p>サービス名称</p>
                        <p>{service ? service.name : ''}</p>
                    </div>
                    <Accordion as={Menu} vertical>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeIndex === 0}
                                content='サービスのご契約について'
                                index={0}
                                onClick={this.handleClick}
                            >
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0} >
                                {
                                    service ? service.contract_policy : ''
                                }
                            </Accordion.Content>
                        </Menu.Item>
                    </Accordion>
                    <div className={'action-section unsubscripe'}>
                        <div className='btns-section'>
                            <Button
                                onClick={() => this.hide()}>
                                解約をキャンセル
                            </Button>
                            <Button
                                loading={loader}
                                onClick={() => this.unsubscripe()}>
                                このまま解約する
                            </Button>
                        </div>

                        <p onClick={() => this.hide()}>前の画面に戻る</p>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}