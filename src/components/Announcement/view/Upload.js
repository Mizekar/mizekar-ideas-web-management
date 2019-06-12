import React, {Component} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem, Button, Card,
    CardBody,
    Col, FormFeedback,
    FormGroup, Input,
    Row
} from "reactstrap";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {get, upload} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";
import {Link} from "react-router-dom";


class Upload extends Component {
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
        let response = await get("ideas/Announcements/details/" + this.state.id, {});

        console.log(response)

        this.setState({
            image: response.mediaUrl,
            loadData: true
        })

    }

    async formSubmit(payload) {

        this.setState({
            message: '',
            btnDisabled: true
        })

        let data = new FormData();
        data.append('formFile', payload.file);

        let response = await upload("ideas/Announcements/"+this.state.id+"/upload/", data,"","");

        console.log(response)

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="آپلود تصویر فراخوان با موفقیت انجام شد."
                                     title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false,
                image: response,
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
                            <BreadcrumbItem><Link to="/">خانه</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/announcement">فراخوان ها</Link></BreadcrumbItem>
                            <BreadcrumbItem active>آپلود تصویر فراخوان</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">آپلود تصویر فراخوان</h1>
                            <Link to="/announcement" className="mlm-auto btn btn-primary">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست فراخوان ها
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

                                    }}
                                    validationSchema={Yup.object().shape({})}
                                    onSubmit={(values) => {
                                        //console.log(values);
                                        this.formSubmit(values);
                                    }}>
                                    {({values, errors, touched,setFieldValue}) => (
                                        <Form>

                                            <FormGroup row>
                                                <Col xs="12" md="10" className="pr-0">
                                                    <label>تصویر فراخوان</label>
                                                    <Input
                                                        name="formFile"
                                                        type="file"
                                                        tag={Field}
                                                        accept="image/png,image/jpeg,image/gif,image/jpg"
                                                        onChange={(event) => {setFieldValue("file",event.currentTarget.files[0])}}
                                                        invalid={errors.formFile && touched.formFile}
                                                        //setFieldValue("formFile", event.currentTarget.files[0])
                                                    />

                                                    <FormFeedback>{errors.name}</FormFeedback>
                                                </Col>
                                                <Col xs="12" md="2" className="pl-0 upload-img-box" >
                                                    <div>
                                                        <img src={this.state.image} className="upload-img" alt="" />
                                                    </div>
                                                </Col>

                                            </FormGroup>
                                            <Row className="mt-4">
                                                <Button color="warning" type="submit"
                                                        disabled={this.state.btnDisabled}
                                                        >
                                                    آپلود فایل
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

export default Upload;
