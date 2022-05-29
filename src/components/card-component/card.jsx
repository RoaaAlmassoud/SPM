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

    openServiceDetails =  () => {
        this.props.props.history.push(`/${this.props.service.id}`)
        window.location.reload(true)
    }

    render() {
        let service = this.props.service;
        if(!Helper.emptyString(service)){
            return (
                <div className={'card'} onClick={() => this.openServiceDetails()}>
                    <img className={'service-image'} src={`https://backend-nichijo.s-pm.co.jp/storage/${service.image}`}/>
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
