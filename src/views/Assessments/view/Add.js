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
import {Field, FieldArray, Form, Formik, getIn} from "formik";
import * as Yup from "yup";
import {post} from "../../../utils/apiMainRequest";
import ModalAlert from "../../../utils/modalAlert";
import Loading from "../../../utils/loading";

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

class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            btnDisabled: false,
            items: []

        }

    }

    componentDidMount() {
        this.addItem();
    }


    async formSubmit(payload, reset) {

        this.setState({
            message: '',
            btnDisabled: true
        })
        /* console.log(payload)
         return*/


        let response = await post("ideas/assessments", {
            title: payload.title,
            description: payload.description,
            displayOrder: payload.displayOrder
        });

        if (typeof response === 'string') {

            //alert('inja');
            //console.log(payload.items)
            let assessmentId=response;
            await Promise.all(payload.options.map(async (data) => {
                //console.log(data)
                let responseOption=await post("ideas/assessments/option", {
                    ideaAssessmentId: assessmentId,
                    title: data.title,
                    displayOrder: data.displayOrder,
                    isRequired: data.isRequired,
                    isMultiSelect: data.isMultiSelect
                });

                if (typeof responseOption === 'string') {

                    let optionId=responseOption;

                    await Promise.all(data.items.map(async(item) => {
                        //console.log(data)
                        await post("ideas/assessments/item", {
                            ideaAssessmentOptionSetId: optionId,
                            title: item.title,
                            displayOrder: item.displayOrder,
                            weight: item.weight,
                            isDisabled: item.isDisabled
                        });
                    }))

                }
            }))


            this.setState({
                message: <ModalAlert type="success" message="ثبت ارزیابی با موفقیت انجام شد." title="هشدار سیستم"
                                     icon="fa fa-check-square-o"/>,
                btnDisabled: false
            })
            reset()

        }


    }

    addItem() {
        let index = (new Date()).getTime();
        let items = this.state.items;
        items[index] = index
        //console.log(items)
        this.setState({
            items: items
        });
    }

    removeItem(index) {
        delete this.state.items[index];
        // set the state
        this.setState({items: this.state.items});
    }

    render() {

        return (

            <div className="animated fadeIn">
                {this.state.message}

                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
                            <BreadcrumbItem tag="a" href="#/assessments">ارزیابی ها</BreadcrumbItem>
                            <BreadcrumbItem active>اضافه کردن ارزیابی جدید</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <h1 className="list-title">اضافه کردن ارزیابی جدید</h1>
                            <a href="#/assessments">
                                <i className="fa fa-list"></i>
                                &nbsp;
                                لیست ارزیابی ها
                            </a>
                        </div>

                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col xs="12">


                        <Formik
                            initialValues={{
                                title: '',
                                description: '',
                                displayOrder: '',
                                options: [
                                    {
                                        title: '',
                                        description: '',
                                        displayOrder: '',
                                        isMultiSelect: false,
                                        isRequired: false,
                                        items: [{
                                            title: '',
                                            displayOrder: '',
                                            weight: '',
                                            isDisabled: false
                                        }]
                                    }
                                ],
                            }}
                            validationSchema={Yup.object().shape({
                                displayOrder: Yup.number()
                                    .required('تکمیل اولویت نمایش الزامی است')
                                    .typeError("مقدار وارد شده باید به صورت اعداد صحیح باشد."),
                                options: Yup.array()
                                    .of(
                                        Yup.object().shape({
                                            displayOrder: Yup.number()
                                                .typeError("تکمیل اولویت الزامی و باید به صورت عددی باشد.")
                                                .required('تکمیل اولویت نمایش الزامی است'),
                                            items: Yup.array()
                                                .of(
                                                    Yup.object().shape({
                                                        displayOrder: Yup.number()
                                                            .typeError("تکمیل اولویت الزامی و باید به صورت عددی باشد.")
                                                            .required('تکمیل اولویت نمایش الزامی است'),
                                                        weight: Yup.number()
                                                            .required('تکمیل وزن گزینه الزامی است')
                                                            .typeError("تکمیل وزن الزامی و باید به صورت عددی باشد."),
                                                    })
                                                )
                                        }),

                                    )
                            })}
                            onSubmit={(values, {resetForm}) => {
                                this.formSubmit(values, resetForm);
                            }}>
                            {({errors, touched, values}) => (
                                <Form>
                                    <Card className="p-4">
                                        <CardBody>
                                            <FormGroup row>
                                                <label>عنوان ارزیابی</label>
                                                <Input
                                                    name="title"
                                                    type="text"
                                                    placeholder=""
                                                    tag={Field}
                                                    invalid={errors.title && touched.title}
                                                />

                                                <FormFeedback>{errors.title}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup row>

                                                <label>توضیح ارزیابی</label>
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


                                        </CardBody>
                                    </Card>
                                    <FormGroup tag="fieldset">
                                        <legend>سوالات ارزیابی</legend>
                                    </FormGroup>
                                    <FieldArray
                                        name="options"
                                        render={(arrayOptions) => (
                                            <div>
                                                {values.options.map((dataOptions, indexOptions) => (
                                                    <Card className="pr-4 pl-4 pt-0 pb-0" key={indexOptions}>
                                                        <CardBody>
                                                            <div className="remove-options">
                                                                    <a onClick={() => arrayOptions.remove(indexOptions)} className="remove-options-icon">
                                                                        <i className="fa fa-times"></i>
                                                                    </a>
                                                            </div>
                                                            <FormGroup row>
                                                                <label>عنوان سوال</label>
                                                                <Input
                                                                    name={`options[${indexOptions}].title`}
                                                                    type="text"
                                                                    placeholder=""
                                                                    tag={Field}
                                                                />

                                                                <ErrorMessage
                                                                    name={`options[${indexOptions}].title`}/>
                                                            </FormGroup>
                                                            <FormGroup row>

                                                                <label>توضیح سوال</label>
                                                                <Input
                                                                    name={`options[${indexOptions}].description`}
                                                                    type="textarea"
                                                                    component="textarea"
                                                                    placeholder=""
                                                                    tag={Field}
                                                                />

                                                                <ErrorMessage
                                                                    name={`options[${indexOptions}].description`}/>


                                                            </FormGroup>
                                                            <FormGroup row>
                                                                <label>اولویت نمایش</label>
                                                                <Input
                                                                    name={`options[${indexOptions}].displayOrder`}
                                                                    type="number"
                                                                    placeholder=""
                                                                    tag={Field}
                                                                />

                                                                <ErrorMessage
                                                                    name={`options[${indexOptions}].displayOrder`}/>
                                                            </FormGroup>
                                                            <FormGroup check className="mr-2 mt-3">
                                                                <Label check>
                                                                    <Input
                                                                        type="checkbox"
                                                                        name={`options[${indexOptions}].isMultiSelect`}
                                                                        defaultChecked={false}
                                                                        tag={Field}
                                                                    />
                                                                    چند انتخابی
                                                                </Label>
                                                            </FormGroup>
                                                            <FormGroup check className="mr-2 mt-3">
                                                                <Label check>
                                                                    <Input
                                                                        type="checkbox"
                                                                        name={`options[${indexOptions}].isRequired`}
                                                                        defaultChecked={false}
                                                                        tag={Field}
                                                                    />
                                                                    اجباری
                                                                </Label>
                                                            </FormGroup>

                                                            <FieldArray
                                                                name={`options[${indexOptions}].items`}
                                                                render={(arrayHelpers) => (
                                                                    <div>
                                                                        {values.options[indexOptions].items.map((data, index) => (
                                                                            <Card
                                                                                className=" mt-4 mb-1 bg-light itemsBox"
                                                                                key={indexOptions+'-'+index}
                                                                            >
                                                                                <CardBody>
                                                                                    <Row className="align-items-start">
                                                                                        <Col sm="2">

                                                                                            <Input
                                                                                                type="number"
                                                                                                name={`options[${indexOptions}].items[${index}].displayOrder`}
                                                                                                tag={Field}
                                                                                                placeholder="اولویت نمایش"
                                                                                                /*invalid={errors.displayOrder && touched.displayOrder}*/
                                                                                            />
                                                                                            <ErrorMessage
                                                                                                name={`options[${indexOptions}].items[${index}].displayOrder`}/>

                                                                                        </Col>
                                                                                        <Col sm="5">
                                                                                            <Input
                                                                                                type="text"
                                                                                                tag={Field}
                                                                                                name={`options[${indexOptions}].items[${index}].title`}
                                                                                                placeholder="عنوان گزینه"
                                                                                            />
                                                                                        </Col>

                                                                                        <Col sm="3">
                                                                                            <Input
                                                                                                type="number"
                                                                                                tag={Field}
                                                                                                name={`options[${indexOptions}].items[${index}].weight`}
                                                                                                placeholder="وزن گزینه"
                                                                                            />
                                                                                            <ErrorMessage
                                                                                                name={`options[${indexOptions}].items[${index}].weight`}/>
                                                                                        </Col>
                                                                                        <Col sm="1">

                                                                                            <FormGroup check
                                                                                                       className="p-2">
                                                                                                <Label check>
                                                                                                    <Input
                                                                                                        type="checkbox"
                                                                                                        tag={Field}
                                                                                                        name={`options[${indexOptions}].items[${index}].isDisabled`}
                                                                                                    />
                                                                                                    غیر فعال
                                                                                                </Label>
                                                                                            </FormGroup>
                                                                                        </Col>
                                                                                        <Col sm="1"
                                                                                             className="remove-items">

                                                                                            <i className="cui-trash"
                                                                                               onClick={() => arrayHelpers.remove(index)}>

                                                                                            </i>


                                                                                        </Col>
                                                                                    </Row>
                                                                                </CardBody>
                                                                            </Card>

                                                                        ))}
                                                                        {typeof errors.items === 'string' ?
                                                                            <div
                                                                                className="invalid-item">{errors.items}</div> : null}
                                                                        <Row className="mt-4 mb-4">
                                                                            <Col xs="12" className="itemsBox">
                                                                                <a className="btn btn-transparent btn-add"
                                                                                   onClick={() => arrayHelpers.push({
                                                                                       displayOrder: '',
                                                                                       title: '',
                                                                                       weight: '',
                                                                                       isDisabled: false
                                                                                   })}>
                                                                                    <i className="fa fa-plus"></i>&nbsp;
                                                                                    اضافه کردن گزینه جدید
                                                                                </a>
                                                                            </Col>
                                                                        </Row>

                                                                    </div>
                                                                )}
                                                            />
                                                        </CardBody>
                                                    </Card>
                                                ))
                                                }
                                                <Row className="mt-4 mb-4">
                                                    <Col xs="12">
                                                        <a className="btn btn-transparent btn-add"
                                                           onClick={() => arrayOptions.push(
                                                               {
                                                                   title: '',
                                                                   description: '',
                                                                   displayOrder: '',
                                                                   isMultiSelect: false,
                                                                   isRequired: false,
                                                                   items: [{
                                                                       title: '',
                                                                       displayOrder: '',
                                                                       weight: '',
                                                                       isDisabled: false
                                                                   }]
                                                               }
                                                           )}>
                                                            <i className="fa fa-plus"></i>&nbsp;
                                                            اضافه کردن سوال جدید
                                                        </a>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}
                                    />


                                    {/* {let FriendArrayErrors = errors =>
                                    typeof errors.friends === 'string' ? <div>{errors.friends}</div> : null;}*/}

                                    <Row className="mt-4 mb-4 mr-1">

                                        <Button color="warning" type="submit" disabled={this.state.btnDisabled}
                                                className="px-4">
                                            ثبت ارزیابی
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