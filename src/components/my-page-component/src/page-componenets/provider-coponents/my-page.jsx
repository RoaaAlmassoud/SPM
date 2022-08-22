import React from 'react';
import PageApi from "../../../api/page-api"
import { Breadcrumb, Header, Loader, Button } from 'semantic-ui-react'
import Helper from "../../../../../utils/helper"
import Card from "../../../../card-component/card"
import AddService from './add-service'

export default class MyPage extends React.Component {

    constructor(props) {
        super(props);

        this.PageApi = new PageApi(this);
        
        let currentDate = new Date()
        this.state = {
            year: currentDate.getFullYear(),
            month: ("0" + (currentDate.getMonth() + 1)).slice(-2),
            loading: true,
            revenue: 0,
            subscribers_number: 0,
            services: [],
            showAddService: false,
            innerWidth: window.innerWidth
        }
    }

    async componentDidMount() {
        let { year, month, services, subscribers_number, revenue } = this.state;
        let body = {
            year: year,
            month: month
        }
        const response = await this.PageApi.getRevenue(body);
        if (response.data) {
            subscribers_number = response.data.subscribers_number;
            revenue = response.data.revenue
            const myServicesResponse = await this.PageApi.getMyServices()
            this.setState({ loading: false });
            if (myServicesResponse.data) {
                services = myServicesResponse.data.services
            }
            this.setState({
                subscribers_number: subscribers_number,
                revenue: revenue,
                services: services
            })
        } else {
            this.props.props.notify(true, 'Error! Please try again!')
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    addService = (id="") => {
        let { showAddService } = this.state;
        this.setState({
            showAddService: !showAddService,
            id: id
        }, () => {
            this.props.changeLastSection('サービス追加')
        })
    }

    refresh = () => {
        window.location.reload();
    }

    render() {
        let { loading, subscribers_number, revenue, year,
            month, services, showAddService, innerWidth } = this.state;
        return (
            <div className={'my-page'}>
                {
                    loading ?
                        <Loader active={loading} />
                        :
                        showAddService ?
                            <AddService props={this.props.props} id={this.state.id} />
                            :
                            <div className={'page-details'}>
                                <div className={'page-numbers'}>
                                    <p className='first-text'>ご入金予定
                                        {
                                            innerWidth <= 768 ?
                                                <p className='date-mobile'>
                                                    <span>{'<'}</span>
                                                    <span>{`${year}.${month}`}</span>
                                                    <span>{'>'}</span>
                                                </p>
                                                :
                                                <>
                                                    <span>{'<'}</span>
                                                    <span>{`${year}.${month}`}</span>
                                                    <span>{'>'}</span>
                                                </>
                                        }

                                    </p>
                                    <div className='numbers-section'>
                                        {
                                            innerWidth <= 768 ?
                                                <>
                                                    <div className='text-mobile'>
                                                        <p>今月の合計</p>
                                                        <p>{`¥${revenue}`}</p>
                                                    </div>
                                                    <div className='text-mobile'>
                                                        <p>利用者数の合計</p>
                                                        <p>{`${subscribers_number}人`}</p>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p>今月の合計
                                                        <span>{`¥${revenue}`}</span>
                                                    </p>
                                                    <p>利用者数の合計
                                                        <span>{`${subscribers_number}人`}</span>
                                                    </p>
                                                </>
                                        }

                                    </div>
                                </div>
                                <div className={'add-service-section'}>
                                    <Button onClick={() => this.addService()}><p><span>+</span> サービスを追加</p></Button>
                                </div>
                                <div className={'my-services'}>
                                    <h2>提供中のサービス</h2>
                                    <div className={'lists'}>
                                        {
                                            services ?
                                                services.map((service) => {
                                                    return <Card service={service} props={this.props.props} edit={true}
                                                    remove={true} addService={this.addService} refresh={this.refresh}/>
                                                })
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                }

            </div>
        );
    }
}
