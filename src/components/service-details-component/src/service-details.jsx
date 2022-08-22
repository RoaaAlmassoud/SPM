import React from 'react';
import ServiceApi from "../api/service-api"
import { Breadcrumb, Header, Loader, Button } from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"
import Card from "../../card-component/card"
import ContractModal from './contract-modal';
import UnsubscripeModal from './unsubscripe-modal';

export default class ServiceDetails extends React.Component {

    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        this.serviceId = this.props ? this.props.match.params.id : '';
        this.contractModalRef = React.createRef();
        this.unsubscripeModalRef = React.createRef();
        this.state = {
            loading: true,
            service: {},
            related_services: [],
            loader: false
            // service: props? props.service? props.service.service: {}: {}
        }
    }

    async componentDidMount() {
        const response = await this.serviceApi.getServiceDetails({ id: this.serviceId });
        this.setState({ loading: false });
        if (response.data) {
            let relatedServices = response.data.related_services ? response.data.related_services : [];
            let service = response.data.service ? response.data.service : {};
            this.setState({
                related_services: relatedServices,
                service: service
            })
        } else {
            this.props.notify(true, 'Error! Please try again!')
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };


    openContractModal = () => {
        this.contractModalRef.current.show(this.state.service);
    }

    openUnsubsripeModal = () => {
        this.unsubscripeModalRef.current.show(this.state.service);
    }

    addToWishtList = async () => {
        let { service } = this.state;
        const response = service.added_to_wishlist ? await this.serviceApi.deleteFromWishList({ id: this.serviceId }) :
            await this.serviceApi.addToWishList({ service_id: this.serviceId })
        if (response.data) {
            service.added_to_wishlist = !service.added_to_wishlist
        }
        this.setState({
            service: service
        })
    }

    render() {
        let { loading, related_services, service, loader } = this.state;
        let user = localStorage.getItem('api_token')
        return (
            <div className={'service-details-page'}>
                {
                    loading ?
                        <Loader active={loading} />
                        :
                        !Helper.isEmpty(service) ?
                            <>
                                <Breadcrumb>
                                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section
                                        active>{service.categories[0].name}</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section active>{service.name}</Breadcrumb.Section>
                                </Breadcrumb>
                                <div className={'service-details'}>
                                    <div className={'image-section'}>
                                        <img className={'first-img'}
                                            src={`https://bonzuttner.xsrv.jp/spm-back/storage/${service.image}`} />
                                        <Button className={'category-btn'}>{service.categories[0].name}</Button>
                                        {
                                            localStorage.getItem('user_type') ?
                                                localStorage.getItem('user_type') === 'user' && service.type === 'general'?
                                                    <div className={'like-section'}>
                                                        <img
                                                            onClick={() => this.addToWishtList()}
                                                            src={service.added_to_wishlist ? '/images/main-images/liked.svg' : '/images/main-images/like.svg'} />
                                                        <Button>登録する</Button>
                                                    </div>
                                                    : null
                                                : null
                                        }

                                    </div>
                                    <div className={'details-section'}>
                                        <div className={'name'}>
                                            <h1>{service.name}</h1>
                                            <p>{service.categories[0].name}</p>
                                            <div className={'price'}>
                                                <Button>{`¥${service.price}`}</Button>
                                                <Button>{`${service.plan_type}`}</Button>
                                            </div>
                                        </div>
                                        <div className={'points-section'}>
                                            <h3>3つのポイント</h3>
                                            <div className={'points-list'}>
                                                {
                                                    service.three_points ?
                                                        service.three_points.map((point) => {
                                                            return <div className={'single-point'}>
                                                                <img src={'/images/main-images/check.svg'} />
                                                                <p>{point}</p>
                                                            </div>
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className={'images'}>
                                            <img className={'first-img'}
                                                src={`https://bonzuttner.xsrv.jp/spm-back/storage/${service.image}`} />
                                            <div className={'small-images'}>
                                                {
                                                    service.images ?
                                                        service.images.map((img) => {
                                                            return <img
                                                                src={`https://bonzuttner.xsrv.jp/spm-back/storage/${img}`} />
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className={'introduction-section'}>
                                            <p>{service.introduction}</p>
                                            <a target={'_blank'} href={service.url}>
                                                {`${service.name} のサイトへ`}
                                                <img src={'/images/main-images/url.svg'} />
                                            </a>
                                        </div>
                                        <div className={'custom-list'}>
                                            {
                                                service.custom ?
                                                    service.custom.map((oneObject) => {
                                                        return <div className={'single-custom-item'}>
                                                            <h3>{oneObject.key}</h3>
                                                            <p>{oneObject.value}</p>
                                                        </div>
                                                    })
                                                    : null
                                            }
                                            {
                                                user && !service.is_subscribed && service.type === 'general'?
                                                    <Button loading={loader}
                                                        onClick={() => this.openContractModal()}
                                                    //onClick={() => this.openUnsubsripeModal()}
                                                    >このサービスへ登録する</Button>
                                                    : null
                                            }

                                        </div>
                                        <div className={'border'}></div>
                                        <div className={'related-services'}>
                                            <h2>同じカテゴリーのサービス</h2>
                                            <div className={'lists'}>
                                                {
                                                    related_services ?
                                                        related_services.map((relatedService) => {
                                                            return <Card service={relatedService} props={this.props} />
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <ContractModal ref={this.contractModalRef} props={this} />
                                <UnsubscripeModal ref={this.unsubscripeModalRef} props={this} />
                            </>
                            : null
                }

            </div>
        );
    }
}
