import React from 'react';
import ServiceApi from "../api/service-api"
import {Breadcrumb, Header, Loader, Button} from 'semantic-ui-react'
import Helper from "../../../utils/helper"
import "../style/service-css.css"
import Card from "../../card-component/card"

export default class ServiceDetails extends React.Component {

    constructor(props) {
        super(props);
        this.serviceApi = new ServiceApi(this);
        this.serviceId = this.props ? this.props.match.params.id : '';
        this.state = {
            loading: true,
            service: {},
            related_services: []
            // service: props? props.service? props.service.service: {}: {}
        }
    }

    async componentDidMount() {
        const response = await this.serviceApi.getServiceDetails({id: this.serviceId});
        this.setState({loading: false});
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

    render() {
        let {loading, related_services, service} = this.state;
        return (
            <div className={'service-details-page'}>
                {
                    loading ?
                        <Loader active={loading}/>
                        :
                        !Helper.isEmpty(service) ?
                            <>
                                <Breadcrumb>
                                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron'/>
                                    <Breadcrumb.Section
                                        active>{service.categories[0].name}</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron'/>
                                    <Breadcrumb.Section active>{service.name}</Breadcrumb.Section>
                                </Breadcrumb>
                                <div className={'service-details'}>
                                    <div className={'image-section'}>
                                        <img className={'first-img'}
                                             src={`https://backend-nichijo.s-pm.co.jp/storage/${service.image}`}/>
                                        <Button className={'category-btn'}>{service.categories[0].name}</Button>
                                        <div className={'like-section'}>
                                            <img src={'/images/main-images/like.svg'}/>
                                            <Button>登録する</Button>
                                        </div>
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
                                                                <img src={'/images/main-images/check.svg'}/>
                                                                <p>{point}</p>
                                                            </div>
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className={'images'}>
                                            <img className={'first-img'}
                                                 src={`https://backend-nichijo.s-pm.co.jp/storage/${service.image}`}/>
                                            <div className={'small-images'}>
                                                {
                                                    service.images ?
                                                        service.images.map((img) => {
                                                            return <img
                                                                src={`https://backend-nichijo.s-pm.co.jp/storage/${img}`}/>
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className={'introduction-section'}>
                                            <p>{service.introduction}</p>
                                            <a target={'_blank'} href={service.url}>
                                                {`${service.name} のサイトへ`}
                                                <img src={'/images/main-images/url.svg'}/>
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
                                            <Button>このサービスへ登録する</Button>
                                        </div>
                                        <div className={'border'}></div>
                                        <div className={'related-services'}>
                                            <h2>同じカテゴリーのサービス</h2>
                                            <div className={'lists'}>
                                                {
                                                    related_services ?
                                                        related_services.map((relatedService) => {
                                                            return <Card service={relatedService} props={this.props}/>
                                                        })
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                            : null
                }

            </div>
        );
    }
}
