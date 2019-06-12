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
//import {DatePicker, DateTimePicker, DateRangePicker, DateTimeRangePicker} from "react-advance-jalaali-datepicker";

import moment from 'moment-jalaali'
import DatePicker from 'react-datepicker2';
import {Link} from "react-router-dom";
//import 'react-datepicker2/dist/react-datepicker2.min.css';

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

        /*console.log(payload)
        return*/
        this.setState({
            message: '',
            btnDisabled: true
        })

        let response = await post("ideas/Announcements", payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت فراخوان با موفقیت انجام شد." title="هشدار سیستم"
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
                            <BreadcrumbItem><Link to="/">خانه</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/announcement">فراخوان ها</Link></BreadcrumbItem>
                            <BreadcrumbItem active>اضافه کردن فراخوان جدید</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">اضافه کردن فراخوان جدید</h1>
                            <Link to="/announcement" className="mlm-auto btn btn-primary">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست فراخوان ها
                            </Link>
                        </div>

                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs="12">
                        <Card className="p-4">
                            <CardBody>
                                <Formik
                                    initialValues={{
                                        title: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                        isPublished: true,
                                        isSpecial: true
                                    }}
                                    validationSchema={Yup.object().shape({
                                    })}
                                    onSubmit={(values, {resetForm}) => {

                                        this.formSubmit(values, resetForm);
                                    }}>
                                    {({errors, touched, setFieldValue}) => (
                                        <Form>

                                            <FormGroup row>
                                                <label>عنوان فراخوان</label>
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

                                                <label>توضیح فراخوان</label>
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
                                                <Col xs="12" md="6" className="pr-1">
                                                    <label>تاریخ شروع</label>
                                                    <div className="divDatePicker">
                                                        <DatePicker
                                                            name="startDate"
                                                            isGregorian={false}
                                                            timePicker={false}
                                                            onChange={value => setFieldValue("startDate", value._d)}
                                                            tag={Field}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col xs="12" md="6" className="pl-1">
                                                    <label>تاریخ پایان</label>
                                                    <div className="divDatePicker">
                                                        <DatePicker
                                                            name="endDate"
                                                            isGregorian={false}
                                                            timePicker={false}
                                                            onChange={value => setFieldValue("endDate", value._d)}
                                                            tag={Field}
                                                        />
                                                    </div>
                                                </Col>


                                                <FormFeedback>{errors.name}</FormFeedback>
                                            </FormGroup>

                                            <FormGroup check className="ml-2 mb-3">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isSpecial"
                                                        defaultChecked={true}
                                                        value={true}
                                                        tag={Field}
                                                    />
                                                    فراخوان ویژه
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="ml-2">
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
                                                <Button color="warning" type="submit" disabled={this.state.btnDisabled}
                                                        >
                                                    ثبت فراخوان
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
