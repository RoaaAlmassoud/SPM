import React from 'react';
import './top-page-css.css'
import TopApi from "../api/top-api"
import Helper from "../../../utils/helper"
import Card from "../../card-component/card"
import {Header, Loader, Breadcrumb, Icon, Label} from 'semantic-ui-react'
import Slider from "react-slick"

export default class TopPage extends React.Component {

    constructor(props) {
        super(props);
        console.log('props: ', props)
        this.topApi = new TopApi(this);
        let name = props.location.state ? this.props.location.state.name ? this.props.location.state.name : '' : '';
        let categories = props.location.state ? this.props.location.state.categories ? this.props.location.state.categories : '' : '';
        let fullFilteredCats = props.location.state ? this.props.location.state.fullFilteredCats ? this.props.location.state.fullFilteredCats : '' : '';
        this.state = {
            latestServices: [],
            mainCategories: [],
            searchServices: [],
            name: name,
            categories: categories.toString(),
            categoriesList: fullFilteredCats,
            loading: true,
            showSearchResponse: false
        }

    }

    getServices = async () => {
        let {name, categories, categoriesList} = this.state;
        this.setState({loading: true});
        if (!Helper.emptyString(categoriesList) || !Helper.emptyString(name)) {
            let categoriesText = '';
            if(categoriesList.length === 1){
                categoriesText = categoriesList[0].id
            } else {
                if(!Helper.emptyString(categoriesList)){
                    categoriesList.map((cat) => {
                        categoriesText = categoriesText? `${categoriesText},${cat.id}`: cat.id;
                    })
                }
            }
            let body = {
                name: name,
                categories: categoriesText,
                page: 1,
                page_size: 10
            };

            const sections = [
                {key: 'Top', content: 'Top', link: true},
                {key: 'サービス一覧', content: 'サービス一覧', active: true},
            ];
            const response = await this.topApi.searchService(body)
            if (response.data) {
                this.setState({
                    loading: false,
                    showSearchResponse: true,
                    searchServices: response.data.services ? response.data.services : [],
                    sections: sections,
                    latestServices: [],
                    mainCategories: [],
                })
            }
        } else {
            const response = await this.topApi.getHomePage({})
            if (response.data) {
                let latestServices = response.data.latest_services;
                let mainCategories = response.data.main_categories;
                this.setState({
                    latestServices: latestServices,
                    mainCategories: mainCategories,
                    searchServices: [],
                    loading: false
                }, () => {
                    this.props.location.state = {
                        name: name,
                        categoriesList: categoriesList,
                        showAbout: true
                    };
                })
            }
        }
    };

    componentDidMount() {
        this.getServices()
        window.addEventListener('resize', this.changeInnerWidth);
    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        this.changeInnerWidth();
    }

    renderCards = (services, withoutSlider = false) => {
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
            cards.push(<Card service={service} props={this.props}/>)
        });

        return (

        //    withoutSlider ?
                <div className={`${withoutSlider? '':'with-slider'}`}>
                    {cards}
                </div> 
                //  :
                //  <Slider {...settings}>
                //     {cards}
                //  </Slider>


        )
    };

    clicked = () => {
        window.location.reload(true)
    };

    removeCategory = (category) => {
        let {categoriesList, name} = this.state;
        categoriesList = categoriesList.filter(a => a.id  !== category.id);
        this.setState({
            categoriesList: categoriesList
        }, () => {
            this.props.location.state = {
                name: name,
                fullFilteredCats: categoriesList
            };
            if(Helper.emptyString(name) && Helper.emptyString(categoriesList)){
                window.location.reload(true)
            } else {
                this.getServices()
            }
        })
    };

    renderFilteredCategories = () => {
        const {categories, categoriesList} = this.state;
        let list = [];
        categoriesList.map((category, index) => {
            list.push(
                <Label className={`${index === 0 ? 'first' : ''}`}>
                    {category.name}
                    <img
                        src={"/images/main-images/close.svg"}
                        onClick={() => this.removeCategory(category)}
                    />
                </Label>
            )
        });

        return (
            <div className={'filtered-categories'}>
                <Icon name={'filter'} size={'big'}/>
                {list}
            </div>
        )
    };

    aboutPage = () => {
        this.props.history.push('/about')
    }

    render() {
        let {latestServices, mainCategories, loading, searchServices, categories, categoriesList, name} = this.state;
        return (
            <div className={'top-page'}>
                {
                    (Helper.emptyString(categoriesList) && Helper.emptyString(name)) ?
                        <div className={`${window.innerWidth <= 765 ?'mobile': ''} about-section`}>
                            {
                                window.innerWidth <= 765 ?
                                    <>
                                        <div className={'text-section'}>
                                            <p>サブスク管理をもっと快適に</p>
                                        </div>
                                        <div className={'image-section'}>
                                            <img src={'/images/main-images/categories-mobile.svg'}/>
                                            <img src={'/images/main-images/about-mobile.svg'}
                                            onClick={() => this.aboutPage()}/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={'text-section'}>
                                            <p>サブスク管理を</p>
                                            <p>もっと快適に</p>
                                            <img 
                                            src={'/images/main-images/about.svg'}
                                            onClick={() => this.aboutPage()}
                                            />
                                        </div>
                                        <div className={'image-section'}>
                                            <img src={'/images/main-images/categories.svg'}/>
                                        </div>
                                    </>
                            }

                        </div>
                        : null
                }
                <Loader active={loading}/>
                {
                    !Helper.emptyString(searchServices) ?
                        <div className={'search-services'}>
                            <Breadcrumb>
                                <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                                <Breadcrumb.Divider icon='right chevron'/>
                                <Breadcrumb.Section active>サービス一覧</Breadcrumb.Section>
                            </Breadcrumb>
                            <div className={'cards-list'}>
                                {
                                    !Helper.emptyString(categoriesList) ?
                                        this.renderFilteredCategories()
                                        : null
                                }
                                {this.renderCards(searchServices, true)}
                            </div>
                        </div>
                        : null
                }
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
                                                <img src={`https://bonzuttner.xsrv.jp/spm-back/storage/${category.category_icon}`}/>
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