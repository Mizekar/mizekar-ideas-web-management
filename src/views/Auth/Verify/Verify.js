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

import {postSystem} from "../../../utils/apiRequest"
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {setUser} from "../../../actions/action.user";
import {get} from "../../../utils/apiMainRequest";


class Verify extends Component {

  constructor(props) {
    super(props);


    if (props.location.state !== undefined) {
      this.state = {
        resendToken: props.location.state.resendToken,
        verifyToken: props.location.state.verifyToken,
        phoneNumber: props.location.state.phoneNumber,
        clientId: 'idea-web',
        clientSecret: '00PcCMVwUGdb5weDo9FOOrYclGif7SJAFM3oXQGelhy4KQ5f8M3RMuTqeg',
        grantType: 'phone_number_token'
      }
    } else {
      this.state = {
        verifyToken: ''
      }
      this.props.history.push('/login');
    }

    this.checkVerifyCode = this.checkVerifyCode.bind(this)

  }

  componentDidMount() {
    // console.log('ok')
    //console.log(localStorage.getItem('apiToken'))
    //console.log(this.props.user.apiToken)
  }

  async checkVerifyCode(params) {

    let payload = {
      grant_type: this.state.grantType,
      client_id: this.state.clientId,
      client_secret: this.state.clientSecret,
      phone_number: this.state.phoneNumber,
      verification_token: params.verifyCode,


    }
    //console.log(payload)
    let response = await postSystem("connect/token", payload)

    if (response.access_token !== "") {

      let responseProfile = await get("accounts/profiles/me");

      if (responseProfile !== undefined) {
        this.props.setUser({
          apiToken: response.access_token,
          tokenType: response.token_type,
          refreshToken: response.refresh_token,
          expiresIn: response.expires_in,
          mobile: this.state.phoneNumber,
          firstName: responseProfile.firstName,
          lastName: responseProfile.lastName,
          profileImage: responseProfile.profileImage
        });

        this.props.history.push("/dashboard")
      }
      else
      {
        this.props.setUser({
          apiToken: response.access_token,
          tokenType: response.token_type,
          refreshToken: response.refresh_token,
          expiresIn: response.expires_in,
          mobile: this.state.phoneNumber,
          firstName:'',
          lastName: '',
          profileImage: ''
        });
        this.props.history.push("/dashboard")
      }
    }






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
                    <h1>احراز هویت کاربر</h1>
                    <p className="text-muted">لطفا کد تایید ارسال شده را وارد کنید.</p>

                    <Formik
                      initialValues={{
                        verifyCode: '',
                      }}
                      validationSchema={Yup.object().shape({
                        verifyCode: Yup.string()
                          .required('تکمیل کد تایید الزامی است.'),
                      })}
                      onSubmit={values => {
                        this.checkVerifyCode(values)
                      }}>
                      {({errors, touched}) => (
                        <Form>
                          <FormGroup row>
                            <Col md="12">
                              <Input
                                name="verifyCode"
                                type="text"
                                placeholder="کد تایید را وارد کنید"
                                style={{textAlign: 'center'}}
                                tag={Field}
                                invalid={errors.verifyCode && touched.verifyCode}
                              />
                              <FormFeedback>{errors.verifyCode}</FormFeedback>
                            </Col>

                          </FormGroup>
                          <Row>
                            <Col xs="12">
                              <Alert color="info">
                                کد تایید احراز هویت : {this.state.verifyToken}
                              </Alert>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="12">
                              <Button type="submit" color="warning">
                                تایید و ورود
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Verify));


