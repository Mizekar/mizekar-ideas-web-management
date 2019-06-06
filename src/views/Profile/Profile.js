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
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import Select from 'react-select';
import {get, post, put, upload} from "../../utils/apiMainRequest";
import ModalAlert from "../../utils/modalAlert";
import Loading from "../../utils/loading";


export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      btnDisabled: false,
      genders: [
        {value: 'Female', label: 'خانم'},
        {value: 'Male', label: 'آقا'},
        {value: 'Unknown', label: 'نامشخص'},
      ],
      id: '',
      loadingClass:'loading-hide'

    }

    this.handleClick = this.handleClick.bind(this);
    this.progressUpload= this.progressUpload.bind(this);


  }

  componentWillMount() {
    this.getMyProfile();

  }

  async getMyProfile() {
    let response = await get("accounts/profiles/me");

    //console.log(response);

    if (response !== undefined) {
      //alert('inja');

      this.setState({
        loadData: true,
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        userName: response.userName,
        tel: response.tel,
        mobile: response.mobile,
        email: response.email,
        bio: response.bio,
        gender: response.gender,
        selectedGender: response.gender ? this.state.genders.filter(item => item.value == response.gender) : '',
        posts: response.statistic.posts,
        likes: response.statistic.likes,
        comments: response.statistic.comments,
        profileImage:response.profileImage?response.profileImage:'../../assets/img/avatars/default.png'
      })
    } else {
      this.setState({
        loadData: true
      })
    }


  }

  async formSubmit(payload) {
    this.setState({
      message: '',
      btnDisabled: true
    })
    let response = null;
    if (this.state.id) {
      response = await put("accounts/profiles/" + this.state.id, payload);
    } else {
      response = await post("accounts/profiles", payload);
    }

    if (typeof response === 'string') {
      this.setState({
        message: <ModalAlert type="success" message="ثبت اطلاعات حساب کاربری با موفقیت انجام شد."
                             title="هشدار سیستم"
                             icon="fa fa-check-square-o"/>,
        btnDisabled: false,
        id: response,
        firstName:payload.firstName,
        lastName:payload.lastName,
        bio:payload.bio
      })

    }

  }
  handleClick(e) {
    this.refs.fileUploader.click();
  }

  async uploadProfilePicture(event)
  {
    this.setState(
      {
        loadingClass: 'loading'
      }
    );


    let file=event.currentTarget.files[0]

    let data = new FormData();
    data.append('formFile', file);

    let id = new Date().getTime();

    let response = await upload("accounts/profiles/me/photo", data, this.progressUpload, id)

    if (typeof response === 'string') {
      this.setState({
        profileImage:response,
        loadingClass: 'loading-hide'

      })
    }
    else
    {
      this.setState(
        {
          loadingClass: 'loading-hide'
        }
      )
    }
    //alert('ok');
  }

  progressUpload(percent, uploadId) {

  }


  render() {
    return (
      <div className="animated fadeIn">
        {this.state.message}
        <Row className="default-breadcrumb">
          <Col xs="12">
            <Breadcrumb>
              <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
              <BreadcrumbItem active>حساب کاربری</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        {!this.state.loadData &&
        <div className="mt-5">

          <div className="loading-box">
            <Loading color="#E8B51D"/>
            <span className="loading-box-text">
                            در حال دریافت اطلاعات. لطفا منتظر بمانید
                    </span>

          </div>
        </div>
        }
        {this.state.loadData &&
        <Row>
          <Col xs="12" sm="5" md="4" lg="3">
            <Card className="p-0">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div className="img-thumbnail ">
                      <div >
                        <img className="img-circle" src={this.state.profileImage} />
                        <span className="action-bar" onClick={()=>this.handleClick()}><i className="fa fa-camera"></i> </span>
                        <input
                          type="file"
                          id="file"
                          ref="fileUploader"
                          accept=".jpg, .png, .bmp, .jpeg"
                          style={{display: "none"}}
                          onChange={(event)=>this.uploadProfilePicture(event)}

                        />
                        <span className={this.state.loadingClass} >
                          <Loading color="#fff"/>
                        </span>
                      </div>
                    </div>

                    {/*<div className="p-4 position-relative">
                      <img src={'../../assets/img/avatars/default.png'} className="img-avatar"
                           alt=""/>
                      <div className="profile-img-btn">

                      </div>
                    </div>*/}

                  </Col>
                </Row>

                <Row>
                  <Col xs="12">
                    <h3 className="text-center">
                      {this.state.firstName + " " + this.state.lastName}
                    </h3>
                  </Col>
                </Row>
                <Row className="activity-profile">
                  <Col xs="4" className="text-center">

                    {/*<div>
                      <i className="fa fa-file-text"></i>
                    </div>*/}
                    <div className="num-activity">{this.state.posts}</div>
                    <div className="text-activity">پست</div>
                  </Col>
                  <Col xs="4" className="text-center">

                    {/* <div>
                      <i className="fa fa-thumbs-up"></i>
                    </div>*/}
                    <div className="num-activity">{this.state.likes}</div>
                    <div className="text-activity">پسند</div>
                  </Col>
                  <Col xs="4" className="text-center">
                    {/* <div>
                      <i className="fa fa-comments-o"></i>
                    </div>*/}
                    <div className="num-activity">{this.state.comments}</div>
                    <div className="text-activity">پیام</div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <p className="pt-4 text-muted text-justify line-height-25">
                      {this.state.bio}
                    </p>
                  </Col>
                </Row>

              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="7" md="8" lg="9">
            <Card className="p-4">
              <CardBody>
                <Formik
                  initialValues={{
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    userName: this.state.userName,
                    gender: this.state.gender,
                    bio: this.state.bio,
                    tel: this.state.tel,
                    mobile: this.state.tel,
                    email: this.state.email
                  }}
                  validationSchema={Yup.object().shape({
                    gender: Yup.string()
                      .required('انتخاب جنسیت الزامی است.')
                  })}
                  onSubmit={(values) => {
                    this.formSubmit(values);
                  }}>
                  {({errors, touched, setFieldValue}) => (
                    <Form>

                      <FormGroup row>
                        <Col xs="12" md="6">
                          <label>نام</label>
                          <Input
                            name="firstName"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.firstName && touched.firstName}
                          />

                          <FormFeedback>{errors.firstName}</FormFeedback>
                        </Col>
                        <Col xs="12" md="6">
                          <label>نام خانوادگی</label>
                          <Input
                            name="lastName"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.lastName && touched.lastName}
                          />

                          <FormFeedback>{errors.lastName}</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col xs="12" md="6">
                          <label>نام کاربری</label>
                          <Input
                            name="userName"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.userName && touched.userName}
                          />

                          <FormFeedback>{errors.userName}</FormFeedback>
                        </Col>
                        <Col xs="12" md="6">
                          <label>جنسیت</label>
                          <Select
                            name="gender"
                            value={this.state.selectedGender}
                            isMulti={false}
                            onChange={(selectedOption) => {
                              this.setState({selectedGender: selectedOption});
                              setFieldValue("gender", selectedOption.value);
                            }}
                            options={this.state.genders}
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
                      <FormGroup row>
                        <Col xs="12" md="6">
                          <label>تلفن ثابت</label>
                          <Input
                            name="tel"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.tel && touched.tel}
                          />

                          <FormFeedback>{errors.tel}</FormFeedback>
                        </Col>
                        <Col xs="12" md="6">
                          <label>تلفن همراه</label>
                          <Input
                            name="mobile"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.mobile && touched.mobile}
                          />

                          <FormFeedback>{errors.mobile}</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col xs="12">
                          <label>رایانامه (ایمیل)</label>
                          <Input
                            name="email"
                            type="text"
                            placeholder=""
                            tag={Field}
                            invalid={errors.email && touched.email}
                          />

                          <FormFeedback>{errors.email}</FormFeedback>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col xs="12">
                          <label>درباره من</label>
                          <Input
                            name="bio"
                            type="textarea"
                            component="textarea"
                            placeholder="متن کوتاهی درباره خود بنویسید..."
                            tag={Field}
                            invalid={errors.bio && touched.bio}
                          />

                          <FormFeedback>{errors.bio}</FormFeedback>
                        </Col>
                      </FormGroup>
                      <Row className="mt-4">
                        <Button color="warning" type="submit" disabled={this.state.btnDisabled} >
                          ثبت
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
    )

  }

}
