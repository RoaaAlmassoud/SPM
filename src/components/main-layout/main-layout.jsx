import React, {Component} from 'react'
import Footer from './footer'
import Helper from '../../utils/helper'
import {Menu, Dropdown, Icon, Search, Button, Loader} from "semantic-ui-react"
import MainApi from "./main-api"


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
            categories: []
        }
    }

    async componentDidMount() {
        const response = await this.mainApi.getCategories({})
        let categories = []
        if (response.data) {
            response.data.map((category, index) => {
                let categoryChildren = category.all_children.map((child) => {
                    return {
                        key: category.id,
                        text: category.name,
                        value: category.name
                    }
                })
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
                    color: color
                }
                categories.push(categoryObject)
            })
            this.setState({
                categories: categories,
                loading: false
            })
        }
    }


    render() {
        let {categories, loading} = this.state;
        let user = localStorage.getItem('accessToken');
        return (
            <div className={'main-container'}>
                <Loader active={loading}/>
                <div className={'header-section'}>
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
                                //loading={loading}
                                placeholder='サービスをキーワードで検索'
                                /*onResultSelect={(e, data) =>
                                    dispatch({type: 'UPDATE_SELECTION', selection: data.result.title})
                                }*/
                                //onSearchChange={handleSearchChange}
                                //results={results}
                                //value={}
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
                    <div className={'category-section'}>
                        <p>カテゴリーから探す
                            <Icon name={'angle right'} size={'large'}/>
                        </p>
                    </div>
                    <div className={'categories-list'}>
                        {
                            categories.map((category, index) => {
                                return <Dropdown style={{color: category.color}}
                                                 key={index}
                                                 text={category.name}
                                                 options={category.children}
                                                 icon={'angle right'}/>
                            })
                        }
                    </div>
                    <div className={'about-section'}>
                        <div className={'text-section'}>
                            <p>サブスク管理を</p>
                            <p>もっと快適に</p>
                            <img src={'/images/main-images/about.svg'}/>
                        </div>
                        <div className={'image-section'}>
                            <img src={'/images/main-images/categories.svg'}/>
                        </div>
                    </div>
                </div>
                <div className={'children'}>
                    {this.props.children}
                </div>
                <Footer notify={this.props.notify} props={this.props}/>
            </div>
        );
    }
}

export default MainLayout;