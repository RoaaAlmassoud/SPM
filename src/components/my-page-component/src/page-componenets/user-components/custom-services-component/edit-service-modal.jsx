import React from 'react';
import PageApi from "../../../../api/page-api"
import { Grid, Label, Loader, Button, Form, Input, Icon, Modal } from 'semantic-ui-react'
import Helper from "../../../../../../utils/helper"
import { ruleRunner, run } from "../../../../../../utils/ruleRunner";
import { required } from "../../../../../../utils/rules";
import update from "immutability-helper";
import AppContext from "../../../../../../context/app-context";

export default class EditSeriveModal extends React.Component {
    static contextType = AppContext;
    fieldValidations = [
        ruleRunner("service_name", 'service_name', required),
        ruleRunner("price", 'price', required),
    ];
    constructor(props) {
        super(props);
        this.pageApi = new PageApi(this);
        this.state = {
            validationErrors: {},
            showErrors: false,
            loading: false,
            serviceForm: props.serviceForm
        }
    }

    validateState = () => {
        this.setState({
            validationErrors: run(this.state.serviceForm, this.fieldValidations)
        });

    };

    componentDidMount() {
        // this.validateState()
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
                this.validateState();
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
            let reader = new FileReader();
            reader.onload = function (e) {
                let image = document.getElementById('image');
                if (image) {
                    image.src = e.target.result;
                }

            };
            reader.readAsDataURL(file);
            this.validateState()
        });
    }


    show = (service) => {
        if (service) {
            service.price = parseInt(service.price)
            this.setState({
                open: true,
                serviceForm: service,
            })
        }
    };

    hide = () => {
        this.setState({
            open: false
        })
    };

    update = async () => {
        this.setState({ showErrors: true });
        if (!Helper.isEmpty(this.state.validationErrors)) return null;
        let { serviceForm } = this.state
        this.setState({ loading: true })
        if (serviceForm.image) {
            if (typeof serviceForm.image !== 'string') {
                const uploadImageResponse = await this.pageApi.uploadPhotos({ image: serviceForm.image })
                if (uploadImageResponse.data) {
                    serviceForm.image = uploadImageResponse.data.path
                }
            }
        }

        // if (Helper.isEmpty(serviceForm.image)) {
        //     serviceForm.image = 'images/eo2yKAlO0K8PBJ8RYzAQf2SFEGhlyIxBxOwcJWeP.jpg'
        //     // delete serviceForm.image
        // }

        const response = await this.pageApi.updateExternalService(serviceForm)
        this.setState({ loading: false })
        if (response.data) {
            this.props.getCustomServices()
            this.setState({ open: false })
            this.props.props.props.props.notify(false, 'Updated successfully')
        } else {
            this.props.props.props.props.notify(true, response.message ? response.message : 'Error! Please try again!')
        }
    }

    render() {
        let { loading, serviceForm } = this.state;
        const nameError = this.context.errorFor(this.state, 'service_name', null, true);
        const priceError = this.context.errorFor(this.state, 'price', null, true);
        return (

            <Modal
                className={'add-service-modal'}
                // dimmer={'inverted'}
                open={this.state.open}
                closeOnDimmerClick={false}
            >
                <Modal.Content>
                    <p className={'header-text'}>サービス情報変更</p>
                    <Form>
                        <Form.Field inline required
                            error={!!nameError}>
                            <Label>サービス名称</Label>
                            <Input
                                value={serviceForm ? serviceForm.service_name : ""}
                                onChange={this.handleFieldChanged("service_name")}
                            />
                        </Form.Field>
                        <Form.Field inline required
                            error={!!priceError}>
                            <Label>料金</Label>
                            <Input
                                type={'number'}
                                value={serviceForm ? serviceForm.price : ''}
                                onChange={this.handleFieldChanged("price", "number")}

                            />
                        </Form.Field>
                        <div className='select-section'>
                            {
                                serviceForm ?
                                    serviceForm.image ?
                                        <div className='service-image'>
                                            <img id={'image'} src={serviceForm ? serviceForm.image ? `https://bonzuttner.xsrv.jp/spm-back/storage/${serviceForm.image}` : '' : ''} />
                                        </div>
                                        : null
                                    : null
                            }
                            <div className="wrapper">
                                <p>画像を選択する</p>
                                <input type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    onChange={(event, data) => this.handleImageChanged(event, data, 'image')} />

                            </div>
                        </div>
                    </Form>
                    <div className={'actions-section'}>
                        <Button loading={loading}
                            onClick={() => this.update()}
                        >
                            保存する
                        </Button>
                        <p onClick={() => this.hide()}>戻る</p>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }


}