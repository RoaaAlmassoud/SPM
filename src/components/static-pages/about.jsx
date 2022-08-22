import React from 'react';
import './static-pages-css.css'
import { Header, Loader, Breadcrumb, Icon, Label, Button } from 'semantic-ui-react'

export default class About extends React.Component {

    constructor(props) {
        super(props);

    }

    clicked = () => {
        window.location = window.location.origin
    };

    registerPage = () => {
        this.props.history.push('/register')
    }

    render() {
        return (
            <div className={'static-container custom'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`nichijoとは`}</Breadcrumb.Section>
                </Breadcrumb>

                <div className={'description-section'}>
                    <h1>nichijoとは</h1>
                    <div className={'details-section'}>
                        <p>ことの文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れ
                            ています。この文章はダミーです。 文字の大きさ、量、字間、行間等を確認する
                            ために入れています。この文章はダミーです。文字の大きさ、量、宇間、行間等
                            を確認するために入れています。とこの文章はダミーです。
                        </p>

                        <p>文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダ
                            ミーです。 文字の大きさ、量、字間、行間等を確認するために入れています。こ
                            の文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れて
                            います。とこの文章はダミーです。 文字の大きさ、量、字間、行間等を確認するた
                            めに入れています。との文章はダミーです。文字の大きさ、量、字間、行間等を
                            確認するために入れています。とこの文章はダミーです。 文字の大きさ、量、字

                            間、行間等を確認するために入れています。との文章はダミーです。 文字の大き
                            さ、量、字間、 行間等を確認する</p>
                    </div>

                    <div className='buttons-section'>
                        <Button onClick={() => this.registerPage()}>今すぐユーザー登録する</Button>
                        <Button>サービス掲載希望の事業様はこちら</Button>
                    </div>
                </div>
            </div>
        );
    }


}