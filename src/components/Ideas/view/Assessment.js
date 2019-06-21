import React, {Component} from 'react';
import {get, post} from "../../../utils/apiMainRequest";
import {Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {Link} from "react-router-dom";

import {Field, Form, Formik} from "formik";
import Select from "react-select";
import Loading from "../../../utils/loading";
import ModalAlert from "../../../utils/modalAlert";


class Assessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      pageNumber: 1,
      pageSize: 1000,
      assessments: [],
      optionSets: [],
      loading: false,
      selectedAssessment:'',
      optionSetValue: [],

    }
  }

  componentDidMount() {
    this.getAssessments()
  }

  async getAssessments() {

    let response = await get("ideas/assessments", {
      pageNumber: this.state.pageNumber,
      pageSize: this.state.pageSize,

    });
    let assessments = response.items.map((data) => {
      return {value: data.id, label: data.title}
    })

    this.setState({
      assessments: assessments
    })
  }

  async loadAssessment(assessmentId) {
    //console.log(assessmentId)
    this.setState({
      loading:true
    })
    let response = await get("ideas/assessments/details/" + assessmentId, {});

    let options = [];

    let errorOptionSets = []
    let initialValueOptionSets = []


    for (let i = 0; i < response.optionSets.length; i++) {
      let data = response.optionSets[i];

      errorOptionSets[data.id] = false
      initialValueOptionSets[data.id] = []

      let responseItems = await get("ideas/assessments/" + data.id + "/items/details", {});
      let items = [{
        title: '',
        displayOrder: '',
        weight: '',
        isDisabled: false
      }]
      if (responseItems.length !== 0) {
        items = responseItems
      }


      options[i] = {
        id: data.id,
        title: data.title,
        description: data.description,
        displayOrder: data.displayOrder,
        isMultiSelect: data.isMultiSelect,
        isRequired: data.isRequired,
        items: items,
      }
    }
    //console.log(options)

    this.setState({
      optionSets: options,
      errorOptionSets: errorOptionSets,
      initialValueOptionSets: initialValueOptionSets,
      optionSetValue:initialValueOptionSets,
      loading: false,
      assessmentId:assessmentId
    })


  }
  setOptionItemIds(optionId, itemId, action, type) {
    //alert(optionId)
    let optionSetValue = this.state.optionSetValue
    let errorOptionSets = this.state.errorOptionSets;

    if (type == 'checkbox') {
      if (action) {
        optionSetValue[optionId].push(itemId)
      } else {
        optionSetValue[optionId] = optionSetValue[optionId].filter((item, index) => item !== itemId)
      }
    } else {
      optionSetValue[optionId][0] = (itemId)
    }
    if (optionSetValue[optionId].length == 0) {
      errorOptionSets[optionId] = true
    } else {
      errorOptionSets[optionId] = false
    }
    this.setState({
      optionSetValue: optionSetValue,
      errorOptionSets: errorOptionSets
    })
  }

  async formSubmit(payload, reset) {

    this.setState({
      message: '',
      btnDisabled: true
    })

    let optionSets = this.state.optionSets;
    let errorOptionSets = this.state.errorOptionSets;
    let errorRequired = false;
    let optionItemIds = [];
    let optionSetValue = this.state.optionSetValue

    for (let i = 0; i < optionSets.length; i++) {
      let data = optionSets[i];

      if (data.isRequired && optionSetValue[data.id].length == 0) {
        errorOptionSets[data.id] = true;
        errorRequired = true;
      } else {
        errorOptionSets[data.id] = false;

      }
      optionItemIds = optionItemIds.concat(optionSetValue[data.id])
    }

    if (errorRequired) {
      this.setState({
        errorOptionSets: errorOptionSets
      })
      this.setState({
        message: <ModalAlert type="danger" message="برخی از سوال های الزامی تکمیل نشده است!"
                             title="هشدار سیستم"
                             icon="fa fa-times-circle"/>,
        btnDisabled: false,

      })
      return false;
    }

    payload.assessmentOptionSetItems = optionItemIds
    payload.assessmentId=this.state.assessmentId
    payload.ideaId=this.state.id

    let response = await post("ideas/assessments/do/", payload);

    if (typeof response === 'string') {
      this.setState({
        message: <ModalAlert type="success" message="ثبت ارزیابی سوژه با موفقیت انجام شد." title="هشدار سیستم"
                             icon="fa fa-check-square-o"/>,
        btnDisabled: false
      })

      reset()
      this.props.history.pop()

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
              <BreadcrumbItem><Link to="/ideas">سوژه ها</Link></BreadcrumbItem>
              <BreadcrumbItem><Link to={"/ideas/detail/" + this.state.id}>جزئیات سوژه</Link></BreadcrumbItem>
              <BreadcrumbItem active>ثبت ارزیابی سوژه</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col xs="12">

            <div className="d-flex flex-row align-items-center">
              <h1 className="list-title">ثبت ارزیابی سوژه</h1>
              <Link to={"/ideas/detail/" + this.state.id} className="mlm-auto btn btn-primary">
                <i className="fa fa-list"></i>
                &nbsp;
                جزئیات سوژه
              </Link>
            </div>

          </Col>
        </Row>

        <Row className="mt-4">

          <Col xs={12} md={4}>
            <Select
              name="assessment"
              value={this.state.selectedAssessment}
              isMulti={false}
              onChange={(selectedOption) => {
                this.setState({selectedAssessment: selectedOption});
                this.loadAssessment(selectedOption.value)
              }}
              options={this.state.assessments}
              tag={Field}
              placeholder="لطفا یک ارزیابی را انتخاب کنید..."
            />
          </Col>


        </Row>
        {
          this.state.loading &&
          <div className="loading-box mt-5">
            <Loading color="#E8B51D"/>
            <span className="loading-box-text">
          لطفا منتظر بمانید...
          </span>

          </div>
        }
        {!this.state.loading && this.state.selectedAssessment!=='' &&
        <Row className="mt-4">
          <Col>
            <Formik
              initialValues={{
                description: ''
              }}
              onSubmit={(values, {resetForm}) => {
                this.formSubmit(values,resetForm);
              }}
            >
              {({errors, touched, setFieldValue, values}) => (
                <Form>
                  <Card>
                    <div className="p-3 text-center b-b-1">
                      سؤالات ارزیابی
                    </div>
                    {

                      this.state.optionSets.map((data) => {
                        return (
                          <div className="pl-4 pb-0 pt-4 b-b-1" key={data.id}>

                            <FormGroup>
                              <label>{data.title}</label>
                              {
                                data.items.map((item, index) => {
                                  return (

                                    <FormGroup check
                                               className="optionSetItems"
                                               key={item.id}>
                                      <Label check>
                                        {
                                          data.isMultiSelect &&
                                          <Input
                                            type="checkbox"
                                            name={"optionItemIds[" + data.id + "]"}
                                            tag={Field}
                                            defaultChecked={this.state.optionSetValue[data.id].includes(item.id) ? true : false}
                                            onChange={(event) => {
                                              this.setOptionItemIds(data.id, item.id, event.target.checked, 'checkbox')
                                            }}
                                            value={item.id}
                                          />
                                        }
                                        {
                                          !data.isMultiSelect &&
                                          <Input
                                            type="radio"
                                            name={"optionItemIds[" + data.id + "]"}
                                            tag={Field}
                                            value={item.id}
                                            defaultChecked={this.state.optionSetValue[data.id].includes(item.id) ? true : false}
                                            onChange={(event) => {
                                              this.setOptionItemIds(data.id, item.id, event.target.checked, 'radio')
                                            }}
                                          />
                                        }

                                        {item.title}
                                      </Label>
                                    </FormGroup>
                                  )
                                })
                              }
                            </FormGroup>
                            {
                              this.state.errorOptionSets[data.id] && data.isRequired &&
                              <div className="invalid-feedback row show mb-2">
                                <i className="fa fa-times"></i>&nbsp;
                                تکمیل این سوال الزامی است.
                              </div>
                            }

                          </div>
                        )
                      })
                    }

                  </Card>
                  <Card>
                    <div className="p-3 text-center">
                      توضیحات
                    </div>
                    <div className="p-3">
                      <Input
                        name="description"
                        type="textarea"
                        rows={8}
                        className="bg-eee"
                        component="textarea"
                        placeholder="توضیحات خود در مورد ارزیابی را اینجا بنویسید..."
                        tag={Field}

                      />
                    </div>

                  </Card>
                  <Row className="mb-2">
                    <Col className="d-flex">
                      <Button color="warning" type="submit" disabled={this.state.btnDisabled}>
                        ثبت ارزیابی سوژه
                      </Button>
                      {this.state.btnDisabled &&
                      <div className="loading-box">
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
        }
      </div>
    )
  }

}

export default Assessment;
