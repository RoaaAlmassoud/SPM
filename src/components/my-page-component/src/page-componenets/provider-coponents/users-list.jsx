import React from 'react';
import PageApi from "../../../api/page-api"
import { Breadcrumb, Header, Loader, Button, Search, Table, Accordion } from 'semantic-ui-react'
import Helper from "../../../../../utils/helper"
import UserDownloadModal from './user-download-modal';

export default class UsersList extends React.Component {

    constructor(props) {
        super(props);
        this.PageApi = new PageApi(this);
        this.userDownloadModaRef = React.createRef()
        this.state = {
            loading: true,
            loader: false,
            loaded: false,
            services: [],
            currentService: {},
            searchValue: '',
            usersList: [],
            innerWidth: window.innerWidth,
            activeIndex: 0
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

    getServiceSubscribersResponse = async (service = {}, value = '') => {
        let { currentService, searchValue, usersList } = this.state;
        let body = {
            service_id: !Helper.isEmpty(service) ? service.id : '',
            criteria: value
        }
        return await this.PageApi.getAllServiceSubscribers(body)
    }

    async componentDidMount() {
        let { services, currentService, searchValue, usersList, subscribers_count } = this.state;
        const myServicesResponse = await this.PageApi.getMyServices()
        if (myServicesResponse.data) {
            services = myServicesResponse.data.services
            const allServiceSubscribersResponse = await this.getServiceSubscribersResponse()
            if (allServiceSubscribersResponse.data) {
                usersList = allServiceSubscribersResponse.data.subscribers ?
                    allServiceSubscribersResponse.data.subscribers : []
                subscribers_count = allServiceSubscribersResponse.data.subscribers_count ?
                    allServiceSubscribersResponse.data.subscribers_count : 0
            }
        }
        this.setState({
            services: services,
            currentService: currentService,
            loading: false,
            usersList: usersList,
            subscribers_count: subscribers_count
        })
    }

    clicked = () => {
        window.location = window.location.origin
    };

    openUserDownloadModal = (user) => {
        this.userDownloadModaRef.current.show(user)
    }

    changeService = async (service) => {
        this.setState({ loading: true })
        let { services, currentService, searchValue, usersList, subscribers_count } = this.state;
        const allServiceSubscribersResponse = await this.getServiceSubscribersResponse(service)
        if (allServiceSubscribersResponse.data) {
            usersList = allServiceSubscribersResponse.data.subscribers ?
                allServiceSubscribersResponse.data.subscribers : []
            subscribers_count = allServiceSubscribersResponse.data.subscribers_count ?
                allServiceSubscribersResponse.data.subscribers_count : 0
            this.setState({
                currentService: service,
                subscribers_count: subscribers_count,
                usersList: usersList,
                loading: false
            })
        }
    }

    handleSearchChange = async (e, data) => {
        this.setState({ loader: true, searchValue: data.value })
        let { services, currentService, searchValue, usersList, subscribers_count } = this.state;
        const allServiceSubscribersResponse = await this.getServiceSubscribersResponse(currentService, data.value)
        if (allServiceSubscribersResponse.data) {
            usersList = allServiceSubscribersResponse.data.subscribers ?
                allServiceSubscribersResponse.data.subscribers : []
            subscribers_count = allServiceSubscribersResponse.data.subscribers_count ?
                allServiceSubscribersResponse.data.subscribers_count : 0
            this.setState({
                subscribers_count: subscribers_count,
                usersList: usersList,
                loader: false
            })
        }
    };

    handleClick = async (e, titleProps, service) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex, loaded: true })

        let { services, currentService, searchValue, usersList, subscribers_count } = this.state;
        const allServiceSubscribersResponse = await this.getServiceSubscribersResponse(service)
        if (allServiceSubscribersResponse.data) {
            usersList = allServiceSubscribersResponse.data.subscribers ?
                allServiceSubscribersResponse.data.subscribers : []
            subscribers_count = allServiceSubscribersResponse.data.subscribers_count ?
                allServiceSubscribersResponse.data.subscribers_count : 0
            this.setState({
                subscribers_count: subscribers_count,
                usersList: usersList,
                loaded: false
            })
        }
    }

    renderAccordion = () => {
        let { services, currentService, loaded, searchValue, loader,
            usersList, subscribers_count, activeIndex } = this.state;

        let serviceList = []
        if (!Helper.emptyString(services)) {
            services.map((service, index) => {
                serviceList.push(
                    <div className='one-service'>
                        <Accordion.Title
                            active={activeIndex === index}
                            index={index}
                            onClick={(e, titleProps) => this.handleClick(e, titleProps, service)}
                        >
                            {service.name}
                            <img src='/images/main-images/arrow-right-black.svg' />
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                            {
                                loaded ?
                                    <Loader active={loaded} />
                                    :
                                    <>
                                        <div className='user-number'>
                                            <h3>?????????????????????</h3>
                                            <h1>{`${subscribers_count}???`}</h1>
                                        </div>
                                        <div className='action-buttons'>
                                            <Button className='primary'>???????????????????????????????????????????????????CSV???</Button>
                                            <div className='search-section'>
                                                <Search
                                                    input={{ icon: 'search', iconPosition: 'left' }}
                                                    placeholder='????????????????????????????????????'
                                                    onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                                                    results={[]}
                                                    value={searchValue}
                                                />
                                            </div>
                                        </div>

                                        <div className='list-section'>

                                            <Table fixed unstackable selectable >
                                                <Table.Header fullWidth>
                                                    <Table.Row>

                                                        <Table.HeaderCell className={'sort-header'}
                                                            width={4}
                                                        >
                                                            ??????
                                                        </Table.HeaderCell>
                                                        <Table.HeaderCell className={'sort-header'}
                                                            width={8}
                                                        >
                                                            ?????????????????????
                                                        </Table.HeaderCell>
                                                        <Table.HeaderCell className={'sort-header'}
                                                            width={4}
                                                        >
                                                            
                                                        </Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    {
                                                        loader ?
                                                            <Table.Row className='loader-row' >
                                                                <Loader active={loader} />
                                                            </Table.Row>
                                                            :
                                                            usersList ?
                                                                usersList.map((user, index) => {
                                                                    return <Table.Row>
                                                                        <Table.Cell>{user.user_first_name_kana ? user.user_first_name_kana : ''}</Table.Cell>
                                                                        <Table.Cell>{user.user_email ? user.user_email : ''}</Table.Cell>
                                                                        <Table.Cell onClick={() => this.openUserDownloadModal(user)}>???????????????</Table.Cell>
                                                                    </Table.Row>
                                                                })
                                                                : null
                                                    }
                                                </Table.Body>
                                            </Table>

                                        </div>
                                    </>
                            }
                        </Accordion.Content>
                    </div>
                )
            })
        }
        serviceList.push(
            <div className='one-service'>
                <Accordion.Title
                    active={activeIndex === services.length}
                    index={services.length}
                    onClick={(e, titleProps) => this.handleClick(e, titleProps, {})}
                >
                    ?????????????????????
                    <img src='/images/main-images/arrow-right-black.svg' />
                </Accordion.Title>
                <Accordion.Content active={activeIndex === services.length}>
                    {
                        loaded ?
                            <Loader active={loaded} />
                            :
                            <>
                                <div className='user-number'>
                                    <h3>?????????????????????</h3>
                                    <h1>{`${subscribers_count}???`}</h1>
                                </div>
                                <div className='action-buttons'>
                                    <Button className='primary'>???????????????????????????????????????????????????CSV???</Button>
                                    <div className='search-section'>
                                        <Search
                                            input={{ icon: 'search', iconPosition: 'left' }}
                                            placeholder='????????????????????????????????????'
                                            onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                                            results={[]}
                                            value={searchValue}
                                        />
                                    </div>
                                </div>

                                <div className='list-section'>

                                    <Table fixed unstackable selectable >
                                        <Table.Header fullWidth>
                                            <Table.Row>

                                                <Table.HeaderCell className={'sort-header'}
                                                    width={4}
                                                >
                                                    ??????
                                                </Table.HeaderCell>
                                                <Table.HeaderCell className={'sort-header'}
                                                    width={8}
                                                >
                                                    ?????????????????????
                                                </Table.HeaderCell>
                                                <Table.HeaderCell className={'sort-header'}
                                                    width={4}
                                                >
                                                    
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                loader ?
                                                    <Table.Row className='loader-row' >
                                                        <Loader active={loader} />
                                                    </Table.Row>
                                                    :
                                                    usersList ?
                                                        usersList.map((user, index) => {
                                                            return <Table.Row>
                                                                <Table.Cell>{user.user_first_name_kana ? user.user_first_name_kana : ''}</Table.Cell>
                                                                <Table.Cell>{user.user_email ? user.user_email : ''}</Table.Cell>
                                                                <Table.Cell onClick={() => this.openUserDownloadModal(user)}>???????????????</Table.Cell>
                                                            </Table.Row>
                                                        })
                                                        : null
                                            }
                                        </Table.Body>
                                    </Table>

                                </div>
                            </>
                    }
                </Accordion.Content>
            </div>
        )
        return (
            <Accordion fluid className='service-accordion'>
                {serviceList}
            </Accordion>

        )
    }

    render() {
        let { loading, services, currentService, searchValue,
            usersList, subscribers_count, loader, innerWidth } = this.state;
        return (
            <div className={'users-list'}>
                {
                    loading ?
                        <Loader active={loading} />
                        :
                        innerWidth <= 768 ?
                            <div className='mobile-users-list'>
                                <p>????????????????????????</p>
                                {this.renderAccordion()}
                            </div>
                            :
                            <>
                                <div className='left-side'>
                                    <p>????????????????????????</p>
                                    {
                                        services ?
                                            services.map((service) => {
                                                return <a onClick={() => this.changeService(service)}>{service.name}</a>
                                            })
                                            : null
                                    }

                                    <a onClick={() => this.changeService({})}>?????????????????????</a>

                                </div>
                                <div className='right-side'>
                                    {
                                        currentService ?
                                            <>
                                                <div className='service-users'>
                                                    <h2>{!Helper.isEmpty(currentService) ? currentService.name : '?????????????????????'}</h2>
                                                    <div className='user-number'>
                                                        <h3>?????????????????????</h3>
                                                        <h1>{`${subscribers_count}???`}</h1>
                                                    </div>

                                                </div>
                                                <div className='action-buttons'>
                                                    <Button>???????????????????????????????????????????????????CSV???</Button>
                                                    <div className='search-section'>
                                                        <Search
                                                            input={{ icon: 'search', iconPosition: 'left' }}
                                                            placeholder='????????????????????????????????????'
                                                            onSearchChange={(e, data) => this.handleSearchChange(e, data)}
                                                            results={[]}
                                                            value={searchValue}
                                                        />
                                                    </div>
                                                </div>

                                                <div className='list-section'>

                                                    <Table fixed unstackable selectable >
                                                        <Table.Header fullWidth>
                                                            <Table.Row>
                                                                <Table.HeaderCell className={'sort-header'}
                                                                    width={3}
                                                                >
                                                                    ???????????????
                                                                </Table.HeaderCell>

                                                                <Table.HeaderCell className={'sort-header'}
                                                                    width={3}
                                                                >
                                                                    ??????
                                                                </Table.HeaderCell>
                                                                <Table.HeaderCell className={'sort-header'}
                                                                    width={6}
                                                                >
                                                                    ?????????????????????
                                                                </Table.HeaderCell>
                                                                <Table.HeaderCell className={'sort-header'}
                                                                    width={4}
                                                                >
                                                                    ????????????
                                                                </Table.HeaderCell>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {
                                                                loader ?
                                                                    <Table.Row className='loader-row' >
                                                                        <Loader active={loader} />
                                                                    </Table.Row>
                                                                    :
                                                                    usersList ?
                                                                        usersList.map((user, index) => {
                                                                            return <Table.Row onClick={() => this.openUserDownloadModal(user)}>
                                                                                <Table.Cell>{user.subscription_date ? user.subscription_date.split('T')[0] : ''}</Table.Cell>
                                                                                <Table.Cell>{user.user_first_name_kana ? user.user_first_name_kana : ''}</Table.Cell>
                                                                                <Table.Cell>{user.user_email ? user.user_email : ''}</Table.Cell>
                                                                                <Table.Cell>{user.user_phone ? user.user_phone : ''}</Table.Cell>
                                                                            </Table.Row>
                                                                        })
                                                                        : null
                                                            }
                                                        </Table.Body>
                                                    </Table>

                                                </div>

                                            </>
                                            : null
                                    }

                                </div>
                            </>
                }

                <UserDownloadModal ref={this.userDownloadModaRef} props={this} />

            </div>
        );
    }
}
