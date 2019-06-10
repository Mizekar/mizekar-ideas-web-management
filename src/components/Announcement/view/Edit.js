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
import {get, put} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";

import DatePicker from 'react-datepicker2';
//import 'react-datepicker2/dist/react-datepicker2.min.css';
import moment from 'moment-jalaali'

class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            btnDisabled: false,
            id: props.id,
            loadData: false

        }

    }

    componentDidMount() {
        this.getById();
    }


    async getById() {
        let response = await get("ideas/Announcements/" + this.state.id, {});

        this.setState({
            title: response.title,
            description: response.description,
            isPublished: response.isPublished,
            isSpecial: response.isSpecial,
            loadData: true,
            startDate: moment(response.startDate),
            endDate: moment(response.endDate),
            startDateInitial: (response.startDate),
            endDateInitial: (response.endDate),
        })

    }

    async formSubmit(payload) {

        this.setState({
            message: '',
            btnDisabled: true
        })

        let response = await put("ideas/Announcements/" + this.state.id, payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت ویرایش فراخوان با موفقیت انجام شد."
                                     title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false
            })

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
                            <BreadcrumbItem tag="a" href="#/announcement">فراخوان ها</BreadcrumbItem>
                            <BreadcrumbItem active>ویرایش کردن فراخوان</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">ویرایش کردن فراخوان</h1>
                            <a href="#/announcement">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست فراخوان ها
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
                        <Card className="p-4">
                            <CardBody>
                                <Formik
                                    initialValues={{
                                        title: this.state.title,
                                        description: this.state.description,
                                        isSpecial: this.state.isSpecial,
                                        isPublished: this.state.isPublished,
                                        startDate: this.state.startDateInitial,
                                        endDate: this.state.endDateInitial,

                                    }}
                                    validationSchema={Yup.object().shape({})}
                                    onSubmit={(values) => {
                                        this.formSubmit(values);
                                    }}>
                                    {({values, errors, touched, setFieldValue}) => (
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

                                                <FormFeedback>{errors.name}</FormFeedback>
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
                                                <Col xs="12" md="6" className="pr-0">
                                                    <label>تاریخ شروع</label>
                                                    <div className="divDatePicker">
                                                        <DatePicker
                                                            name="startDate"
                                                            isGregorian={false}
                                                            timePicker={false}
                                                            value={this.state.startDate}
                                                            onChange={value => setFieldValue("startDate", value._d)}
                                                            tag={Field}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col xs="12" md="6" className="pl-0">
                                                    <label>تاریخ پایان</label>
                                                    <div className="divDatePicker">
                                                        <DatePicker
                                                            name="endDate"
                                                            isGregorian={false}
                                                            timePicker={false}
                                                            value={this.state.endDate}
                                                            onChange={value => setFieldValue("endDate", value._d)}
                                                            tag={Field}
                                                        />
                                                    </div>
                                                </Col>


                                                <FormFeedback>{errors.name}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup check className="mr-2 mb-3">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isSpecial"
                                                        defaultChecked={this.state.isSpecial}
                                                        tag={Field}
                                                    />
                                                    فراخوان ویژه
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className="mr-2">
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name="isPublished"
                                                        defaultChecked={this.state.isPublished}
                                                        tag={Field}
                                                    />
                                                    منتشر شود
                                                </Label>
                                            </FormGroup>
                                            <Row className="mt-4">
                                                <Button color="warning" type="submit"
                                                        disabled={this.state.btnDisabled}
                                                       >
                                                    ثبت ویرایش فراخوان
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
                }

            </div>
        );

    }

}

export default Edit;
