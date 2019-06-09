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

import {Field, FieldArray, Form, Formik, getIn} from "formik";
import * as Yup from "yup";
import {get, post, put, remove, upload} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";
import Select from 'react-select';
import {confirmAlert} from "react-confirm-alert";
import MyGallery from "../../../utils/MyGallery";
import MyUpload from "../../../utils/MyUpload";


const ErrorMessage = ({name}) => (
    <Field
        name={name}
        className="invalid-feedback"
        render={({form}) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            return touch && error ? <div className="invalid-item">{error}</div> : null;
        }}
    />
);

class Edit extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            id: props.id,
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
            initialValueOptionSets: [],
            relationTypes: [],
            relations: [],
            selectedRelationTypeId: [],
            upload: [],
            mediaDescription:''
        };

    }

    async componentWillMount() {
        this.getCategories();
        this.getIdeaStatuses();
        this.getAnnouncement();
        this.getCountries();
        this.getRelationTypes();
        this.getIdeaRelations();
        await this.getIdeaOptionSets();
        await this.getById();
    }

    async getById() {
        let response = await get("ideas/details/" + this.state.id, {});

        //console.log(response)

        let selectedCategories = response.categories.map((data) => {
            return {value: data.id, label: data.name}
        })

        let optionSetValue = this.state.optionSetValue;
        //console.log(optionSetValue)
        for (let i = 0; i < response.selectedOptions.length; i++) {
            let data = response.selectedOptions[i];
            optionSetValue[data.ideaOptionSetId].push(data.id);
        }

        //console.log(optionSetValue);

        if (response.countryId) {
            await this.getStatesByCountry(response.countryId)
        }
        if (response.stateId) {
            await this.getProvincesByState(response.stateId)
        }
        if (response.provinceId) {
            await this.getCitiesByProvince(response.provinceId)
        }
        if (response.cityId) {
            await this.getVillagesByCity(response.cityId)
        }

        //console.log(response);

        this.setState({
            loadData: true,
            subject: response.subject,
            summary: response.summary,
            details: response.details,
            selectedCategory: selectedCategories,
            categoriesValue: response.categories.map((data) => {
                return data.id
            }),
            media: response.media,
            selectedIdeaStatuses: response.statusId ? this.state.ideaStatuses.filter(item => item.value === response.statusId) : '',
            statusId: response.statusId,
            announcementId: response.announcementId,
            selectedAnnouncement: response.announcementId ? this.state.announcement.filter(item => item.value === response.announcementId) : '',
            countryId: response.countryId,
            selectedCountry: response.countryId ? this.state.countries.filter(item => item.value === response.countryId) : '',
            stateId: response.stateId,
            selectedState: response.stateId ? this.state.states.filter(item => item.value === response.stateId) : '',
            provinceId: response.provinceId,
            selectedProvince: response.provinceId ? this.state.provinces.filter(item => item.value === response.provinceId) : '',
            cityId: response.cityId,
            selectedCity: response.cityId ? this.state.cities.filter(item => item.value === response.cityId) : '',
            villageId: response.villageId,
            selectedVillage: response.villageId ? this.state.villages.filter(item => item.value === response.villageId) : '',
            isPublished: response.isPublished,
            optionSetValue: optionSetValue,
            initialValueOptionSets: optionSetValue

        })

        this.progressUpload = this.progressUpload.bind(this)
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

    async getRelationTypes() {
        let response = await get("ideas/relationTypes", {
            pageNumber: 1,
            pageSize: 1000
        });

        let relationTypes = response.items.map((data) => {
            return {value: data.id, label: data.name}
        })

        this.setState({
            relationTypes: relationTypes
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

    async getIdeaRelations() {
        let response = await get("ideas/relations/idea/" + this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response)

        let selectedRelation = response.items.map((data) => {
            return {label: data.relationType, value: data.relationTypeId}
        })
        let relations = response.items.map((data) => {
            return {
                id: data.id,
                relationTypeId: data.relationTypeId,
                displayOrder: data.displayOrder,
                fullName: data.fullName,
                telephone: data.telephone,
                mobile: data.mobile,
                email: data.email,
                description: data.description,
            }
        })

        this.setState({
            relations: relations,
            selectedRelationTypeId: selectedRelation
        })
    }

    async uploadMedia() {

        let file = this.state.mediaFile;
        let description = this.state.mediaDescription;

        //console.log(file)



        let uploadArray = this.state.upload;
        let id = new Date().getTime();
        uploadArray.push({
            id: id,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            percent: 0,
            file: URL.createObjectURL(file)
        });

        this.setState(
            {
                upload: uploadArray
            }
        )

        //console.log(upload);
        let data = new FormData();
        data.append('mediaFile', file);
        data.append('description',description)

      /* let data={
           mediaFile:file,
           description:description
       }*/


        //console.log(data.get('description'));
        let response = await upload("ideas/" + this.state.id + "/Media/Upload", data, this.progressUpload, id)

        if (typeof response === 'string') {
            let response = await get("ideas/details/" + this.state.id, {});

            this.setState(
                {
                    upload: uploadArray.filter(item => item.id != id),
                    media: response.media,
                    mediaFile: '',
                    mediaDescription: ''
                }
            )
        } else {
            this.setState(
                {
                    upload: uploadArray.filter(item => item.id != id),
                }
            )
        }
    }

    progressUpload(percent, uploadId) {
        let upload = this.state.upload;

        let index = upload.findIndex(function (c) {
            return c.id == uploadId;
        });
        upload[index].percent = percent;

        this.setState(
            {
                upload: upload
            }
        )

    }

    confirmDeleteMedia(id) {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-box'>
                        <h4>تایید حذف!</h4>
                        <p>آیا نسبت به حذف این فایل مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDeleteMedia(id)
                            onClose()
                        }}>بله فایل را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDeleteMedia(id) {
        let response = '';
        if (id) {
            response = await remove("ideas/media/" + id);
        }


        if (typeof response === 'string' || !id) {
            let media = this.state.media;

            this.setState(
                {
                    media: media.filter(item => item.id != id)
                }
            )


        }
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
                message: <ModalAlert type="danger" message="برخی از ویژگی های الزامی تکمیل نشده است!"
                                     title="هشدار سیستم"
                                     icon="fa fa-times-circle"/>,
                btnDisabled: false,
                activeTab: '2',
            })
            return false;
        }
        payload.optionItemIds = optionItemIds
        let relations = payload.relations;
        delete payload.relations;


        let response = await put("ideas/" + this.state.id, payload);
        payload.relations = relations

        //console.log(relations)

        await Promise.all(relations.map(async (data) => {
            //console.log(data);
            if (data.id) {
                await put("ideas/relations/" + data.id, {
                    ideaId: this.state.id,
                    relationTypeId: data.relationTypeId,
                    displayOrder: data.displayOrder,
                    fullName: data.fullName,
                    telephone: data.telephone,
                    mobile: data.mobile,
                    email: data.email,
                    description: data.description,
                });
            } else {
                await post("ideas/relations", {
                    ideaId: this.state.id,
                    relationTypeId: data.relationTypeId,
                    displayOrder: data.displayOrder,
                    fullName: data.fullName,
                    telephone: data.telephone,
                    mobile: data.mobile,
                    email: data.email,
                    description: data.description,
                });
            }
            //console.log(data)

        }))

        /*await Promise.all(medias.map(async (item) => {
          let data = new FormData();
          data.append('formFile', item);
          await upload("ideas/" + this.state.id + "/Media/Upload", data)

        }))*/

        if (typeof response === 'string') {
            this.setState({
                message: <ModalAlert type="success" message="ثبت ویرایش سوژه با موفقیت انجام شد." title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false,
                optionSetValue: this.state.initialValueOptionSets
            })

        }
    }

    confirmDelete(id, index, arrayHelpers) {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-box'>
                        <h4>تایید حذف!</h4>
                        <p>آیا نسبت به حذف این ارتباط مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDelete(id, index, arrayHelpers)
                            onClose()
                        }}>بله ارتباط را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDelete(id, index, arrayHelpers) {


        let response = '';
        if (id) {
            response = await remove("ideas/relations/" + id);
        }


        if (typeof response === 'string' || !id) {
            arrayHelpers.remove(index)
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

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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
                            <BreadcrumbItem active>ویرایش کردن سوژه</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">ویرایش کردن سوژه</h1>
                            <a href="#/ideas">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست سوژه ها
                            </a>
                        </div>

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
                <Row className="mt-4">
                    <Col xs="12">

                        <Formik
                            initialValues={{
                                subject: this.state.subject,
                                summary: this.state.summary,
                                details: this.state.details,
                                categories: this.state.categoriesValue,
                                statusId: this.state.statusId,
                                announcementId: this.state.announcementId,
                                countryId: this.state.countryId,
                                stateId: this.state.stateId,
                                provinceId: this.state.provinceId,
                                cityId: this.state.cityId,
                                villageId: this.state.villageId,
                                isPublished: this.state.isPublished,
                                relations: this.state.relations
                            }}
                            validationSchema={Yup.object().shape({
                                statusId: Yup.string()
                                    .required('تکمیل وضعیت سوژه الزامی است'),
                                relations: Yup.array()
                                    .of(
                                        Yup.object().shape({
                                            displayOrder: Yup.number()
                                                .typeError("تکمیل اولویت نمایش الزامی و باید به صورت عددی باشد.")
                                                .required('تکمیل اولویت نمایش الزامی است'),

                                            relationTypeId: Yup.string()
                                                .required('تکمیل نوع رابطه الزامی است.')
                                        })
                                    )
                            })}
                            onSubmit={(values) => {
                                //console.log(values)
                                this.formSubmit(values);
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
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === '3'})}
                                                    onClick={() => {
                                                        this.toggle('3');
                                                    }}
                                                >
                                                    مستندات
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({active: this.state.activeTab === '4'})}
                                                    onClick={() => {
                                                        this.toggle('4');
                                                    }}
                                                >
                                                    ارتباطات
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
                                                        <FormGroup >

                                                            <label>خلاصه سوژه</label>
                                                            <Input
                                                                name="summary"
                                                                type="textarea"
                                                                component="textarea"
                                                                placeholder="خلاصه ای در مورد سوژه وارد کنید..."
                                                                tag={Field}
                                                                invalid={errors.description && touched.description}
                                                            />

                                                            <FormFeedback>{errors.description}</FormFeedback>


                                                        </FormGroup>
                                                        <FormGroup >

                                                            <label>جزئیات سوژه</label>
                                                            <Input
                                                                name="details"
                                                                type="textarea"
                                                                component="textarea"
                                                                rows={10}
                                                                placeholder="جزئیاتی در مورد سوژه وارد کنید..."
                                                                tag={Field}
                                                                invalid={errors.description && touched.description}
                                                            />

                                                            <FormFeedback>{errors.description}</FormFeedback>


                                                        </FormGroup>
                                                        <FormGroup >

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
                                                        <FormGroup >

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
                                                                    defaultChecked={this.state.isPublished}
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
                                                                            تکمیل این ویژگی الزامی است.
                                                                        </div>
                                                                    }
                                                                </CardBody>
                                                            </Card>
                                                        )
                                                    })
                                                }

                                            </TabPane>
                                            <TabPane tabId="3">
                                                <Card>
                                                    <CardBody>

                                                        <FormGroup className="m-2">
                                                            <label>فایل مستندات</label>
                                                            <Input
                                                                name="file"
                                                                type="file"
                                                                onChange={(event) => {
                                                                    this.setState({
                                                                            mediaFile: event.currentTarget.files[0]
                                                                        }
                                                                    )
                                                                }}
                                                            />
                                                        </FormGroup>
                                                        <FormGroup className="m-2">
                                                            <label>توضیحات مستندات</label>
                                                            <Input
                                                                name="mediaDescription"
                                                                type="textarea"
                                                                component="textarea"
                                                                placeholder=""
                                                                onChange={(event) => {
                                                                    //console.log(event.target.value)
                                                                    this.setState({
                                                                        mediaDescription: event.target.value
                                                                    })
                                                                }}


                                                            />
                                                        </FormGroup>
                                                        <FormGroup className="m-2">
                                                            <Button className="btn btn-info"
                                                                    onClick={() => this.uploadMedia()}>
                                                                <i className="fa fa-upload"></i>
                                                                آپلود مستندات
                                                            </Button>
                                                        </FormGroup>

                                                    </CardBody>
                                                </Card>
                                                <MyUpload
                                                    items={this.state.upload}
                                                />
                                                <MyGallery
                                                    items={this.state.media}
                                                    onRemove={(data) => {
                                                        this.confirmDeleteMedia(data)
                                                    }}
                                                />

                                            </TabPane>
                                            <TabPane tabId="4">
                                                <FieldArray
                                                    name="relations"
                                                    render={(arrayHelpers) => (
                                                        <div>
                                                            {values.relations.map((data, index) => (
                                                                <Card className="p-4 mb-2" key={index}>
                                                                    <CardBody>
                                                                        <Input
                                                                            type="hidden"
                                                                            name={`relations[${index}].id`}
                                                                            tag={Field}
                                                                        />
                                                                        <FormGroup>

                                                                            <label>نوع ارتباط</label>
                                                                            <Select
                                                                                name={`relations[${index}].relationTypeId`}
                                                                                value={this.state.selectedRelationTypeId[index]}
                                                                                isMulti={false}
                                                                                onChange={(selectedOption) => {
                                                                                    let selectedRelationTypeId = this.state.selectedRelationTypeId
                                                                                    selectedRelationTypeId[index] = selectedOption
                                                                                    this.setState({selectedRelationTypeId: selectedOption});
                                                                                    setFieldValue(`relations[${index}].relationTypeId`, selectedOption.value)
                                                                                }}
                                                                                options={this.state.relationTypes}
                                                                                tag={Field}
                                                                                placeholder="انتخاب کنید..."
                                                                            />
                                                                            <ErrorMessage
                                                                                name={`relations[${index}].relationTypeId`}/>

                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>اولویت نمایش</label>
                                                                            <Input
                                                                                name={`relations[${index}].displayOrder`}
                                                                                type="number"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />
                                                                            <ErrorMessage
                                                                                name={`relations[${index}].displayOrder`}/>
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>نام و نام
                                                                                خانوادگی</label>
                                                                            <Input
                                                                                name={`relations[${index}].fullName`}
                                                                                type="text"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>تلفن ثابت</label>
                                                                            <Input
                                                                                name={`relations[${index}].telephone`}
                                                                                type="text"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>تلفن همراه</label>
                                                                            <Input
                                                                                name={`relations[${index}].mobile`}
                                                                                type="text"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>رایانامه
                                                                                (ایمیل)</label>
                                                                            <Input
                                                                                name={`relations[${index}].email`}
                                                                                type="text"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />
                                                                        </FormGroup>
                                                                        <FormGroup>

                                                                            <label>توضیحات</label>
                                                                            <Input
                                                                                name={`relations[${index}].description`}
                                                                                type="textarea"
                                                                                component="textarea"
                                                                                placeholder=""
                                                                                tag={Field}
                                                                            />

                                                                        </FormGroup>
                                                                        <Row className="mt-4">
                                                                            <Button color="danger"
                                                                                    type="button"

                                                                                    onClick={() => this.confirmDelete(data.id, index, arrayHelpers)}>
                                                                                <i className="fa fa-trash-o"></i>&nbsp;
                                                                                حذف ارتباط
                                                                            </Button>
                                                                        </Row>
                                                                    </CardBody>
                                                                </Card>

                                                            ))}
                                                            {typeof errors.items === 'string' ?
                                                                <div
                                                                    className="invalid-item">{errors.items}</div> : null}
                                                            <Row className="mt-4 mb-4">
                                                                <Col xs="12">
                                                                    <a className="btn btn-transparent btn-add"
                                                                       onClick={() => arrayHelpers.push({
                                                                           relationTypeId: '',
                                                                           displayOrder: '',
                                                                           fullName: '',
                                                                           telephone: '',
                                                                           mobile: '',
                                                                           email: '',
                                                                           description: '',
                                                                       })}>
                                                                        <i className="fa fa-plus"></i> اضافه
                                                                        کردن ارتباط
                                                                        جدید
                                                                    </a>
                                                                </Col>
                                                            </Row>

                                                        </div>
                                                    )}
                                                />
                                            </TabPane>
                                        </TabContent>
                                    </div>


                                    <Row className="mb-2 pr-3">
                                        <Button color="warning" type="submit" disabled={this.state.btnDisabled}>
                                            ثبت ویرایش سوژه
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
                }

            </div>
        );
    }

}

export default Edit;
