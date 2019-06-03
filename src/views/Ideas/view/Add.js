import React, {Component} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem, Button, Card,
    CardBody,
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
            selectedProvince: null,
            provinces: [],
            selectedCity: null,
            cities: [],
            selectedVillage: null,
            villages: [],
            optionSets: [],
            optionSetsItem: [],
            errorOptionSets: [],
            optionSetValue: [],
            initialValueOptionSets: []
        };

    }

    componentWillMount() {
        this.getCategories();
        this.getIdeaStatuses();
        this.getAnnouncement();
        this.getIdeaOptionSets();
        this.getCountries();

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

        let errorOptionSets = []
        let initialValueOptionSets = []

        for (let i = 0; i < response.items.length; i++) {
            let data = response.items[i];
            errorOptionSets[data.id] = false
            initialValueOptionSets[data.id] = []
        }

        let responseItems = await get("ideas/optionsets/items", {
            pageNumber: 1,
            pageSize: 1000
        });

        let items = [];

        let ri = responseItems.items;
        for (let i = 0; i < ri.length; i++) {
            let data = ri[i];
            if (items[data.ideaOptionSetId] === undefined) {
                items[data.ideaOptionSetId] = [];
            }
            items[data.ideaOptionSetId].push({id: data.id, title: data.title, disabled: data.isDisabled})
        }

        //console.log(initialValueOptionSets);
        this.setState({
            optionSets: response.items,
            optionSetsItem: items,
            errorOptionSets: errorOptionSets,
            optionSetValue: initialValueOptionSets,
            initialValueOptionSets: initialValueOptionSets
        })
    }

    async getCountries() {
        let response = await get("locations/Countries", {
            pageNumber: 1,
            pageSize: 1000
        });

        let countries = response.items.map((data) => {
            return {value: data.id, label: data.title}
        })

        //console.log(response);

        this.setState({
            countries: countries
        })
    }

    async getStatesByCountry(countryId) {
        let response = await get("locations/States/country/" + countryId, {
            pageNumber: 1,
            pageSize: 1000
        });

        let states = response.items.map((data) => {
            return {value: data.id, label: data.title}
        })
        this.setState({
            selectedState: null,
            states: states,
            selectedProvince: null,
            provinces: [],
            selectedCity: null,
            cities: [],
            selectedVillage: null,
            villages: [],
        })
    }
    async getProvincesByState(stateId) {
        let response = await get("locations/Provinces/state/" + stateId, {
            pageNumber: 1,
            pageSize: 1000
        });

        let provinces = response.items.map((data) => {
            return {value: data.id, label: data.title}
        })
        this.setState({
            selectedProvince: null,
            provinces: provinces,
            selectedCity: null,
            cities: [],
            selectedVillage: null,
            villages: [],
        })
    }
    async getCitiesByProvince(provinceId) {
        let response = await get("locations/Cities/province/" + provinceId, {
            pageNumber: 1,
            pageSize: 1000
        });

        let cities = response.items.map((data) => {
            return {value: data.id, label: data.title}
        })
        this.setState({
            selectedCity: null,
            cities: cities,
            selectedVillage: null,
            villages: [],
        })
    }
    async getVillagesByCity(cityId) {
        let response = await get("locations/Villages/city/" + cityId, {
            pageNumber: 1,
            pageSize: 1000
        });

        let villages = response.items.map((data) => {
            return {value: data.id, label: data.title}
        })
        this.setState({
            selectedVillage: null,
            villages: villages,
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

        //console.log(payload)
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
            //console.log(checkedItem);
        }
        if (errorRequired) {
            this.setState({
                errorOptionSets: errorOptionSets
            })
            this.setState({
                message: <ModalAlert type="danger" message="برخی از ویژگی های الزامی تکمیل نشده است!"
                                     title="هشدار سیستم"
                                     icon="fa fa-times-circle"/>,
                btnDisabled: false,
                activeTab: '2',
            })
            return false;
        }
        payload.optionItemIds = optionItemIds


        let response = await post("ideas", payload);

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت سوژه با موفقیت انجام شد." title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false,
                optionSetValue: this.state.initialValueOptionSets
            })
            reset()

        }
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

    render() {
        let items = this.state.optionSetsItem;
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
                                categories: [],
                                statusId: '',
                                announcementId: '',
                                countryId: '',
                                stateId: '',
                                provinceId: '',
                                cityId: '',
                                villageId: '',
                                isPublished: true,
                            }}
                            validationSchema={Yup.object().shape({
                                statusId: Yup.string()
                                    .required('تکمیل وضعیت سوژه الزامی است')
                            })}
                            onSubmit={(values, {resetForm}) => {

                                //console.log(values);
                                this.formSubmit(values, resetForm);
                            }}>
                            {({errors, touched, setFieldValue, values}) => (
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
                                                        <FormGroup>
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
                                                        <FormGroup>

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
                                                        <FormGroup>

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
                                                        <FormGroup>

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
                                                        <FormGroup>

                                                            <label>وضعیت سوژه</label>
                                                            <Select
                                                                name="statusId"
                                                                value={this.state.selectedIdeaStatuses}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedIdeaStatuses: selectedOption});
                                                                    setFieldValue("statusId", selectedOption.value)
                                                                }}
                                                                options={this.state.ideaStatuses}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                                error={errors.statusId}
                                                                touched={touched.statusId}
                                                            />
                                                            <div className="invalid-feedback show ">
                                                                {errors.statusId}
                                                            </div>


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>فراخوان مرتبط</label>
                                                            <Select
                                                                name="announcementId"
                                                                value={this.state.selectedAnnouncement}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedAnnouncement: selectedOption});
                                                                    setFieldValue("announcementId", selectedOption.value)
                                                                }}
                                                                options={this.state.announcement}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>کشور</label>
                                                            <Select
                                                                name="countryId"
                                                                value={this.state.selectedCountry}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedCountry: selectedOption});
                                                                    setFieldValue("countryId", selectedOption.value);
                                                                    this.getStatesByCountry(selectedOption.value)
                                                                }}
                                                                options={this.state.countries}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>استان</label>
                                                            <Select
                                                                name="stateId"
                                                                value={this.state.selectedState}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedState: selectedOption});
                                                                    setFieldValue("stateId", selectedOption.value);
                                                                    this.getProvincesByState(selectedOption.value)
                                                                }}
                                                                options={this.state.states}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>شهرستان</label>
                                                            <Select
                                                                name="provinceId"
                                                                value={this.state.selectedProvince}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedProvince: selectedOption});
                                                                    setFieldValue("provinceId", selectedOption.value);
                                                                    this.getCitiesByProvince(selectedOption.value)
                                                                }}
                                                                options={this.state.provinces}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>شهر</label>
                                                            <Select
                                                                name="cityId"
                                                                value={this.state.selectedCity}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedCity: selectedOption});
                                                                    setFieldValue("cityId", selectedOption.value);
                                                                    this.getVillagesByCity(selectedOption.value)
                                                                }}
                                                                options={this.state.cities}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>
                                                        <FormGroup>

                                                            <label>روستا</label>
                                                            <Select
                                                                name="villageId"
                                                                value={this.state.selectedVillage}
                                                                isMulti={false}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({selectedVillage: selectedOption});
                                                                    setFieldValue("villageId", selectedOption.value)
                                                                }}
                                                                options={this.state.villages}
                                                                tag={Field}
                                                                placeholder="انتخاب کنید..."
                                                            />


                                                        </FormGroup>

                                                        <FormGroup check className="mr-4">
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
                                                                    <FormGroup>
                                                                        <label>{data.title}</label>
                                                                        {
                                                                            items[data.id].map((item, index) => {
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
                                                                            تکمیل این ویژگی الزامی است.
                                                                        </div>
                                                                    }
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
