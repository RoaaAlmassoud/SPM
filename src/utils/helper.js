
export default class HelperFunctions {
    static isEmpty = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    static getResponseData = (response) => {
        if (this.isEmpty(response)) return null;
        let result = {};

        if (response.status === 200) {
            if(response.data){
                result['data'] = response.data.data? response.data.data: response;
            } else {
                result['data'] = response
            }

        }

        if (response.status !== 200) {
            result = response.data;

        }

        return !this.isEmpty(result) ? result : null;
    };


    static isObject = (obj) => typeof obj === 'object';

    static unique = () => Math.random().toString().substr(2, 8);

    static empty = (value) => {
        return value || '-'
    };

    static emptyString(value) {
        return (typeof value === "undefined" || typeof value === 'undefined' || typeof value === undefined || value === null || value === '' || value === "" || value.length === 0 || value === 'undefined');
    }

    static getMonthName(id) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        if(monthNames[id]){
            return monthNames[id]
        } else {
            return null
        }

    }

    static downloadCSVFile = (data, filename) => {
        const element = document.createElement("a")
        var csv = 'createdDate,name,email,phoneNumber\n';
        const file = new Blob(data, {type: 'text/csv,charset=utf-8'})
        element.href = URL.createObjectURL(file)
        element.download = filename
        document.body.appendChild(element)
        element.click()
    }

}