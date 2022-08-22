import React from 'react';
import './authentication-css.css';
import { Loader } from 'semantic-ui-react'
import AuthenticationApi from "../api/authentication-api"
import Helper from "../../../utils/helper"


export default class VerifyAccount extends React.Component {

    constructor(props) {
        super(props);
        this.authenticationApi = new AuthenticationApi(this);
        const urlSearchParams = new URLSearchParams(encodeURI(props.location.search));
        let email = props.location.search ? props.location.search.split('&')[0].substr(7) : ''
        const params = Object.fromEntries((urlSearchParams.entries()));
        let type = props.location.pathname === "/verify-provider" ? "provider" : "user";
        params.email = email
        this.state = {
            loading: true,
            params: params,
            type: type
        }

    }

    async componentDidMount() {
        let { type, params } = this.state;
        let body = {
            email: params.email,
            token: params.verfication_code
        }
        if (!Helper.emptyString(type)) {
            const verifyresponse = type === "provider" ? await this.authenticationApi.providerVerify(body) :
                await this.authenticationApi.userVerify(body)
            this.setState({ loading: false })
            if (verifyresponse.data) {
                this.props.notify(false, 'Operation completed successfully!')
                this.props.history.push({
                    pathname: `/login`,
                    state: { type: type }
                })
            } else {
                this.props.notify(true, 'Error, please try again!')
            }
        }
    }

    render() {
        let { loading } = this.state;
        return (
            <div className={'register-container'}>
                <Loader active={loading} />
            </div>
        );
    }


}