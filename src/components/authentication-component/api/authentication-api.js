import AxiosApi from '../../../api/axios-api';

export default class AuthenticationApi {

    constructor(props){
        this.body = props;
    }

    providerRegister = async(body) => {
        return await AxiosApi.call(body, `provider/register`, 'post');
    };

    userRegister = async(body) => {
        return await AxiosApi.call(body, `register`, 'post');
    };

    providerLogin = async(body) => {
        return await AxiosApi.call(body, `provider/login`, 'post');
    };

    userLogin = async(body) => {
        return await AxiosApi.call(body, `login`, 'post');
    };

    providerResetPasswordFirstStep = async(body) => {
        return await AxiosApi.call(body, `provider/password/forgot-password`, 'post');
    };

    providerResetPasswordSecondStep = async(body) => {
        return await AxiosApi.call(body, `provider/password/reset`, 'post');
    };


    userResetPasswordFirstStep = async(body) => {
        return await AxiosApi.call(body, `password/forgot-password`, 'post');
    };

    userResetPasswordSecondStep = async(body) => {
        return await AxiosApi.call(body, `password/reset`, 'post');
    };

    providerVerify = async(body) => {
        return await AxiosApi.call(body, `provider/verify`, 'post');
    };

    userVerify = async(body) => {
        return await AxiosApi.call(body, `account/verify`, 'post');
    };

    inquiry = async(body) => {
        return await AxiosApi.call(body, `inquiry`, 'post');
    }

}