
import AxiosApi from '../../../api/axios-api';

export default class ServiceApi {

    constructor(props){
        this.body = props;
    }

    getServiceDetails = async(body) => {
        return await AxiosApi.call(body, `service/${body.id}`, 'get');
    };

    subscripe = async(body) => {
        return await AxiosApi.call(body, `subscription`, 'post');
    };

    unsubscripe = async(body) => {
        return await AxiosApi.call(body, `subscription/${body.id}`, 'delete');
    };

    addToWishList = async(body) => {
        return await AxiosApi.call(body, `wishlist`, 'post');
    };

    deleteFromWishList = async(body) => {
        return await AxiosApi.call(body, `wishlist/${body.id}`, 'delete');
    };
}