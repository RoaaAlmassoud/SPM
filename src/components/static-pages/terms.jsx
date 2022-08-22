import React from 'react';
import './static-pages-css.css'
import { Header, Loader, Breadcrumb, Icon, Label } from 'semantic-ui-react'

export default class Terms extends React.Component {

    constructor(props) {
        super(props);

    }

    clicked = () => {
        window.location = window.location.origin
    };

    render() {
        return (
            <div className={'static-container custom'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`利用規約`}</Breadcrumb.Section>
                </Breadcrumb>

                <div className={'description-section'}>
                    <h1>利用規約</h1>
                    <div className={'details-section'}>
                        <p>この文章はダミ一です。 文字の大きさ、 量ヽ 字間、 行間等を確認するために入れ
                            ています。 この文章はダミ一です〟 文字の大きさ、 量ヽ 字間、 行間等を確認する
                            ために入れています。 この文章はダミ一です。 文字の大きさヽ 量ヽ 字間、 行間等
                            を確認するために入れています。 この文章はダミ一です。</p>


                        <p>文字の大きさ、 量、 字間、 行間等を確認するために入れています。 この文章はダ
                            ミ一です。 文字の大きさ、 量、 字間、 行間等を確認するために入れています。 こ
                            の文章はダミ一です。 文字の大きさ、 量、 字間、 行間等を確認するために入れて
                            います。 この文章はダミ一です。 文字の大きさ、 量、 字間、 行間等を確認するた
                            めに入れています。 この文章はダミ一です〟 文字の大きさ、 量` 字間、 行間等を
                            確認するために入れています。 この文章はダミ一です。 文字の大きさ、 量` 字

                            間` 行間等を確認するために入れています。 この文章はダ三一です。 文字の大き
                            さ` 量` 字間` 行間等を確認する</p>

                        <p>この文章はダミ一です。 文字の大きさ、 量` 字間、 行間等を確認するために入れ
                            ています。 この文章はダミ一です。 文字の大きさ、 量、 字間、 行間等を確認する
                            ために入れています。 この文章はダ三ーです。 文字の大きさ、 量、 字間、 行間等
                            を確認するために入れています。 この文章はダ三一です。</p>


                        <p>文字の大きさ、 量ヽ 字間、 行聞等を確認するために入れています。 この文章はダ
                            三一です。 文字の大きさ、 量ヽ 字間、 行間等を確認するために入れています。 こ
                            の文章はダミ一です。 文字の大きさ、 量ヽ 字間ヽ 行間等を確認するために入れて
                            います。 この文章はダミ一です。 文字の大きさヽ 量` 字間、 行間等を確認するた
                            めに入れています。 この文章はダミ一です。 文字の大きさ、 量、 字間、 行間等を
                            確認するために入れています〟 この文章はダ三一です〟 文字の大きさ、 量、 字

                            間、 行間等を確認するために入れています。 この文章はダミ一です。 文字の大き
                            さ、 量、 字間、 行間等を確認する

                            この文章はダミ一です〟 文字の大きさ、 量、 字間、 行間等を確認するために入れ
                            ています。 この文章はダミ一です〟 文字の大きさ、 量、 字間、 行間等を確認する
                            ために入れています。 この文章はダ三一です。 文字の大きさ` 量` 字間、 行間等
                            を確認するために入れています。 この文章はダ三一です。</p>

                        <p>文字の大きさ、 量` 字間ヽ 行間等を確認するために入れています。 この文章はダ
                            ミーです。 文字の大きさ、 量ヽ 字間、 行間等を確認するために入れています。 こ
                            の文章はダ三一です。 文字の大きさ、 量、 字間` 行間等を確認するために入れて
                            います。 この文章はダミーです。 文字の大きさ、 量、 字間` 行間等を確認するた
                            めに入れています。 この文章はダミ一です。 文字の大きさ、 量ヽ 字間、 行間等を
                            確認するために入れています。 この文章はダミ一です。 文字の大きさ、 量ヽ 字

                            間ヽ 行間等を確認するために入れています。 この文章はダ三一です。 文字の大き
                            さヽ 量ヽ 字間、 行間等を確認する</p>
                    </div>
                </div>
            </div>
        );
    }


}