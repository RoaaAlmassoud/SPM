import React from 'react';
import ServiceApi from "../api/service-api"
import { Modal, Button, Accordion, Menu } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"
import SubscripeModal from './subscripe-modal';

export default class ContractModal extends React.Component {

    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        this.subscripeModalRef = React.createRef();
        this.state = {
            open: false,
            activeIndex: 0
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

    render() {
        let { service, activeIndex } = this.state;
        return (
            <Modal
                className={'subscribe-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='header-section'>
                        <p className={'header-text'}>このサービスに登録を申し込んでよろしいですか？</p>
                        <p>サービス名称</p>
                        <p>{service? service.name: ''}</p>
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
                                   service? service.contract_policy: ''
                                }
                            </Accordion.Content>
                        </Menu.Item>
                    </Accordion>
                    <div className={'action-section'}>
                        <Button 
                            onClick={() => this.openSubscripeModal()}>
                            契約内容に同意する
                        </Button>
                        <p onClick={() => this.hide()}>前の画面に戻る</p>
                    </div>
                </Modal.Content>
                <SubscripeModal ref={this.subscripeModalRef} props={this} service={service}/>
            </Modal>
        );
    }


}