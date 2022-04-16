import React from 'react';
import './top-page-css.css'
import TopApi from "../api/top-api"
import Helper from "../../../utils/helper"
import Card from "../../card-component/card"
import {Header, Loader} from 'semantic-ui-react'
import Slider from "react-slick"

export default class TopPage extends React.Component {

    constructor(props) {
        super(props);
        this.topApi = new TopApi(this);
        this.state = {
            latestServices: [],
            mainCategories: [],
            loading: true
        }

    }

    async componentDidMount() {
        const response = await this.topApi.getHomePage({})
        console.log('response in top: ', response)
        if (response.data) {
            let latestServices = response.data.latest_services
            let mainCategories = response.data.main_categories
            this.setState({
                latestServices: latestServices,
                mainCategories: mainCategories,
                loading: false
            })
        }
    }

    renderCards = (services) => {

        const settings = {
            dots: false,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,

            autoplay: false,
            draggable: true,
        };
        let cards = []
        services.map((service) => {
            cards.push(<Card service={service}/>)
        })

        return (
            <Slider {...settings}>
                {cards}
            </Slider>
        )
    }

    render() {
        let {latestServices, mainCategories, loading} = this.state;

        return (
            <div className={'top-page'}>
                <Loader active={loading}/>
                {
                    !Helper.emptyString(latestServices) ?
                        <div className={'latest-services'}>
                            <div className={'latest-services-header'}>
                                <Header as={'h2'}>
                                    すべてのサブスク新着一覧
                                </Header>
                                <Header as={'h4'} className={'show-more'}>
                                    すべてを見る
                                </Header>
                            </div>
                            <div className={'cards-list'}>
                                {this.renderCards(latestServices)}
                            </div>
                        </div>
                        : null
                }
                {
                    !Helper.emptyString(mainCategories) ?
                        <div className={'main-categories'}>
                            {
                                mainCategories.map((category) => {
                                    return (
                                        <div className={'one-category'}>
                                            <div className={'category-header'}>
                                                <img src={"/images/main-images/movie_category.svg"}/>
                                                <Header as={'h2'}>
                                                    {category.category_name}
                                                </Header>
                                                <Header as={'h4'} className={'show-more'}>
                                                    すべてを見る
                                                </Header>
                                            </div>
                                            {
                                                category.services ?
                                                    <div className={'cards-list'}>
                                                        {this.renderCards(category.services)}
                                                    </div>
                                                    : null
                                            }
                                        </div>)
                                })
                            }
                        </div>
                        : null
                }

            </div>
        );
    }


}