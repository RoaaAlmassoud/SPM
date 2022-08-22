import React from 'react';
import PageApi from "../../../api/page-api"
import { Breadcrumb, Header, Loader, Button } from 'semantic-ui-react'
import Helper from "../../../../../utils/helper"
import Card from "../../../../card-component/card"

export default class WishList extends React.Component {

    constructor(props) {
        super(props);

        this.PageApi = new PageApi(this);
        let currentDate = new Date()
        this.state = {
            loading: true,
            services: [],
        }
    }

    async componentDidMount() {
        let { services } = this.state;
        const response = await this.PageApi.getWishList();
        
        this.setState({ loading: false });
        if (response.data) {
            if (response.data) {
                services = response.data.wishlist? response.data.wishlist.map((service) => {
                    return service.service
                }): []
            }
            this.setState({
                services: services
            })
        } else {
            this.props.props.notify(true, 'Error! Please try again!')
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    addService = () => {
        let { showAddService } = this.state;
        this.setState({
            showAddService: !showAddService
        }, () => {
            this.props.changeLastSection('サービス追加')
        })
    }

    render() {
        let { loading, subscribers_number, revenue, year, month, services, showAddService } = this.state;
        return (
            <div className={'wish-list'}>
                {
                    loading ?
                        <Loader active={loading} />
                        :
                        <div className={'my-services'}>
                            <h2>気になるリスト</h2>
                            <div className={'lists'}>
                                {
                                    services ?
                                        services.map((service) => {
                                            return <Card service={service} props={this.props.props} />
                                        })
                                        : null
                                }
                            </div>
                        </div>

                }

            </div>
        );
    }
}
