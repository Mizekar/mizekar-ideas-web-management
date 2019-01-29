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
import {post} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";

class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            btnDisabled: false,

        }

    }

    componentDidMount() {

    }


    async formSubmit(payload, reset) {
        this.setState({
            message: '',
            btnDisabled: true
        })


        let response = await post("ideas/optionsets", payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت ویژگی با موفقیت انجام شد." title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false
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
                            <BreadcrumbItem tag="a" href="#/ideaOptionSets">ویژگی سوژه ها</BreadcrumbItem>
                            <BreadcrumbItem active>اضافه کردن ویژگی جدید</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">اضافه کردن ویژگی جدید</h1>
                            <a href="#/ideaOptionSets">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست ویژگی سوژه ها
                            </a>
                        </div>

                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs="12">


                        <Formik
                            initialValues={{
                                title: '',
                                description: '',
                                displayOrder: '',
                                isMultiSelect: false,
                                isRequired: false
                            }}
                            validationSchema={Yup.object().shape({
                                displayOrder: Yup.number()
                                    .required('تکمیل اولویت نمایش الزامی است')
                                    .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد.")
                            })}
                            onSubmit={(values, {resetForm}) => {
                                this.formSubmit(values, resetForm);
                            }}>
                            {({errors, touched}) => (
                                <Form>
                                    <Card className="p-4">
                                        <CardBody>
                                            <FormGroup row>
                                                <label>عنوان ویژگی</label>
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

                                                <label>توضیح ویژگی</label>
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
                                                        defaultChecked={false}
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
                                                        defaultChecked={false}
                                                        tag={Field}
                                                    />
                                                    اجباری
                                                </Label>
                                            </FormGroup>


                                        </CardBody>
                                    </Card>
                                    <FormGroup tag="fieldset">
                                        <legend>آیتم های ویژگی</legend>
                                    </FormGroup>
                                    <Card className="p-0">
                                        <CardBody>
                                            <Row>
                                                <Col sm="6">
                                                    <Input type="text" name="titleItem[]" id="titleItem"
                                                           placeholder="عنوان آیتم"/>
                                                </Col>
                                                <Col sm="3">
                                                    <Input type="number" name="weight[]" id="weight"
                                                           placeholder="وزن آیتم"/>
                                                </Col>
                                                <Col sm="2">
                                                    <FormGroup check className="p-2">
                                                        <Label check>
                                                            <Input
                                                                type="checkbox"
                                                                name="isDisabled"
                                                                defaultChecked={false}
                                                                tag={Field}
                                                            />
                                                            غیر فعال
                                                        </Label>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm="1" className="remove-items">
                                                    <i className="fa fa-times-circle-o"></i>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Row className="mt-4 mb-4">
                                        <Col xs="12">
                                            <Button color="warning" type="submit" disabled={this.state.btnDisabled}
                                                    className="px-4">
                                                ثبت ویژگی
                                            </Button>
                                            {this.state.btnDisabled && <div className="loading-box">
                                                <Loading/>
                                                <span className="loading-box-text">
                                                        در حال ارسال اطلاعات. لطفا منتظر بمانید...
                                                    </span>

                                            </div>
                                            }
                                        </Col>

                                    </Row>
                                </Form>
                            )}
                        </Formik>


                    </Col>
                </Row>

            </div>
        );
    }

}

export default Add;