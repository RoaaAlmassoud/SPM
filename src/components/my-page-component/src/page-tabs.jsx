import React from 'react';
import { Menu, Icon, Breadcrumb, Accordion, Label, Checkbox, Button, Tab } from 'semantic-ui-react'
import './page-css.css'
import Helper from '../../../utils/helper'
import MyPage from './page-componenets/provider-coponents/my-page'
import UpdateAccount from './page-componenets/provider-coponents/update-account';
import UsersList from './page-componenets/provider-coponents/users-list';
import WishList from './page-componenets/user-components/wish-list';
import UpdateUserAccount from './page-componenets/user-components/update-user-account';
import CustomServices from './page-componenets/user-components/custom-services-component/custom-services';
import WelcomeModal from '../../authentication-component/src/welcome-modal';



export default class PageTabs extends React.Component {

    constructor(props) {
        super(props);
        this.welcomeModalRef = React.createRef();
        let userType = localStorage.getItem('user_type') ? localStorage.getItem('user_type') : 'provider'
        this.state = {
            userType: userType,
            lastSection: '',
            innerWidth: window.innerWidth,
            activeIndex: null
        }

    }

    changeLastSection = (section) => {
        this.setState({
            lastSection: section
        })
    }

    componentDidMount() {
        if (this.state.userType === 'user') {
            // this.welcomeModalRef.current.show();
        }
    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    // openWelcomeModal = () => {
    //     this.welcomeModalRef.current.show();
    // }

    clicked = () => {
        window.location = window.location.origin
    };

    changePage = (page) => {
        this.props.history.push(`/${page ? page : ''}`)
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
      }

    renderAccordion = () => {
        let { userType, activeIndex } = this.state;
        if (userType === 'user') {
            return (
                <Accordion fluid className='user main-accordion'>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleClick}
                    >
                        利用中サービス 
                        <img src='/images/main-images/plus-black.svg' />
                        </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <CustomServices props={this.props} data={this.state.data} />
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleClick}
                    >
                        マイページ
                        <img src='/images/main-images/plus-black.svg' />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>

                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.handleClick}
                    >アカウント情報
                     <img src='/images/main-images/plus-black.svg' />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2} className='update-account'>
                        <UpdateUserAccount props={this.props} data={this.state.data} />
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 3}
                        index={3}
                        onClick={this.handleClick}
                    >気になるリスト
                     <img src='/images/main-images/plus-black.svg' />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <WishList props={this.props} data={this.state.data} />
                    </Accordion.Content>
                </Accordion>

            )
        } else {
            return (
                <Accordion fluid className='provider main-accordion'>
                    <Accordion.Title
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleClick}
                    >
                        マイページ
                        <img src='/images/main-images/plus-black.svg' />
                         </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <MyPage props={this.props} changeLastSection={this.changeLastSection} />
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleClick}
                    >
                        アカウント情報
                        <img src='/images/main-images/plus-black.svg' />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <UpdateAccount props={this.props} changeLastSection={this.changeLastSection} />
                    </Accordion.Content>

                    <Accordion.Title
                        active={activeIndex === 2}
                        index={2}
                        onClick={this.handleClick}
                    >利用者一覧
                     <img src='/images/main-images/plus-black.svg' />
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <UsersList props={this.props} data={this.state.data} />
                    </Accordion.Content>
                </Accordion>

            )
        }

    }

    render() {
        let { userType, lastSection, innerWidth } = this.state;
        let width = innerWidth <= 1230 ? '25%' : '12.82%'
        let panes = [];
        if (userType === 'user') {
            panes = [{
                menuItem: (
                    <Menu.Item key='basic' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>利用中サービス</h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <CustomServices props={this.props} data={this.state.data} />
                </Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='email_template' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>マイページ</h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    {/* <Notifications props={this.props} data={this.state.data} /> */}
                </Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='email_template' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>アカウント情報</h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <UpdateUserAccount props={this.props} data={this.state.data} />
                </Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='email_template' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>気になるリスト</h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <WishList props={this.props} data={this.state.data} />
                </Tab.Pane>,
            }
            ];
        } else {
            panes = [{
                menuItem: (
                    <Menu.Item key='basic' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>マイページ
                        </h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <MyPage props={this.props} changeLastSection={this.changeLastSection} />
                </Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='email_template' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>アカウント情報
                        </h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <UpdateAccount props={this.props} changeLastSection={this.changeLastSection} />
                </Tab.Pane>,
            },
            {
                menuItem: (
                    <Menu.Item key='email_template' style={{ width: width, textAlign: "center" }}>
                        <h4 className={'tab-header'}>利用者一覧
                        </h4>
                    </Menu.Item>
                ),
                render: () => <Tab.Pane>
                    <UsersList props={this.props} data={this.state.data} />
                </Tab.Pane>,
            }
            ];
        }

        return (
            <div className={'page-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    {
                        Helper.emptyString(lastSection) ?
                            <Breadcrumb.Section active>{`マイページ`}</Breadcrumb.Section>
                            :
                            <>
                                <Breadcrumb.Section>{`マイページ`}</Breadcrumb.Section>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section active>{`${lastSection}`}</Breadcrumb.Section>
                            </>
                    }

                </Breadcrumb>
                <div className='tabs-section'>
                    <div className='action-section'>
                        {
                            innerWidth <= 768 ?
                                this.renderAccordion()
                                :
                                <Tab
                                    className={'profile-tabs'}
                                    menu={{ secondary: true, pointing: true }}
                                    panes={panes} />
                        }

                    </div>
                </div>
                <WelcomeModal ref={this.welcomeModalRef}
                    props={this} />
            </div >
        );
    }


}