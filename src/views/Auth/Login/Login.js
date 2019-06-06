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
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from 'reactstrap';

import {post} from "../../../utils/apiRequest"
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {setUser} from "../../../actions/action.user";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

class Login extends Component {

    constructor(props) {
        super(props);

        if(this.props.user.apiToken!=='')
        {
            this.props.history.push('/dashboard')
        }


    }

    async checkLogin(params) {

        let mobile = "98" + params.mobile
        let response = await post("auth/phone", {phone: mobile})

        //console.log(response);

        this.props.history.push({
            pathname: '/verify',
            state: {
                resendToken: response.resend_token,
                verifyToken: response.verify_token,
                phoneNumber: mobile
            }
        })


    }

    render() {
        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="5">
                            <CardGroup>
                                <Card className="p-4">
                                    <CardBody>
                                        <h1>ورود به پنل کاربران</h1>
                                        <p className="text-muted">لطفا شماره تلفن همراه خود را وارد کنید.</p>
                                        <Formik
                                            initialValues={{
                                                mobile: '',
                                            }}
                                            validationSchema={Yup.object().shape({
                                                mobile: Yup.number()
                                                    .required('تکمیل شماره تلفن همراه الزامی است.')
                                                    .test('len', 'تعداد ارقام دقیقا باید10 باشد.', val => val.toString().length === 10)
                                                    .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد.")
                                            })}
                                            onSubmit={values => {
                                                this.checkLogin(values)
                                            }}>
                                            {({errors, touched}) => (
                                                <Form>
                                                    <FormGroup row>
                                                        <Col xs="12">
                                                            <InputGroup className="mb-3">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="fa fa-mobile"></i>
                                                                    </InputGroupText>
                                                                </InputGroupAddon>

                                                                <Input
                                                                    name="mobile"
                                                                    type="text"
                                                                    placeholder="9123456789"
                                                                    style={{textAlign: 'left'}}
                                                                    tag={Field}
                                                                    invalid={errors.mobile && touched.mobile}
                                                                />

                                                                <InputGroupAddon addonType="append">
                                                                    <InputGroupText style={{direction: 'ltr'}}
                                                                                    className="appendFormLogin">
                                                                        +98
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <FormFeedback>{errors.mobile}</FormFeedback>


                                                            </InputGroup>

                                                        </Col>
                                                    </FormGroup>
                                                    <Row>
                                                        <Col xs="12">
                                                            <Button color="warning">
                                                                دریافت کد تایید
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

