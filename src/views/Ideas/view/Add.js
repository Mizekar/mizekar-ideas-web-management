import React, {Component} from 'react';
import {
  Breadcrumb,
  BreadcrumbItem, Button, Card,
  CardBody, CardText, CardTitle,
  Col, FormFeedback,
  FormGroup, Input,
  Label, Nav, NavItem, NavLink,
  Row, TabContent, TabPane
} from "reactstrap";

import classnames from 'classnames';

import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {get, post} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";
import Select from 'react-select';

const options = [
  {value: 'chocolate', label: 'Chocolate'},
  {value: 'strawberry', label: 'Strawberry'},
  {value: 'vanilla', label: 'Vanilla'}
];

class Add extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      message: '',
      btnDisabled: false,
      activeTab: '1',
      selectedCategory: null,
      categories: [],
      selectedAnnouncement: null,
      announcement: [],
      selectedIdeaStatuses: null,
      ideaStatuses: [],
      selectedCountry: null,
      countries: [],
      selectedState: null,
      states: [],
      selectedCity: null,
      cities: [],
      selectedVillage: null,
      villages: [],
      optionSets: [],
      optionSetsItem: [],
      errorOptionSets:[]
    };

  }

  componentWillMount() {
    this.getCategories();
    this.getIdeaStatuses();
    this.getAnnouncement();
    this.getIdeaOptionSets();

  }

  async getCategories() {
    let response = await get("ideas/Categories", {
      pageNumber: 1,
      pageSize: 1000
    });

    let categories = response.items.map((data) => {
      return {value: data.id, label: data.name}
    })

    this.setState({
      categories: categories
    })
  }

  async getIdeaStatuses() {
    let response = await get("ideas/status", {
      pageNumber: 1,
      pageSize: 1000
    });

    let ideaStatuses = response.items.map((data) => {
      return {value: data.id, label: data.name}
    })

    this.setState({
      ideaStatuses: ideaStatuses
    })
  }

  async getAnnouncement() {
    let response = await get("ideas/Announcements", {
      pageNumber: 1,
      pageSize: 1000
    });

    let announcement = response.items.map((data) => {
      return {value: data.id, label: data.title}
    })

    this.setState({
      announcement: announcement
    })
  }

  async getIdeaOptionSets() {
    let response = await get("ideas/optionsets", {
      pageNumber: 1,
      pageSize: 1000
    });


    let responseItems = await get("ideas/optionsets/items", {
      pageNumber: 1,
      pageSize: 1000
    });

    let items = [];

    let ri = responseItems.items;
    //console.log(ri.length)
    for (let i = 0; i < ri.length; i++) {
      let data = ri[i];
      //console.log(data.ideaOptionSetId);
      if (items[data.ideaOptionSetId] === undefined) {
        items[data.ideaOptionSetId] = [];
      }
      items[data.ideaOptionSetId].push({id: data.id, title: data.title, disabled: data.isDisabled})
    }


    this.setState({
      optionSets: response.items,
      optionSetsItem: items
    })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
        message: <ModalAlert type="success" message="ثبت سوژه با موفقیت انجام شد." title="هشدار سیستم"
                             icon="fa fa-check-square-o"/>,
        btnDisabled: false
      })
      reset()

    }


  }

  render() {
    let items=this.state.optionSetsItem;
    return (

      <div className="animated fadeIn">
        {this.state.message}

        <Row className="default-breadcrumb">
          <Col xs="12">
            <Breadcrumb>
              <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
              <BreadcrumbItem tag="a" href="#/ideas">سوژه ها</BreadcrumbItem>
              <BreadcrumbItem active>اضافه کردن سوژه جدید</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col xs="12">
            <div className="d-flex flex-row align-items-center">
              <h1 className="list-title">اضافه کردن سوژه جدید</h1>
              <a href="#/ideas">
                <i className="fa fa-list"></i>
                &nbsp;
                لیست سوژه ها
              </a>
            </div>

          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs="12">

            <Formik
              initialValues={{
                subject: '',
                summary: '',
                details: '',
                categories: null,
                statusId: '',
                announcementId: '',
                countryId: '',
                stateId: '',
                cityId: '',
                villageId: '',
                isPublished: true,
                optionItemIds: null
              }}
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, {resetForm}) => {

                console.log(values);

                //this.formSubmit(values, resetForm);
              }}>
              {({errors, touched, setFieldValue,values}) => (
                <Form>
                  <div className="mt-2">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames({active: this.state.activeTab === '1'})}
                          onClick={() => {
                            this.toggle('1');
                          }}
                        >
                          معرفی
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({active: this.state.activeTab === '2'})}
                          onClick={() => {
                            this.toggle('2');
                          }}
                        >
                          ویژگی ها
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                      <TabPane tabId="1">
                        <Card className="p-4">
                          <CardBody>
                            <FormGroup row>
                              <label>عنوان سوژه</label>
                              <Input
                                name="subject"
                                type="text"
                                placeholder=""
                                tag={Field}
                                invalid={errors.title && touched.title}
                              />

                              <FormFeedback>{errors.title}</FormFeedback>
                            </FormGroup>
                            <FormGroup row>

                              <label>خلاصه سوژه</label>
                              <Input
                                name="summary"
                                type="textarea"
                                component="textarea"
                                placeholder=""
                                tag={Field}
                                invalid={errors.description && touched.description}
                              />

                              <FormFeedback>{errors.description}</FormFeedback>


                            </FormGroup>
                            <FormGroup row>

                              <label>جزئیات سوژه</label>
                              <Input
                                name="details"
                                type="textarea"
                                component="textarea"
                                placeholder=""
                                tag={Field}
                                invalid={errors.description && touched.description}
                              />

                              <FormFeedback>{errors.description}</FormFeedback>


                            </FormGroup>
                            <FormGroup row>

                              <label>دسته بندی</label>
                              <Select
                                name="categories"
                                value={this.state.selectedCategory}
                                isMulti={true}
                                onChange={(selectedOption) => {
                                  this.setState({selectedCategory: selectedOption});
                                  setFieldValue("categories", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.categories}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>وضعیت سوژه</label>
                              <Select
                                name="statusId"
                                value={this.state.selectedIdeaStatuses}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedIdeaStatuses: selectedOption});
                                  setFieldValue("statusId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.ideaStatuses}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>فراخوان مرتبط</label>
                              <Select
                                name="announcementId"
                                value={this.state.selectedAnnouncement}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedAnnouncement: selectedOption});
                                  setFieldValue("announcementId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.announcement}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>کشور</label>
                              <Select
                                name="countryId"
                                value={this.state.selectedCountry}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedCountry: selectedOption});
                                  setFieldValue("countryId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.countries}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>استان</label>
                              <Select
                                name="stateId"
                                value={this.state.selectedState}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedState: selectedOption});
                                  setFieldValue("stateId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.states}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>شهر</label>
                              <Select
                                name="cityId"
                                value={this.state.selectedCity}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedCity: selectedOption});
                                  setFieldValue("cityId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.cities}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>
                            <FormGroup row>

                              <label>روستا-محله</label>
                              <Select
                                name="villageId"
                                value={this.state.selectedVillage}
                                isMulti={false}
                                onChange={(selectedOption) => {
                                  this.setState({selectedVillage: selectedOption});
                                  setFieldValue("villageId", selectedOption.map((data) => {
                                    return data.value
                                  }))
                                }}
                                options={this.state.villages}
                                tag={Field}
                                placeholder="انتخاب کنید..."
                              />


                            </FormGroup>

                            <FormGroup check className="mr-2">
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="isPublished"
                                  defaultChecked={true}
                                  tag={Field}
                                />
                                منتشر شود
                              </Label>
                            </FormGroup>

                          </CardBody>
                        </Card>
                      </TabPane>
                      <TabPane tabId="2">
                        {

                          this.state.optionSets.map((data) => {
                            return (
                              <Card className="pr-5 pb-0 pt-4 pl-4" key={data.id}>
                                <CardBody className="p-0">
                                  <FormGroup row>
                                    <label>{data.title}</label>
                                    {
                                      items[data.id].map((item,index)=>{
                                        return (

                                          <FormGroup check className="optionSetItems" key={item.id}>
                                            <Label check>
                                              {
                                                data.isMultiSelect &&
                                                <Input
                                                  type="checkbox"
                                                  name={"optionItemIds["+data.id+"]"}
                                                  tag={Field}
                                                  onChange={(event) => {
                                                    const value = event.target.checked ? item.id : null
                                                    setFieldValue("optionItemIds["+data.id+"]["+index+"]", value)
                                                  }}
                                                  value={item.id}
                                                />
                                              }
                                              {
                                                !data.isMultiSelect &&
                                                <Input
                                                  type="radio"
                                                  name={"optionItemIds["+data.id+"]"}
                                                  tag={Field}
                                                  value={item.id}
                                                />
                                              }

                                              {item.title}
                                            </Label>
                                          </FormGroup>
                                        )
                                      })
                                    }
                                  </FormGroup>
                                  {this.state.errorOptionSets[data.id] && <div className="invalid-feedback row show">تکمیل این ویژگی الزامی است.</div>}
                                </CardBody>
                              </Card>
                            )
                          })
                        }

                      </TabPane>
                    </TabContent>
                  </div>


                  <Row className="mb-2 pr-3">
                    <Button color="warning" type="submit" disabled={this.state.btnDisabled}
                            className="px-4">
                      ثبت سوژه
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
          </Col>
        </Row>

      </div>
    );
  }

}

export default Add;
