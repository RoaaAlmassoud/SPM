import AxiosApi from '../../../api/axios-api';

export default class TopApi {

    constructor(props){
        this.body = props;
    }

    getHomePage = async(body) => {
        return await AxiosApi.call(body, `get-homepage`, 'get');
    };

    searchService = async(body) => {
        return await AxiosApi.call(body, `search-services`, 'get');
    };
}