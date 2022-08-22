import React from 'react';
import "./card-css.css"
import ServiceApi from "../service-details-component/api/service-api"
import { Header } from 'semantic-ui-react'
import Helper from "../../utils/helper"
import DeleteSeriveProviderModal from '../my-page-component/src/page-componenets/provider-coponents/delete-service-provider-modal';

export default class Card extends React.Component {

    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        this.deleteSeriveProviderModal = React.createRef()
        this.state = {
            service: props ? props.service ? props.service : {} : {}
        }
    }

    openServiceDetails = () => {
        this.props.props.history.push(`/${this.props.service.id}`)
        window.location.reload(true)
    }

    addToWishtList = async () => {
        let { service } = this.state;
        const response = service.added_to_wishlist ? await this.serviceApi.deleteFromWishList({ id: service.id }) :
            await this.serviceApi.addToWishList({ service_id: service.id })
        if (response.data) {
            service.added_to_wishlist = !service.added_to_wishlist
        }
        this.setState({
            service: service
        })
    }

    openDeleteServiceModal = (service) => {
        this.deleteSeriveProviderModal.current.show(service);
    }


    render() {
        let service = this.props.service;
        if (!Helper.emptyString(service)) {
            return (
                <div className={'card'}
                >
                    <img className={'service-image'}
                        onClick={() => this.openServiceDetails()}
                        src={`https://bonzuttner.xsrv.jp/spm-back/storage/${service.image}`} />
                    <div className={'actions'}>
                        {
                            this.props.edit ?
                                <p className={'edit'} onClick={() => this.props.addService(service.id)} >編集する</p>
                                :
                                <img className={'like-image'} onClick={() => this.addToWishtList()}
                                    src={service.added_to_wishlist ? '/images/main-images/liked.svg' : '/images/main-images/like.svg'} />
                        }
                        {
                            this.props.remove ?
                                <img className={'like-image'} onClick={() => this.openDeleteServiceModal(service)}
                                    src={'/images/main-images/remove.svg'} />
                                :
                                <img className={'plus-image'} src={'/images/main-images/plus.svg'} />
                        }
                    </div>
                    <div className={"description-section"}>
                        <Header as={'h4'}>
                            {service.name}
                        </Header>
                        <p>
                            {service.overview}
                        </p>
                    </div>
                    <div className={"price-section"}>
                        <Header as={'h3'}>
                            {`¥${service.price}/月`}
                        </Header>
                    </div>
                    <DeleteSeriveProviderModal ref={this.deleteSeriveProviderModal} props={this} />

                </div>
            );
        } else {
            return null;
        }

    }
}
