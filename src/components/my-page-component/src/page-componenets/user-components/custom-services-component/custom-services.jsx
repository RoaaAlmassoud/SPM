import React from 'react';
import PageApi from "../../../../api/page-api"
import { Grid, Label, Loader, Button, Form, Input, Icon } from 'semantic-ui-react'
import Helper from "../../../../../../utils/helper"
import { ruleRunner, run } from "../../../../../../utils/ruleRunner";
import { required } from "../../../../../../utils/rules";
import update from "immutability-helper";
import AppContext from "../../../../../../context/app-context";
import EditSeriveModal from './edit-service-modal';
import DeleteSeriveModal from './delete-service-modal';

export default class CustomServices extends React.Component {
    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("service_name", 'service_name', required),
        ruleRunner("price", 'price', required),
    ];
    constructor(props) {
        super(props);
        this.pageApi = new PageApi(this);
        this.editServiceModalRef = React.createRef();
        this.deleteServiceModalRef = React.createRef();
        this.state = {
            validationErrors: {},
            showErrors: false,
            loading: false,
            loader: false,
            customServices: [
                // {
                //     image: 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg',
                //     service_name: 'test',
                //     price: 40
                // },
                // {
                //     image: 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg',
                //     service_name: 'test',
                //     price: 40
                // },
                // {
                //     image: 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg',
                //     service_name: 'test',
                //     price: 40
                // },
                // {
                //     image: 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg',
                //     service_name: 'test',
                //     price: 40
                // },
                // {
                //     image: 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg',
                //     service_name: 'test',
                //     price: 40
                // },
            ],
            innerWidth: window.innerWidth,
            serviceForm: {
                service_name: "",
                price: 0,
                image: {}
            }
        }
    }

    validateState = () => {
        this.setState({ validationErrors: run(this.state.serviceForm, this.fieldValidations) });
    };

    getCustomServices = async () => {
        let { customServices } = this.state;
        this.setState({ loading: true });
        const response = await this.pageApi.getExternalServices();
        this.setState({ loading: false });
        if (response.data) {
            if (response.data) {
                customServices = !Helper.emptyString(response.data.external_services) ?
                    response.data.external_services : []
            }
            this.setState({
                customServices: customServices,
                serviceForm: {
                    service_name: "",
                    price: 0,
                    image: {}
                }
            }, this.validateState)
        } else {
            this.props.props.notify(true, 'Error! Please try again!')
        }
    }

    componentDidMount() {
        this.getCustomServices()
    }

    changeInnerWidth = () => {
        this.setState({
            innerWidth: window.innerWidth
        })
    }

    componentWillMount() {
        window.addEventListener('resize', this.changeInnerWidth);
    }

    openEditServiceModal = (service) => {
        this.editServiceModalRef.current.show(service);
    }

    openDeleteServiceModal = (service) => {
        this.deleteServiceModalRef.current.show(service);
    }

    handleFieldChanged = (field, type = "") => {
        return (e, data) => {
            let value = type === "number" ? parseFloat(data.value) :
                type === "check" ? data.checked : data.value

            this.setState({
                serviceForm: update(this.state.serviceForm, {
                    [field]: {
                        $set: value
                    }
                }),
            }, () => {
                this.validateState()
            })
        }

    }

    handleImageChanged = (event, data, field) => {

        let file = event.target.files[0];

        this.setState({
            serviceForm: update(this.state.serviceForm, {
                [field]: {
                    $set: file
                }
            }),
            fileName: file.name
        }, () => {
            this.validateState()
        });
    }

    clicked = () => {
        window.location = window.location.origin
    };

    addService = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;
        let { serviceForm } = this.state
        this.setState({ loader: true })
        if (serviceForm.image) {
            const uploadImageResponse = await this.pageApi.uploadPhotos({ image: serviceForm.image })
            if (uploadImageResponse.data) {
                serviceForm.image = uploadImageResponse.data.path
            }
        }

        // if (Helper.isEmpty(serviceForm.image)) {
        //     serviceForm.image = 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg'
        //     // delete serviceForm.image
        // }

        const response = await this.pageApi.addExternalService(serviceForm)
        this.setState({ loader: false })
        if (response.data) {
            this.props.props.notify(false, 'Added successfully')
            this.getCustomServices()
        } else {
            this.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { loading, customServices, serviceForm, loader, innerWidth } = this.state;
        const nameError = this.context.errorFor(this.state, 'service_name', null, true);
        const priceError = this.context.errorFor(this.state, 'price', null, true);
        return (
            <div className={'custom-services'}>
                {
                    loading ?
                        <Loader active={loading} />
                        :
                        <div className='custom-services-detail'>
                            <h2>
                                {
                                    innerWidth <= 768 ?
                                        '利用中リスト'
                                        : 'ご利用中サービス一覧'
                                }
                            </h2>
                            <Form className='add-service-form'>
                                <Form.Group>
                                    <Form.Field required
                                        error={!!nameError}>
                                        <Label>サービス名称</Label>
                                        <Input
                                            value={serviceForm.service_name}
                                            onChange={this.handleFieldChanged("service_name")}
                                        />
                                    </Form.Field>
                                    <Form.Field required
                                        error={!!priceError}>
                                        <Label>料金</Label>


                                        {
                                            innerWidth <= 768 ?
                                                <div className='price-section'>
                                                    <Input
                                                        type='number'
                                                        value={serviceForm.price}
                                                        onChange={this.handleFieldChanged("price", "number")}
                                                    />
                                                    <div className='select-section'>
                                                        <div className="wrapper">
                                                            <p>画像を選択する</p>
                                                            <input type="file"
                                                                accept="image/x-png,image/gif,image/jpeg"
                                                                onChange={(event, data) => this.handleImageChanged(event, data, 'image')} />

                                                        </div>
                                                        {
                                                            serviceForm.image ?
                                                                <div className='service-image'>
                                                                    <span> {serviceForm.image.name}</span>
                                                                    {/* <img id={'image'} src={serviceForm.image} /> */}
                                                                </div>

                                                                : null
                                                        }
                                                    </div>
                                                    
                                                </div>
                                                :
                                                <Input
                                                    type='number'
                                                    value={serviceForm.price}
                                                    onChange={this.handleFieldChanged("price", "number")}
                                                />
                                        }
                                    </Form.Field>

                                </Form.Group>
                                {
                                    innerWidth <= 768 ?
                                        null :
                                        <div className='select-section'>
                                            <div className="wrapper">
                                                <p>画像を選択する</p>
                                                <input type="file"
                                                    accept="image/x-png,image/gif,image/jpeg"
                                                    onChange={(event, data) => this.handleImageChanged(event, data, 'image')} />

                                            </div>
                                            {
                                                serviceForm.image ?
                                                    <div className='service-image'>
                                                        <span> {serviceForm.image.name}</span>
                                                        {/* <img id={'image'} src={serviceForm.image} /> */}
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                }

                                <div className='action-section'>
                                    <Button loading={loader}
                                        onClick={() => this.addService()}><p><span>+</span> サービスを追加</p></Button>
                                </div>

                            </Form>

                            <div className='services-list'>
                                <Grid>
                                    <Grid.Row>

                                        {
                                            customServices ?
                                                customServices.map((service) => {
                                                    return (
                                                        <Grid.Column computer={8} mobile={16} tablet={16}>
                                                            <div className='left-section'>
                                                                <img src={`https://bonzuttner.xsrv.jp/spm-back/storage/${service.image}`} />
                                                            </div>
                                                            <div className='right-section'>
                                                                <p>{service.service_name}</p>
                                                                <p>{`¥${service.price}`}</p>
                                                                <div className='action-section'>
                                                                    <img src={'/images/main-images/edit.svg'}
                                                                        onClick={() => this.openEditServiceModal(service)} />
                                                                    <img src={'/images/main-images/delete.svg'}
                                                                        onClick={() => this.openDeleteServiceModal(service)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Grid.Column>
                                                    )
                                                })
                                                : null
                                        }

                                    </Grid.Row>

                                </Grid>
                            </div>
                            <EditSeriveModal ref={this.editServiceModalRef} props={this} getCustomServices={this.getCustomServices}/>
                            <DeleteSeriveModal ref={this.deleteServiceModalRef} props={this} getCustomServices={this.getCustomServices} />
                        </div>
                }

            </div>
        );
    }
}
