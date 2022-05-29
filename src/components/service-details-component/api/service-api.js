
import AxiosApi from '../../../api/axios-api';

export default class ServiceApi {

    constructor(props){
        this.body = props;
    }

    getServiceDetails = async(body) => {
        return await AxiosApi.call(body, `service/${body.id}`, 'get');
    };
}