import AxiosApi from '../../api/axios-api';

export default class MainApi {

    constructor(props){
        this.body = props;
    }

    getCategories = async(body) => {
        return await AxiosApi.call(body, `all-categories`, 'get');
    };

}