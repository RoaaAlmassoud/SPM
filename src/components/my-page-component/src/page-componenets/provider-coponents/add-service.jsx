import React from 'react';
import PageApi from "../../../api/page-api"
import { Form, Header, Loader, Button, Input, Label, Dropdown, TextArea, Checkbox } from 'semantic-ui-react'
import update from "immutability-helper";
import Helper from "../../../../../utils/helper"
import { ruleRunner, run } from "../../../../../utils/ruleRunner";
import { required, email } from "../../../../../utils/rules";
import AppContext from "../../../../../context/app-context";

export default class AddService extends React.Component {

    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("name", 'name', required),
        ruleRunner("price", 'price', required),
        ruleRunner("category_ids", 'category_ids', required),
        ruleRunner("kana_name", 'kana_name', required),
        ruleRunner("introduction", 'introduction', required),
        ruleRunner("overview", 'overview', required),
        ruleRunner("plan_type", 'plan_type', required),
        ruleRunner("contract_policy", 'contract_policy', required),
        ruleRunner("cancellation_policy", 'cancellation_policy', required),
        ruleRunner("simple_outline", 'simple_outline', required),
    ];
    constructor(props) {
        super(props);

        this.pageApi = new PageApi(this);
        let currentDate = new Date()
        let customFields = [{
            id: Helper.unique(),
            key: '',
            value: ''
        }]
        this.state = {
            innerWidth: window.innerWidth,
            validationErrors: {},
            showErrors: false,
            loading: false,
            loader: true,
            id: props.id ? props.id : '',
            service: {
                name: "",
                price: "",
                category_ids: null,
                kana_name: "",
                introduction: "",
                overview: "",
                plan_type: "monthly",
                contract_policy: "",
                cancellation_policy: "",
                simple_outline: "",
                custom: [],
                three_points: [],
                point1: '',
                point2: '',
                point3: '',
                url: "",
                image: "",
                images: []
            },
            customFields: customFields,
            categories: [],
            defaultImages: [],
            newImages: [],
            planTypes: [{
                key: 'monthly',
                text: 'Monthly',
                value: 'monthly'
            },
            {
                key: 'yearly',
                text: 'Yearly',
                value: 'yearly'
            },
            ]
        }
    }

    validateState = () => {
        this.setState({ validationErrors: run(this.state.service, this.fieldValidations) });
    };

    async componentDidMount() {
        let { categories, defaultImages, id, service, customFields } = this.state
        if (id) {
            const serviceResponse = await this.pageApi.getServiceDetails({ id: id })
            if (serviceResponse.data) {
                service = serviceResponse.data.service
            }
            service.category_ids = service.categories[0].id
            service.point1 = service.three_points[0]
            service.point2 = service.three_points[1]
            service.point3 = service.three_points[2]
            customFields = service.custom.map((customFielld) => {
                return {
                    id: Helper.unique(),
                    key: customFielld.key,
                    value: customFielld.value
                }
            })
            defaultImages = service.images
        }
        const response = await this.pageApi.getLeafCategories()

        if (response.data) {
            response.data.map((cat) => {
                let category = {
                    key: cat.id,
                    text: cat.name,
                    value: cat.id
                }
                categories.push(category)
            })
            if (!id) {
                const defaultImagesResponse = await this.pageApi.getDefaultImages()
                if (defaultImagesResponse.data) {
                    defaultImagesResponse.data.map((image) => {
                        defaultImages.push(`${image.image}`)
                    })
                }
            }
            this.setState({
                categories: categories,
                defaultImages: defaultImages,
                service: service,
                loader: false,
                customFields: customFields

            }, this.validateState)
        }
    }

    clicked = () => {
        window.location = window.location.origin
    };

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    handleImageChanged = (event, data, field) => {
        let addSercive = this
        let file = event.target.files[0];
        let { defaultImages, newImages, service } = this.state;
        let reader = new FileReader();

        reader.onload = function (e) {

            if (field === 'images') {
                newImages.push({
                    img: e.target.result,
                    file: file
                })
            }
          
            if (field === 'image') {
                service.image = {
                    img: e.target.result,
                    file: file
                }
            }

            addSercive.setState({
                service: service,
                fileName: file.name,
                defaultImages: defaultImages,
                newImages: newImages
            })
        };
        reader.readAsDataURL(file);

    }

    handleFieldChanged = (field, customFieldName = '', customField = {}) => {
        return (e, data) => {
            // let value = type === "number" ? parseFloat(data.value) :
            //     type === "check" ? data.checked : data.value
            let value = data.value
            let { customFields } = this.state;
            if (!Helper.emptyString(customFieldName)) {
                let currentCustomField = customFields.find(a => a.id === customField.id)
                currentCustomField[customFieldName] = value
            }
            this.setState({
                service: update(this.state.service, {
                    [field]: {
                        $set: value
                    }
                }),
                customFields: customFields
            }, this.validateState)
        }

    }

    deleteImage = (image, field = '') => {
        let { defaultImages, service } = this.state;
        if (!Helper.emptyString(field)) {
            service.image = ''
        } else {
            defaultImages = defaultImages.filter(a => a !== image)
            service.images = service.images.filter(a => a !== image)
        }
        this.setState({
            defaultImages: defaultImages,
            service: service
        })
    }

    addCustomField = () => {
        let { customFields } = this.state;
        customFields.push({
            id: Helper.unique(),
            key: '',
            value: ''
        })
        this.setState({
            customFields: customFields
        })
    }

    deleteCustomField = (field) => {
        let { customFields } = this.state;
        if (customFields.length > 1) {
            customFields = customFields.filter(a => a.id !== field.id)
        }
        this.setState({
            customFields: customFields
        })
    }

    handleAction = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;
        let { service, customFields, defaultImages, newImages, id } = this.state;
        let body = service
        this.setState({ loading: true })
        body.custom = customFields.map((field) => {
            return {
                key: field.key,
                value: field.value
            }
        })

        let points = []
        if (service.point1) {
            points.push(service.point1)
        }
        if (service.point2) {
            points.push(service.point2)
        }
        if (service.point3) {
            points.push(service.point3)
        }
        body.three_points = points

        if (body.image) {
            const uploadImageResponse = await this.pageApi.uploadPhotos({ image: body.image.file })

            if (uploadImageResponse.data) {
                body.image = uploadImageResponse.data.path
            }
        }


        if (!id) {
            if (defaultImages) {
                defaultImages.map((img) => {
                    body.images.push(img)
                })
            }
        }


        if (!Helper.emptyString(newImages)) {
            for (let item of newImages) {
                const uploadImageResponse = await this.pageApi.uploadPhotos({ image: item.file })
                if (uploadImageResponse.data) {
                    body.images.push(uploadImageResponse.data.path)
                }

            }

        }
        const response = id ? await this.pageApi.editService(body) : await this.pageApi.addService(body)
        this.setState({ loading: false })
        if (response.data) {
            this.props.props.notify(false, 'Added successfully')
        } else {
            this.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { loading, categories, service, defaultImages,
            customFields, planTypes, loader, innerWidth, newImages, id } = this.state;


        const nameError = this.context.errorFor(this.state, 'name', null, true);
        const priceError = this.context.errorFor(this.state, 'price', null, true);

        const categoryIdsError = this.context.errorFor(this.state, 'category_ids', null, true);
        const kanaNameError = this.context.errorFor(this.state, 'kana_name', null, true);
        const introductionError = this.context.errorFor(this.state, 'introduction', null, true);
        const overviewError = this.context.errorFor(this.state, 'overview', null, true);
        const planTypeError = this.context.errorFor(this.state, 'plan_type', null, true);
        const contractPolicyError = this.context.errorFor(this.state, 'contract_policy', null, true);
        const cancellationPolicyError = this.context.errorFor(this.state, 'cancellation_policy', null, true);
        const simpleOutlineError = this.context.errorFor(this.state, 'simple_outline', null, true);

        return (
            <div className={'add-service'}>
                {
                    loader ?
                        <Loader active={loader} />
                        :
                        <>
                            <div className='select-images'>
                                <img src='/images/main-images/cloud.svg' />
                                {
                                    innerWidth <= 768 ?
                                        null :
                                        <>
                                            <p className='first-header'>{'ドラッグ&ドロップでアップロード'}</p>
                                            <p className='second-header'>{'対象ファイル：PNG / JPG / SVG （2MBまで）'}</p>
                                        </>

                                }
                                <div className='select-section'>
                                    {
                                        innerWidth <= 768 ?
                                            null :
                                            <p>または</p>
                                    }

                                    <div className="wrapper">
                                        <p>ファイルを選択</p>
                                        <input type="file"
                                            accept="image/x-png,image/gif,image/jpeg"
                                            onChange={(event, data) => this.handleImageChanged(event, data, 'image')} />

                                    </div>
                                    {
                                        innerWidth <= 768 ?
                                            <p className='second-header'>{'対象ファイル：PNG / JPG / SVG （2MBまで）'}</p>
                                            : null
                                    }
                                    {
                                        service.image ?
                                            <div className='service-image'>
                                                <img src="/images/main-images/default-close.svg"
                                                    onClick={() => this.deleteImage(service.image, 'image')}
                                                />
                                                <img id={'image'} src={
                                                    typeof service.image === 'string' ?
                                                        `https://bonzuttner.xsrv.jp/spm-back/storage/${service.image}`
                                                        : service.image.img} />
                                            </div>
                                            : null
                                    }

                                </div>
                            </div>
                            <Form>
                                <Form.Field required
                                    error={!!categoryIdsError}>
                                    <Label>サービスカテゴリー</Label>
                                    <Dropdown
                                        search
                                        fluid
                                        selection
                                        selectOnBlur={false}
                                        value={service.category_ids}
                                        placeholder={'選択する'}
                                        onChange={this.handleFieldChanged('category_ids')}
                                        clearable
                                        options={categories}
                                    />
                                </Form.Field>
                                <Form.Field required
                                    error={!!nameError}>
                                    <Label>サービス名称</Label>
                                    <Input
                                        placeholder={'サービス名称'}
                                        onChange={this.handleFieldChanged('name')}
                                        value={service.name}
                                    />
                                </Form.Field>
                                <Form.Field required
                                    error={!!kanaNameError}>
                                    <Label>サービスカナ</Label>
                                    <Input
                                        placeholder={'サービスカナ'}
                                        onChange={this.handleFieldChanged('kana_name')}
                                        value={service.kana_name}
                                    />
                                </Form.Field>
                                {/* <Form.Field required
                                    error={!!planTypeError}>
                                    <Label>プランタイプ</Label>
                                    <Dropdown
                                        search
                                        fluid
                                        selection
                                        selectOnBlur={false}
                                        value={service.plan_type}
                                        onChange={this.handleFieldChanged('plan_type')}
                                        clearable
                                        placeholder={'プランタイプ'}
                                        options={planTypes}
                                    />
                                </Form.Field> */}
                                <Form.Field required
                                    error={!!contractPolicyError}>
                                    <Label>契約方針</Label>
                                    <Input
                                        onChange={this.handleFieldChanged('contract_policy')}
                                        value={service.contract_policy}
                                    />
                                </Form.Field>

                                <Form.Field required
                                    error={!!cancellationPolicyError}>
                                    <Label>取り消し規約</Label>
                                    <Input
                                        onChange={this.handleFieldChanged('cancellation_policy')}
                                        value={service.cancellation_policy}
                                    />
                                </Form.Field>
                                <Form.Field required
                                    error={!!simpleOutlineError}>
                                    <Label>簡単な概要</Label>
                                    <Input
                                        onChange={this.handleFieldChanged('simple_outline')}
                                        value={service.simple_outline}
                                    />
                                </Form.Field>

                                <Form.Field required
                                    error={!!overviewError}>
                                    <Label>サービス概要（一覧画面にのみ表示されます）</Label>
                                    <TextArea
                                        rows={2}
                                        value={service.overview}
                                        onChange={this.handleFieldChanged('overview')}
                                    />
                                </Form.Field>

                                <Form.Field className={'three-points-field'}>
                                    <Label>３つのポイント</Label>
                                    <Input
                                        placeholder={'ポイント'}
                                        onChange={this.handleFieldChanged('point1')}
                                        value={service.point1}
                                    />
                                    <Input
                                        placeholder={'ポイント'}
                                        onChange={this.handleFieldChanged('point2')}
                                        value={service.point2}
                                    />
                                    <Input
                                        placeholder={'ポイント'}
                                        onChange={this.handleFieldChanged('point3')}
                                        value={service.point3}
                                    />
                                </Form.Field>

                                <div className='select-images default'>
                                    <img src='/images/main-images/cloud.svg' />
                                    {
                                        innerWidth <= 768 ?
                                            null :
                                            <>
                                                <p className='first-header'>{'ドラッグ&ドロップでアップロード'}</p>
                                                <p className='second-header'>{'対象ファイル：PNG / JPG / SVG （2MBまで）'}</p>
                                            </>
                                    }
                                    <div className='select-section'>
                                        {
                                            innerWidth <= 768 ?
                                                null :
                                                <p>または</p>
                                        }

                                        <div className="wrapper">
                                            <p>ファイルを選択</p>
                                            <input type="file"
                                                accept="image/x-png,image/gif,image/jpeg"
                                                onChange={(event, data) => this.handleImageChanged(event, data, 'images')} />
                                        </div>
                                        {
                                            innerWidth <= 768 ?
                                                <p className='second-header'>{'対象ファイル：PNG / JPG / SVG （2MBまで）'}</p>
                                                : null
                                        }
                                        {/* {
                                            service.image ?
                                                <div className='service-image'>
                                                    <img src="/images/main-images/default-close.svg"
                                                        onClick={() => this.deleteImage(service.image, 'image')}
                                                    />
                                                    <img id={'image2'} src={service.image} />
                                                </div>

                                                : null
                                        } */}
                                    </div>

                                </div>
                                <div className='default-images-section'>

                                    {
                                        defaultImages.map((image, index) => {

                                            if (index === defaultImages.length - 1) {

                                                return (
                                                    <>
                                                        <div className='one-image'>
                                                            <img src="/images/main-images/default-close.svg"
                                                                onClick={() => this.deleteImage(image)} />
                                                            <img src={typeof image === 'string' ?
                                                                `https://bonzuttner.xsrv.jp/spm-back/storage/${image}`
                                                                : image.img
                                                            } />
                                                        </div>
                                                        {
                                                            newImages.map((newImage) => {
                                                                return (
                                                                    <div className='one-image'>
                                                                        <img src="/images/main-images/default-close.svg"
                                                                            onClick={() => this.deleteImage(newImage)} />
                                                                        <img src={typeof newImage === 'string' ?
                                                                            `https://bonzuttner.xsrv.jp/spm-back/storage/${newImage}`
                                                                            : newImage.img
                                                                        } />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <div className='one-image'>
                                                        <img src="/images/main-images/default-close.svg"
                                                            onClick={() => this.deleteImage(image)} />
                                                        <img src={typeof image === 'string' ?
                                                            `https://bonzuttner.xsrv.jp/spm-back/storage/${image}`
                                                            : image.img
                                                        } />
                                                    </div>

                                                )
                                            }

                                        })
                                    }
                                </div>
                                <Form.Field required
                                    error={!!introductionError}>
                                    <Label>サービス紹介</Label>
                                    <TextArea
                                        rows={10}
                                        value={service.introduction}
                                        onChange={this.handleFieldChanged('introduction')}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Label>その他の情報</Label>
                                    <div className='custom-fields-section'>
                                        {
                                            customFields.map((field) => {
                                                return (<div className='one-custom'>
                                                    <img className='close-img'
                                                        onClick={() => this.deleteCustomField(field)}
                                                        src={"/images/main-images/close-grey.svg"} />
                                                    <Input
                                                        value={field.key}
                                                        onChange={this.handleFieldChanged("custom-fields", "key", field)}
                                                    />
                                                    <div className='value-section'>
                                                        <img src='/images/main-images/bars.svg' />
                                                        <TextArea
                                                            value={field.value}
                                                            onChange={this.handleFieldChanged("custom-fields", "value", field)}
                                                        />
                                                    </div>
                                                </div>
                                                )
                                            })
                                        }
                                        <div className='add-section' onClick={() => this.addCustomField()}>
                                            <img src='/images/main-images/add-rounded.svg' />
                                        </div>
                                    </div>
                                </Form.Field>

                                <Form.Field>
                                    <Label>契約区分</Label>
                                    <Form.Group widths={'equal'}>
                                        <Form.Field>
                                            <Checkbox
                                                radio
                                                label='月間契約'
                                                name='checkboxRadioGroup2'
                                                value={'monthly'}
                                                checked={service.plan_type === 'monthly'}
                                                onChange={this.handleFieldChanged("plan_type")}
                                            />
                                            <Checkbox
                                                radio
                                                label='年間契約'
                                                name='checkboxRadioGroup2'
                                                value={'yearly'}
                                                checked={service.plan_type === 'yearly'}
                                                onChange={this.handleFieldChanged("plan_type")}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form.Field>
                                <Form.Field required
                                    error={!!priceError}>
                                    <Label>料金</Label>
                                    <Input
                                        placeholder={'1000'}
                                        onChange={this.handleFieldChanged('price')}
                                        value={service.price}
                                    />
                                </Form.Field>
                                <div className='action-section'>
                                    <Button loading={loading}
                                        onClick={() => this.handleAction()}
                                    >登録</Button>
                                </div>

                            </Form>
                        </>
                }

            </div >
        );
    }
}
