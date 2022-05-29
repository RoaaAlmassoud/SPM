import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import Footer from './footer'
import Helper from '../../utils/helper'
import {Menu, Dropdown, Icon, Search, Button, Loader} from "semantic-ui-react"
import MainApi from "./main-api"
import {slide as Burger} from 'react-burger-menu'


class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.mainApi = new MainApi(this)
        this.pathName = props ? props.props.pathName.substring(1) : 'home';
        let showFooter = (this.pathName !== 'register' && !Helper.emptyString(this.pathName));
        this.state = {
            activeItem: this.pathName !== 'home' ? this.pathName : 'home',
            showFooter: showFooter,
            loading: true,
            categories: [],
            showCategoriesList: false,
            filteredCategories: [],
            innerWidth: window.innerWidth,
            fullFilteredCats: [],
            showMobileSearch: false
        }
    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.onresize = this.changeInnerWidth;
    }

    async componentDidMount() {
        const response = await this.mainApi.getCategories({})
        let categories = [];
        let categoriesList = []
        if (response.data) {
            response.data.map((category, index) => {
                categoriesList.push(category)
                let categoryChildren = category.all_children.map((child) => {
                    return {
                        key: child.id,
                        text: child.name,
                        value: child.id
                    }
                });
                let color = '#58BAF4';
                switch (index) {
                    case 0:
                        color = "#58BAF4";
                        break;
                    case 1:
                        color = "#E84341";
                        break;
                    case 2:
                        color = "#FF6CDF";
                        break;
                    case 3:
                        color = "#21C2C2";
                        break;
                    case 4:
                        color = "#CB6336";
                        break;
                    case 5:
                        color = "#F68822";
                        break;
                    case 6:
                        color = "#A072C0";
                        break;
                    case 7:
                        color = "#3672CB";
                        break;
                    case 8:
                        color = "#231815";
                        break;
                    default:
                        color = '#58BAF4'
                }
                let categoryObject = {
                    name: category.name,
                    children: categoryChildren,
                    color: category.color
                }
                categories.push(categoryObject)
            })

            this.setState({
                categories: categories,
                categoriesList: categoriesList,
                loading: false
            })
        }
    }

    openCategoriesList = () => {
        let {showCategoriesList} = this.state;
        this.setState({
            showCategoriesList: !showCategoriesList
        })
    };

    handleSearchChange = (e, data) => {
        let {categoriesList} = this.state;
        let categoriesText = this.props.location.state ? this.props.location.state.categories ? this.props.location.state.categories : '' : '';
        let fullFilteredCats = this.props.location.state ? this.props.location.state.fullFilteredCats ? this.props.location.state.fullFilteredCats : '' : '';
        this.props.location.state = {
            name: data.value,
            categories: categoriesText,
            categoriesList: categoriesList,
            fullFilteredCats: fullFilteredCats
        }
        this.setState({
            name: data.value,
            childrenRefreshKey: Helper.unique(),
        })
    };

    componentWillUnmount() {
        this.props.location.state = {}
    }

    onChange = (event, data) => {
        let {filteredCategories, categoriesList, fullFilteredCats} = this.state;
        let selectedCategory = data.value;
        let categories = []
        let selectedObject = {}
        if (categoriesList.find(a => a.id === selectedCategory)) {
            fullFilteredCats.push(categoriesList.find(a => a.id === selectedCategory))
        } else {
            categoriesList.map((cat) => {
                if (cat.all_children.find(a => a.id === selectedCategory)) {
                    selectedObject = cat.all_children.find(a => a.id === selectedCategory);
                    fullFilteredCats.push(selectedObject)
                }
            })
        }
        //let categoriesText = this.props.location.state ? this.props.location.state.categories ? this.props.location.state.categories : '' : '';
        if (filteredCategories.find(a => a === selectedCategory)) {
            filteredCategories.filter(a => a !== selectedCategory)
        } else {
            filteredCategories.push(selectedCategory)
        }
        /*categoriesText = Helper.emptyString(categoriesText) ? filteredCategories[0] :
            `${categoriesText},${filteredCategories[filteredCategories.length - 1]}`;*/
        let name = this.props.location.state ? this.props.location.state.name ? this.props.location.state.name : '' : '';
        this.props.location.state = {
            name: name,
            //categories: categoriesText,
            categoriesList: categoriesList,
            fullFilteredCats: fullFilteredCats
        }
        this.setState({
            filteredCategories: filteredCategories,
            fullFilteredCats: fullFilteredCats,
            childrenRefreshKey: Helper.unique(),
        })
    };

    showSearch = () => {
        let {showMobileSearch} = this.state;
        this.setState({
            showMobileSearch: !showMobileSearch
        })
    }

    render() {
        let {categories, loading, showCategoriesList, childrenRefreshKey, filteredCategories, innerWidth, showMobileSearch} = this.state;
        let name = this.props.location.state ? this.props.location.state.name ? this.props.location.state.name : '' : '';
        let fullFilteredCats = this.props.location.state ? this.props.location.state.fullFilteredCats ? this.props.location.state.fullFilteredCats : '' : '';
        let user = localStorage.getItem('accessToken');
        return (
            <>
                <Loader active={loading}/>
                <div className={`${innerWidth <= 1024 ? 'mobile' : ''} main-container`}>
                    <div className={`${showMobileSearch ? 'mobile' : ''} header-section`}>
                        {
                            innerWidth <= 1024 ?
                                <div className={`${showMobileSearch ? 'with-search' : ''} navbar-section mobile`}>
                                    {
                                        showMobileSearch ?
                                            <div className={'mobile-search-section'}>
                                                <div className={"close-img"}>
                                                    <img src={'/images/main-images/close-black.svg'}
                                                         onClick={() => this.showSearch()}
                                                    />
                                                </div>
                                                <Menu.Item>
                                                    <Search
                                                        input={{icon: 'search', iconPosition: 'left'}}
                                                        placeholder='サービスをキーワードで検索'
                                                        onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                                                        results={[]}
                                                        value={name}
                                                    />
                                                </Menu.Item>
                                            </div>
                                            :
                                            <>
                                                <Burger style={{width: '5%'}} right isOpen={this.state.menuOpen}
                                                    //onStateChange={(state) => this.handleStateChange(state)}
                                                >
                                                    <Menu.Item
                                                        onClick={this.handleItemClick}
                                                    >
                                                        <h3>無料ユーザー登録</h3>
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        onClick={this.handleItemClick}
                                                    >
                                                        <h3>ログイン</h3>
                                                    </Menu.Item>
                                                    <div className={'static-pages'}>
                                                        <Menu.Item
                                                            onClick={this.handleItemClick}
                                                        >
                                                            <h3>運営会社</h3>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={this.handleItemClick}
                                                        >
                                                            <h3>プライバシーポリシー</h3>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            name='trips'
                                                            onClick={this.handleItemClick}
                                                        >
                                                            <h3>利用規約</h3>
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={this.handleItemClick}
                                                        >
                                                            <h3>お問い合わせ</h3>
                                                        </Menu.Item>
                                                    </div>

                                                </Burger>
                                                <div className={'navbar-mobile-elements'}>
                                                    <Menu.Item
                                                        onClick={this.handleItemClick}
                                                    >
                                                        <img src={'/images/main-images/logo.svg'}
                                                             alt={'img'}
                                                             className={'logo-img'}
                                                        />
                                                    </Menu.Item>
                                                    {
                                                        !showMobileSearch ?
                                                            <Menu.Item
                                                                onClick={this.handleItemClick}
                                                            >
                                                                <img src={'/images/main-images/mobile-search.svg'}
                                                                     className={'show-mobile-search'}
                                                                     alt={'img'}
                                                                     onClick={() => this.showSearch()}
                                                                />
                                                            </Menu.Item>
                                                            : null
                                                    }


                                                </div>
                                            </>
                                    }

                                </div>
                                :
                                <Menu id={"navbar"} borderless className={"navbar-section"}>
                                    <Menu.Item>
                                        <img src={'/images/main-images/logo.svg'}
                                             alt={'img'}
                                             className={'logo-img'}
                                        />
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Search
                                            input={{icon: 'search', iconPosition: 'left'}}
                                            placeholder='サービスをキーワードで検索'
                                            onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                                            results={[]}
                                            value={name}
                                        />
                                    </Menu.Item>
                                    <Menu.Menu position='right'>
                                        <div className={'right-menu-text'}>
                                            <img src={"/images/main-images/arrow.svg"}/>
                                            <span>ログイン</span>
                                        </div>

                                        <Button>
                                            <img src={"/images/main-images/user.svg"}/>
                                            <span>無料ユーザー登録</span>
                                        </Button>
                                    </Menu.Menu>
                                    {
                                        user ?
                                            null
                                            /*<Menu.Menu position='right'>
                                                <Dropdown className={'notification-section'}
                                                          onClick={() => this.getNotifications(true)}
                                                          item trigger={(
                                                    <span>
                                            <Icon name='bell' size={'large'}/>

                                        </span>
                                                )}>



                                                </Dropdown>
                                                <Dropdown className={'profile-section'} item trigger={(
                                                    <span>
                                                        <Icon name='user outline' size={'big'}/>test
                                                    </span>
                                                )}>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item disabled>
                                                            <Icon name={'mail'}/>
                                                            {localStorage.getItem('email')}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => this.props.history.push("/profile")}>
                                                            Profile
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => this.props.history.push("/logout")}>
                                                            Logout
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Menu.Menu>*/
                                            :
                                            null

                                    }

                                </Menu>
                        }

                        <div className={'category-section'}>
                            <p onClick={() => this.openCategoriesList()}>カテゴリーから探す
                                <Icon name={`angle ${showCategoriesList ? 'down' : 'right'}`} size={'large'}/>
                            </p>
                        </div>
                        <div className={`${showCategoriesList ? 'show' : 'hide'} categories-list`}>
                            {
                                categories.map((category, index) => {
                                    return <Dropdown style={{color: category.color}}
                                                     key={index}
                                                     text={category.name}
                                                     options={category.children}
                                                     icon={'angle right'}
                                                     onChange={(event, data) => this.onChange(event, data)}
                                    />
                                })
                            }
                        </div>
                        {/*{
                            (Helper.emptyString(fullFilteredCats) && Helper.emptyString(name)) ?
                                <div className={`${innerWidth <= 765 ?'mobile': ''} about-section`}>
                                    {
                                        innerWidth <= 765 ?
                                            <>
                                                <div className={'text-section'}>
                                                    <p>サブスク管理をもっと快適に</p>
                                                </div>
                                                <div className={'image-section'}>
                                                    <img src={'/images/main-images/categories-mobile.svg'}/>
                                                    <img src={'/images/main-images/about-mobile.svg'}/>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className={'text-section'}>
                                                    <p>サブスク管理を</p>
                                                    <p>もっと快適に</p>
                                                    <img src={'/images/main-images/about.svg'}/>
                                                </div>
                                                <div className={'image-section'}>
                                                    <img src={'/images/main-images/categories.svg'}/>
                                                </div>
                                            </>
                                    }

                                </div>
                                : null
                        }*/}
                    </div>
                    <div className={'children'} key={childrenRefreshKey}>
                        {this.props.children}
                    </div>
                    <Footer notify={this.props.notify} props={this.props}/>
                </div>
            </>
        );
    }
}

export default withRouter(MainLayout);