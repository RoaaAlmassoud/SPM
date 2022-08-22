import React from 'react';
import { Menu } from "semantic-ui-react"

export default class Footer extends React.Component {

    constructor(props) {
        super(props);
        let pathName = props.props.location.pathname
        this.state = {
            innerWidth: window.innerWidth,
            showMediaImage: pathName === '/'
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

    handleItemClick = (e, { name }) => {
        this.setState({
            activeItem: name,
        }, () => {
            this.props.props.history.push(`/${name}`)
        })
    };

    render() {
        let { innerWidth, showMediaImage } = this.state
        return (
            <div className={`${innerWidth <= 768 ? 'mobile' : ''} footer-section`} id={'footer-section'}>
                {
                    showMediaImage ?
                        <img src={"/images/main-images/media.svg"}
                            alt={'img'}
                            className={'footer-image'}
                        />
                        : null
                }

                <div className={'footer'}>
                    {
                        innerWidth <= 768 ?
                            <>
                                <Menu>
                                    <Menu.Item
                                        className={'underline'}
                                        name='operating-company'
                                        // active={activeItem === 'support'}
                                        onClick={this.handleItemClick}
                                    >運営会社
                                    </Menu.Item>
                                    <Menu.Item
                                        // className={'underline'}
                                        name='privacy-policy'
                                        //active={activeItem === 'disclaimer'}
                                        onClick={this.handleItemClick}
                                    >プライバシーポリシー</Menu.Item>
                                </Menu>
                                <Menu>
                                    <Menu.Item
                                        //className={'underline'}
                                        name='terms'
                                        //active={activeItem === 'Advises'}
                                        onClick={this.handleItemClick}
                                    >利用規約</Menu.Item>
                                    <Menu.Item
                                        //className={'underline'}
                                        name='inquiry'
                                        //active={activeItem === 'Advises'}
                                        onClick={this.handleItemClick}
                                    >お問い合わせ</Menu.Item>
                                </Menu>
                                <Menu>
                                    <Menu.Item
                                        //className={'underline'}
                                        name='nichijo media'
                                        //active={activeItem === 'Advises'}
                                        onClick={this.handleItemClick}
                                    >
                                        <span>nichijo media</span>
                                        <img src={'/images/main-images/media-box.svg'} />

                                    </Menu.Item>
                                </Menu>
                                <Menu>
                                    <Menu.Menu position='left'>
                                        <p>
                                            Copyright © 2021 SPM Co., Ltd. All rights reserved.
                                        </p>
                                    </Menu.Menu>

                                </Menu>
                            </>
                            :
                            <Menu>
                                <Menu.Item
                                    className={'underline'}
                                    name='operating-company'
                                    // active={activeItem === 'support'}
                                    onClick={this.handleItemClick}
                                >運営会社</Menu.Item>
                                <Menu.Item
                                    // className={'underline'}
                                    name='privacy-policy'
                                    //active={activeItem === 'disclaimer'}
                                    onClick={this.handleItemClick}
                                >プライバシーポリシー</Menu.Item>
                                <Menu.Item
                                    //className={'underline'}
                                    name='terms'
                                    //active={activeItem === 'Advises'}
                                    onClick={this.handleItemClick}
                                >利用規約</Menu.Item>
                                <Menu.Item
                                    //className={'underline'}
                                    name='inquiry'
                                    //active={activeItem === 'Advises'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    //className={'underline'}
                                    name='nichijo media'
                                    //active={activeItem === 'Advises'}
                                    onClick={this.handleItemClick}
                                >
                                    <span>nichijo media</span>
                                    <img src={'/images/main-images/media-box.svg'} />

                                </Menu.Item>
                                <Menu.Menu position='right'>
                                    <p>
                                        Copyright © 2021 SPM Co., Ltd. All rights reserved.
                                    </p>
                                </Menu.Menu>
                            </Menu>
                    }
                </div>
            </div>
        );
    }
}
