import React, {Component} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem, Button, Card,
    CardBody,
    Col, FormFeedback,
    FormGroup, Input,
    Label,
    Row
} from "reactstrap";
import {Field, FieldArray, Form, Formik, getIn} from "formik";
import * as Yup from "yup";
import {get, post, put, remove} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";
import {confirmAlert} from "react-confirm-alert";

const ErrorMessage = ({name}) => (
    <Field
        name={name}
        className="invalid-feedback"
        render={({form}) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            return touch && error ? <div className="invalid-item">{error}</div> : null;
        }}
    />
);

class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            btnDisabled: false,
            id: props.id,
            loadData: false,
            items: []

        }

    }

    componentDidMount() {
        this.getById();
    }

    async getById() {
        let response = await get("ideas/optionsets/details/" + this.state.id, {});

        //console.log(response)

        let items = await get("ideas/optionsets/" + this.state.id + "/items", {});

        console.log(items)
        this.setState({
            title: response.title,
            description: response.description,
            displayOrder: response.displayOrder,
            isMultiSelect: response.isMultiSelect,
            isRequired: response.isRequired,
            items: items,
            loadData: true,
        })
    }

    async formSubmit(payload) {
        this.setState({
            message: '',
            btnDisabled: true
        })

        console.log(payload);

        let response = await put("ideas/optionsets/" + this.state.id, {
            title: payload.title,
            description: payload.description,
            displayOrder: payload.displayOrder,
            isMultiSelect: payload.isMultiSelect,
            isRequired: payload.isRequired
        });

        if (typeof response === 'string') {

            await Promise.all(payload.items.map(async (data) => {
                if (data.id) {
                    await put("ideas/optionsets/item/" + data.id, {
                        ideaOptionSetId: this.state.id,
                        title: data.title,
                        displayOrder: data.displayOrder,
                        weight: data.weight,
                        isDisabled: data.isDisabled
                    });
                } else {
                    await post("ideas/optionsets/item", {
                        ideaOptionSetId: this.state.id,
                        title: data.title,
                        displayOrder: data.displayOrder,
                        weight: data.weight,
                        isDisabled: data.isDisabled
                    });
                }
                //console.log(data)

            }))


            this.setState({
                message: <ModalAlert type="success" message="ثبت ویرایش دسته بندی با موفقیت انجام شد."
                                     title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false
            })

        }


    }

    confirmDelete(id, index, arrayHelpers) {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-box'>
                        <h4>تایید حذف!</h4>
                        <p>آیا نسبت به حذف این آیتم مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDelete(id, index, arrayHelpers)
                            onClose()
                        }}>بله آیتم را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDelete(id, index, arrayHelpers) {

        let response = '';
        if (id) {
            response = await remove("ideas/optionsets/item/" + id);
        }


        if (typeof response === 'string' || !id) {
            arrayHelpers.remove(index)
        }


    }

    render() {
        return (

            <div className="animated fadeIn">
                {this.state.message}

                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
                            <BreadcrumbItem tag="a" href="#/assessments">ارزیابی ها</BreadcrumbItem>
                            <BreadcrumbItem active>ویرایش کردن ارزیابی جدید</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">ویرایش کردن ارزیابی</h1>
                            <a href="#/assessments">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست ارزیابی ها
                            </a>
                        </div>

                    </Col>
                </Row>

                {!this.state.loadData &&
                <div className="m-5">

                    <div className="loading-box">
                        <Loading color="#E8B51D"/>
                        <span className="loading-box-text">
                            در حال دریافت اطلاعات. لطفا منتظر بمانید
                    </span>

                    </div>
                </div>
                }
                {this.state.loadData &&
                <Row className="mt-4">
                    <Col xs="12">

                        <Formik
                            initialValues={{
                                title: this.state.title,
                                description: this.state.description,
                                displayOrder: this.state.displayOrder,
                                isMultiSelect: this.state.isMultiSelect,
                                isRequired: this.state.isRequired,
                                items: this.state.items
                            }}
                            validationSchema={Yup.object().shape({
                                displayOrder: Yup.number()
                                    .required('تکمیل اولویت نمایش الزامی است')
                                    .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد."),
                                items: Yup.array()
                                    .of(
                                        Yup.object().shape({
                                            displayOrder: Yup.number()
                                                .typeError("تکمیل اولویت الزامی و باید به صورت عددی باشد.")
                                                .required('تکمیل اولویت نمایش الزامی است'),

                                            weight: Yup.number()
                                                .required('تکمیل وزن آیتم الزامی است')
                                                .typeError("تکمیل وزن الزامی و باید به صورت عددی باشد."),
                                        })
                                    )
                                    .required('وارد کردن آیتم برای ارزیابی الزامی است.') // these constraints are shown if and only if inner constraints are satisfied
                                    .min(2, 'وارد کردن حداقل 2 آیتم برای ارزیابی الزامی است.'),
                            })}
                            onSubmit={(values, {resetForm}) => {
                                this.formSubmit(values, resetForm);
                            }}>
                            {({errors, touched, values}) => (
                                <Form>
                                    <Card className="p-4">
                                        <CardBody>
                                            <FormGroup row>
                                                <label>عنوان ارزیابی</label>
                                                <Input
                                                    name="title"
                                                    type="text"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.title && touched.title}
                                                />

                                                <FormFeedback>{errors.title}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup row>

                                                <label>توضیح ارزیابی</label>
                                                <Input
                                                    name="description"
                                                    type="textarea"
                                                    component="textarea"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.description && touched.description}
                                                />

                                                <FormFeedback>{errors.description}</FormFeedback>


                                            </FormGroup>
                                            <FormGroup row>
                                                <label>اولویت نمایش</label>
                                                <Input
                                                    name="displayOrder"
                                                    type="number"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.displayOrder && touched.displayOrder}
                                                />

                                                <FormFeedback>{errors.displayOrder}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup check className="mr-2 mt-3">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isMultiSelect"
                                                        defaultChecked={this.state.isMultiSelect}
                                                        tag={Field}
                                                    />
                                                    چند انتخابی
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mr-2 mt-3">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isRequired"
                                                        defaultChecked={this.state.isRequired}
                                                        tag={Field}
                                                    />
                                                    اجباری
                                                </Label>
                                            </FormGroup>


                                        </CardBody>
                                    </Card>
                                    <FormGroup tag="fieldset">
                                        <legend>آیتم های ارزیابی</legend>
                                    </FormGroup>
                                    {/*{
                                        Object.keys(this.state.items).map((key) => {
                                            return this.state.items[key]
                                        })
                                    }*/}
                                    <FieldArray
                                        name="items"
                                        render={(arrayHelpers) => (
                                            <div>
                                                {values.items.map((data, index) => (
                                                    <Card className="p-0 mb-2">
                                                        <CardBody>
                                                            <Row className="align-items-start">
                                                                <Input
                                                                    type="hidden"
                                                                    name={`items[${index}].id`}
                                                                    tag={Field}
                                                                />
                                                                <Col sm="4">
                                                                    <Input
                                                                        type="text"
                                                                        tag={Field}
                                                                        name={`items[${index}].title`}
                                                                        placeholder="عنوان آیتم"
                                                                    />
                                                                </Col>
                                                                <Col sm="3">

                                                                    <Input
                                                                        type="number"
                                                                        name={`items[${index}].displayOrder`}
                                                                        tag={Field}
                                                                        placeholder="اولویت نمایش"
                                                                        /*invalid={errors.displayOrder && touched.displayOrder}*/
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`items[${index}].displayOrder`}/>

                                                                </Col>
                                                                <Col sm="3">
                                                                    <Input
                                                                        type="number"
                                                                        tag={Field}
                                                                        name={`items[${index}].weight`}
                                                                        placeholder="وزن آیتم"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`items[${index}].weight`}/>
                                                                </Col>
                                                                <Col sm="1">

                                                                    <FormGroup check className="p-2">
                                                                        <Label check>
                                                                            <Input
                                                                                type="checkbox"
                                                                                tag={Field}
                                                                                name={`items[${index}].isDisabled`}
                                                                                defaultChecked={data.isDisabled}
                                                                            />
                                                                            غیر فعال
                                                                        </Label>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col sm="1" className="remove-items">

                                                                    <i className="fa fa-times-circle-o"
                                                                       onClick={() => this.confirmDelete(data.id, index, arrayHelpers)}>

                                                                    </i>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>

                                                ))}
                                                {typeof errors.items === 'string' ?
                                                    <div className="invalid-item">{errors.items}</div> : null}
                                                <Row className="mt-4 mb-4">
                                                    <Col xs="12">
                                                        <a className="btn btn-transparent btn-add"
                                                           onClick={() => arrayHelpers.push({
                                                               title: '',
                                                               displayOrder: '',
                                                               weight: '',
                                                               isDisabled: false
                                                           })}>
                                                            <i className="fa fa-plus"></i> اضافه کردن آیتم جدید
                                                        </a>
                                                    </Col>
                                                </Row>

                                            </div>
                                        )}
                                    />

                                    {/* {let FriendArrayErrors = errors =>
                                    typeof errors.friends === 'string' ? <div>{errors.friends}</div> : null;}*/}

                                    <Row className="mt-4 mb-4 mr-1">

                                        <Button color="warning" type="submit" disabled={this.state.btnDisabled}
                                                className="px-4">
                                            ثبت ویرایش ارزیابی
                                        </Button>
                                        {this.state.btnDisabled && <div className="loading-box">
                                            <Loading/>
                                            <span className="loading-box-text">
                                                        در حال ارسال اطلاعات. لطفا منتظر بمانید...
                                                </span>

                                        </div>
                                        }


                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
                }

            </div>
        );

    }

}

export default Edit;