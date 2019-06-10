import React, {Component} from 'react';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container, FormFeedback, FormGroup,
    Input,
    Row
} from 'reactstrap';

import {createProfile} from "../../../api/profile"
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {setUser} from "../../../actions/action.user";
import Select from 'react-select';


class Register extends Component {

    constructor(props) {
        super(props);


        if (props.location.state !== undefined) {
            this.state = {
                apiToken: props.location.state.apiToken,
                tokenType: props.location.state.tokenType,
                refreshToken: props.location.state.refreshToken,
                expiresIn: props.location.state.expiresIn,
                mobile: props.location.state.mobile,
            }
        } else {
            this.props.history.push('/login');
        }

        this.saveProfileInfo = this.saveProfileInfo.bind(this)

    }

    componentDidMount() {
    }

    async saveProfileInfo(payload) {

        payload.mobile=this.state.mobile;
        //console.log(this.state)
        let response = await createProfile(payload,this.state.apiToken);
        if (response.status === 200) {

            let data = response.data;

            this.props.setUser({
                apiToken: this.state.apiToken,
                tokenType: this.state.tokenType,
                refreshToken: this.state.refresh_token,
                expiresIn: this.state.expiresIn,
                mobile: this.state.mobile,
                firstName: payload.firstName,
                lastName: payload.lastName,
                profileImage: '',
            });
            this.props.history.push("/dashboard")

        }
    }

    render() {
        const genders= [
            {value: 'Female', label: 'خانم'},
            {value: 'Male', label: 'آقا'},
            {value: 'Unknown', label: 'نامشخص'},
        ];
        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="5">
                            <CardGroup>
                                <Card className="p-4">
                                    <CardBody>
                                        <h1>تکمیل اطلاعات کاربری</h1>
                                        <p className="text-muted">لطفا اطلاعات کاربری خود را تکمیل کنید.</p>

                                        <Formik
                                            initialValues={{
                                                firstName: '',
                                                lastName: '',
                                                gender: ''
                                            }}
                                            validationSchema={Yup.object().shape({
                                                firstName: Yup.string()
                                                    .required('تکمیل نام الزامی است.'),
                                                lastName: Yup.string()
                                                    .required('تکمیل نام خانوادگی الزامی است.'),
                                                gender: Yup.string()
                                                    .required('انتخاب  جنسیت الزامی است.'),
                                            })}
                                            onSubmit={values => {
                                                this.saveProfileInfo(values)
                                            }}>
                                            {({errors, touched,setFieldValue}) => (
                                                <Form>
                                                    <FormGroup row>
                                                        <Col md="12">
                                                            <label>نام</label>
                                                            <Input
                                                                name="firstName"
                                                                type="text"
                                                                tag={Field}
                                                                invalid={errors.firstName && touched.firstName}
                                                            />
                                                            <FormFeedback>{errors.firstName}</FormFeedback>
                                                        </Col>

                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col md="12">
                                                            <label>نام خانوادگی</label>
                                                            <Input
                                                                name="lastName"
                                                                type="text"
                                                                tag={Field}
                                                                invalid={errors.lastName && touched.lastName}
                                                            />
                                                            <FormFeedback>{errors.lastName}</FormFeedback>
                                                        </Col>

                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col xs="12" md="12">
                                                            <label>جنسیت</label>
                                                            <Select
                                                                name="gender"
                                                                value={this.state.selectedGender}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedGender: selectedOption});
                                                                    setFieldValue("gender", selectedOption.value);
                                                                }}
                                                                options={genders}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                                error={errors.gender}
                                                                touched={touched.gender}
                                                            />
                                                            <div className="invalid-feedback show ">
                                                                {errors.gender}
                                                            </div>
                                                        </Col>

                                                    </FormGroup>
                                                    <Row>
                                                        <Col xs="12">
                                                            <Button type="submit" color="warning">
                                                                ثبت نام
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            )}
                                        </Formik>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>

        );
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setUser: (info) => {
            dispatch(setUser(info));
        }
    };
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));


