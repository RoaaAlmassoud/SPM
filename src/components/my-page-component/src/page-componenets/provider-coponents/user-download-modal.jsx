import React from 'react';
import { Modal, Button, List, Label } from 'semantic-ui-react'
import '../../../src/page-css.css'
import Helper from '../../../../../utils/helper'

export default class UserDownloadModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loading: false,

        }
    }

    show = (user) => {
        let userObject = {
            利用開始日: user.subscription_date,
            氏名: `${user.user_first_name} ${user.user_first_name_kana}`,
            '氏名（カナ）': user.user_first_name_kana,
            生年月日: user.date_of_birth,
            メールアドレス: user.user_email,
            '電話番号（ハイフン無し）': user.user_phone,
            住所: user.postcode,
            address_1: user.address_1,
            address_2: user.address_2
        }
        this.setState({
            user: userObject,
            open: true
        })
    };

    hide = () => {
        this.setState({
            open: false,
            user: {}
        })
    };

    download = async () => {
        let { user } = this.state;
        let userData = []

        userData.push(['利用開始日,氏名,氏名（カナ）,生年月日,メールアドレス,電話番号（ハイフン無し）,住所\n'])

        Object.entries(user).map((item, index) => {
            if (index === 0) {
                userData.push([item[1].split('T')[0]])
            } else if (index === 6) {
                userData[1].push(item[1] + ' ' + user.address_1 + ' ' + user.address_2)
            } else if (index !== 7 && index !== 8) {
                userData[1].push(item[1])
            }
        })
        Helper.downloadCSVFile(userData, user.氏名)
    }

    renderUser = () => {
        let { user } = this.state;
        let list = []
        if (user) {
            Object.entries(user).map((entry, index) => {
                if (entry[0] === '住所') {
                    list.push(
                        <List.Item>
                            <p>{entry[0]}</p>
                            <p className='last-text'>
                                <p>{entry[1]}</p>
                                <p>{user.address_1}</p>
                                <p>{user.address_2}</p>
                            </p>
                        </List.Item>
                    )
                } else if (index !== 7 && index !== 8) {
                    list.push(
                        <List.Item>
                            <p>{entry[0]}</p>
                            <p>{entry[1]}</p>
                        </List.Item>
                    )
                }

            })
        }

        return (
            <List className='user-info'>
                {list}
            </List>
        )
    }

    render() {
        let { loading } = this.state;
        return (
            <Modal
                className={'user-download-modal'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <div className='close-section'>
                        <img src='/images/main-images/close-grey.svg'
                            onClick={() => this.hide()}
                        />
                    </div>
                    <div className='user-details'>
                        {this.renderUser()}
                    </div>
                    <div className={'action-section'}>
                        <Button className='primary'
                            onClick={() => this.download()}>
                            表示中の利用者情報をダウンロード（CSV）
                        </Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}