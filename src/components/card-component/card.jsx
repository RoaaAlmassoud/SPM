import React from 'react';
import "./card-css.css"
import {Header} from 'semantic-ui-react'
import Helper from "../../utils/helper"

export default class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            service: props? props.service? props.service.service: {}: {}
        }
    }


    render() {
        let service = this.props.service;
        console.log('ser: ', service)
        if(!Helper.emptyString(service)){
            return (
                <div className={'card'}>
                    <img className={'service-image'} src={'/images/main-images/mask.svg'}/>
                    <div className={'actions'}>
                        <img className={'like-image'} src={'/images/main-images/like.svg'}/>
                        <img className={'plus-image'} src={'/images/main-images/plus.svg'}/>
                    </div>
                    <div className={"description-section"}>
                        <Header as={'h4'}>
                            {service.name}
                        </Header>
                        <p>
                            {service.introduction}
                        </p>
                    </div>
                    <div className={"price-section"}>
                        <Header as={'h3'}>
                            {`¥${service.price}/月`}
                        </Header>
                    </div>
                </div>
            );
        } else {
            return null;
        }

    }
}
