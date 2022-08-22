import React from 'react';
import './static-pages-css.css'
import { Header, Loader, Breadcrumb, Icon, Label } from 'semantic-ui-react'

export default class OperatingCompany extends React.Component {

    constructor(props) {
        super(props);

    }

    clicked = () => {
        window.location = window.location.origin
    };

    render() {
        return (
            <div className={'static-container'}>
                <Breadcrumb>
                    <Breadcrumb.Section link onClick={() => this.clicked()}>Top</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section active>{`運営会社`}</Breadcrumb.Section>
                </Breadcrumb>

                <div className={'description-section'}>
                    <h1>運営会社</h1>
                    <div className={'details-section'}>
                        <div className='row-section'>
                            <p className='first'>会社名</p>
                            <p className='second'>SPM (エス・ピー・エム) 株式会社</p>
                        </div>

                        <div className='row-section'>
                            <p className='first'>住所</p>
                            <p className='second'>105-0013
                                <p>東京都港区浜松町2-2-15 浜松町ダイヤビル2F</p></p>
                        </div>

                        <div className='row-section'>
                            <p className='first'>設立年月日</p>
                            <p className='second'>2021年3月8日</p>
                        </div>

                        <div className='row-section'>
                            <p className='first'>代表取締役</p>
                            <p className='second'>五島大</p>
                        </div>

                        <div className='row-section'>
                            <p className='first'>事業内容</p>
                            <p className='second'>nichijoメディア運営
                            <p>Web制作</p>
                            <p>マーケティング事業</p>
                            <p>システム開発事業</p>
                            </p>
                        </div>

                        <div className='row-section'>
                            <p className='first'>取引銀行</p>
                            <p className='second'>みずは銀行、住信SBIネット銀行</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}