import AxiosApi from '../../../api/axios-api';

export default class PageApi {

    constructor(props) {
        this.body = props;
    }

    getRevenue = async (body) => {
        return await AxiosApi.call(body, `provider/get-revenue?year=${body.year}&month=${body.month}`, 'get');
    };

    getMyServices = async (body) => {
        return await AxiosApi.call(body, `provider/my-services?page=1&page_size=10`, 'get');
    };

    getLeafCategories = async (body) => {
        return await AxiosApi.call(body, `get-leaf-categories`, 'get');
    }

    getDefaultImages = async (body) => {
        return await AxiosApi.call(body, `get-default-images`, 'get');
    }

    uploadPhotos = async (body) => {
        let bodyFormData = new FormData();
        bodyFormData.append('image', body.image);

        return await AxiosApi.call(bodyFormData, `upload-image`, 'post');
    };

    addService = async (body) => {
        return await AxiosApi.call(body, `service`, 'post');
    }

    editService = async (body) => {
        return await AxiosApi.call(body, `service/${body.id}`, 'put');
    }

    getProviderAccount = async (body) => {
        return await AxiosApi.call(body, `provider/account`, 'get')
    }

    updateProviderAccount = async (body) => {
        return await AxiosApi.call(body, `provider/update-account`, 'put')
    }

    updateProviderFinancialAccount = async (body) => {
        return await AxiosApi.call(body, `provider/update-financial-info`, 'put')
    }

    getWishList = async (body) => {
        return await AxiosApi.call(body, `wishlist?page=1&page_size=10`, 'get')
    }

    getUserAccount = async (body) => {
        return await AxiosApi.call(body, `account`, 'get')
    }

    updateUserAccount = async (body) => {
        return await AxiosApi.call(body, `update-account`, 'put')
    }

    getSubscriptionHistory = async (body) => {
        return await AxiosApi.call(body, `subscription-history?page=1&page_size=10`, 'get')
    }

    getExternalServices = async (body) => {
        return await AxiosApi.call(body, `get-external-services?page=1&page_size=10`, 'get')
    }

    addExternalService = async (body) => {
        return await AxiosApi.call(body, `add-external-service`, 'post')
    }

    updateExternalService = async (body) => {
        return await AxiosApi.call(body, `external-service/${body.id}`, 'put')
    }

    deleteExternalService = async (body) => {
        return await AxiosApi.call(body, `external-service/${body.id}`, 'delete')
    }

    deleteUser = async (body) => {
        return await AxiosApi.call(body, `delete-account`, 'delete')
    }

    deleteProvider = async (body) => {
        return await AxiosApi.call(body, `provider/delete-account`, 'delete')
    }

    getServiceDetails = async(body) => {
        return await AxiosApi.call(body, `service/${body.id}`, 'get');
    };

    deletePorviderService = async (body) => {
        return await AxiosApi.call(body, `service/${body.id}`, 'delete')
    }

    getAllServiceSubscribers = async (body) => {
        return await AxiosApi.call(body, `provider/get-subscribers?page=1&page_size=10&service_id=${body.service_id}&criteria=${body.criteria}`, 'get')
    }
}