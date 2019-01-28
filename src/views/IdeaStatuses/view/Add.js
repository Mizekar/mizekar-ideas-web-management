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
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import { post} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";

class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            btnDisabled:false,

        }

    }

    componentDidMount() {

    }


    async formSubmit(payload,reset) {
        this.setState({
            message: '',
            btnDisabled:true
        })

        let response = await post("ideas/status", payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت وضعیت با موفقیت انجام شد." title="هشدار سیستم" icon="fa fa-check-square-o"/>,
                btnDisabled:false
            })
            reset()

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
                            <BreadcrumbItem tag="a" href="#/ideaStatuses">وضعیت سوژه ها</BreadcrumbItem>
                            <BreadcrumbItem active>اضافه کردن وضعیت جدید</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">اضافه کردن وضعیت جدید</h1>
                            <a href="#/ideaStatuses">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست وضعیت سوژه ها
                            </a>
                        </div>

                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs="12">
                        <Card className="p-4">
                            <CardBody>
                                <Formik
                                    initialValues={{
                                        name: '',
                                        description: '',
                                        displayOrder: '',
                                        isPublished: true,
                                        hexColor:'#ffffff'
                                    }}
                                    validationSchema={Yup.object().shape({
                                        displayOrder: Yup.number()
                                            .required('تکمیل اولویت نمایش الزامی است')
                                            .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد.")
                                    })}
                                    onSubmit={(values,{resetForm}) => {
                                        //console.log(values);
                                        this.formSubmit(values,resetForm);
                                    }}>
                                    {({errors, touched}) => (
                                        <Form>

                                            <FormGroup row>
                                                <label>عنوان وضعیت</label>
                                                <Input
                                                    name="name"
                                                    type="text"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.name && touched.name}
                                                />

                                                <FormFeedback>{errors.name}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup row>

                                                <label>توضیح وضعیت</label>
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
                                                <label>رنگ وضعیت</label>
                                                <Input
                                                    name="hexColor"
                                                    type="color"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.hexColor && touched.hexColor}
                                                />

                                                <FormFeedback>{errors.hexColor}</FormFeedback>
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
                                            <FormGroup check>
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isPublished"
                                                        defaultChecked={true}
                                                        value={true}
                                                        tag={Field}
                                                    />
                                                    منتشر شود
                                                </Label>
                                            </FormGroup>
                                            <Row className="mt-4">
                                                <Button color="warning" type="submit" disabled={this.state.btnDisabled} className="px-4">
                                                    ثبت وضعیت
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }

}

export default Add;