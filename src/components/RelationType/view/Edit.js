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
import {Link} from "react-router-dom";

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
        let response = await get("ideas/relationTypes/details/" + this.state.id, {});

        console.log(response);

        this.setState({
            name: response.name,
            description: response.description,
            displayOrder: response.displayOrder,
            isPublished: response.isPublished,
            hexColor: response.hexColor,
            loadData: true,

        })

    }

    async formSubmit(payload) {
        this.setState({
            message: '',
            btnDisabled: true
        })

        let response = await put("ideas/relationTypes/" + this.state.id, payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت ویرایش نوع رابطه با موفقیت انجام شد."
                                     title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false
            })

        }


    }

    render() {
        return (

            <div className="animated fadeIn position-relative">
                {this.state.message}

                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/">خانه</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/relationType">انواع رابطه ها</Link></BreadcrumbItem>
                            <BreadcrumbItem active>ویرایش کردن نوع رابطه</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">ویرایش کردن نوع رابطه</h1>
                            <Link to="/relationType" className="mlm-auto btn btn-primary">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست انواع رابطه ها
                            </Link>
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
                                        name: this.state.name,
                                        description: this.state.description,
                                        displayOrder: this.state.displayOrder,
                                        isPublished: this.state.isPublished,
                                        hexColor:this.state.hexColor
                                    }}
                                    validationSchema={Yup.object().shape({
                                        displayOrder: Yup.number()
                                            .required('تکمیل اولویت نمایش الزامی است')
                                            .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد.")
                                    })}
                                    onSubmit={(values) => {
                                        this.formSubmit(values);
                                    }}>
                                    {({values, errors, touched}) => (
                                        <Form>

                                            <FormGroup row>
                                                <label>عنوان نوع رابطه</label>
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

                                                <label>توضیح نوع رابطه</label>
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
                                                <label>رنگ نوع رابطه</label>
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
                                                        defaultChecked={this.state.isPublished}
                                                        value={true}
                                                        tag={Field}
                                                    />
                                                    منتشر شود
                                                </Label>
                                            </FormGroup>
                                            <Row className="mt-4">
                                                <Button color="warning" type="submit"
                                                        disabled={this.state.btnDisabled}
                                                        >
                                                    ثبت ویرایش نوع رابطه
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
