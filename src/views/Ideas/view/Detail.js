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
import classnames from "classnames";
import {get} from "../../../utils/apiMainRequest";


class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            activeTab: '1',
            loadData: false
        }
    }

    async componentWillMount() {
        await this.getById();
    }

    async getById() {
        let responseOption = await get("ideas/optionsets", {
            pageNumber: 1,
            pageSize: 1000
        });

        let optionSetValue = []

        for (let i = 0; i < responseOption.items.length; i++) {
            let data = responseOption.items[i];
            optionSetValue[data.id] = []
        }

        let response = await get("ideas/details/" + this.state.id, {});
        //console.log(optionSetValue)
        console.log(response)
        for (let i = 0; i < response.selectedOptions.length; i++) {
            let data = response.selectedOptions[i];
            optionSetValue[data.ideaOptionSetId].push(
                    data.title
            );
        }

        this.setState(
            {
                loadData: true,
                subject: response.subject,
                summary: response.summary,
                details: response.details,
                selectedOptions: responseOption.items,
                optionSetValue:optionSetValue

            }
        )
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (

            <div className="animated fadeIn">
                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
                            <BreadcrumbItem tag="a" href="#/ideas">سوژه ها</BreadcrumbItem>
                            <BreadcrumbItem active>جزئیات سوژه</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

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
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '5'})}
                                onClick={() => {
                                    this.toggle('5');
                                }}
                            >
                                پسندها
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '6'})}
                                onClick={() => {
                                    this.toggle('6');
                                }}
                            >
                                نظرات
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Card>
                                <CardBody className="p-0">
                                    <Row className="p-3 m-0 b-b-1">
                                        <Col xs="12" sm="2" md="1" className="label-detail">عنوان :</Col>
                                        <Col xs="12" sm="10" md="11">{this.state.subject}</Col>
                                    </Row>
                                    <Row className="p-3 m-0 b-b-1">
                                        <Col xs="12" sm="2" md="1" className="label-detail">خلاصه :</Col>
                                        <Col xs="12" sm="10" md="11">{this.state.summary}</Col>
                                    </Row>
                                </CardBody>

                            </Card>
                            <Card>
                                <CardBody className="p-0">
                                    <Row className="p-3 m-0 b-b-1">
                                        <Col xs="12" sm="2" md="1" className="label-detail">فراخوان :</Col>
                                        <Col xs="12" sm="10" md="11">{this.state.announcement}</Col>
                                    </Row>
                                </CardBody>

                            </Card>
                            <Card>
                                <CardBody className="p-0">
                                    <Row className="p-3 m-0 b-b-1">
                                        <Col xs="12" className="label-detail">توضیحات کامل :</Col>
                                    </Row>
                                    <Row className="p-3 m-0 b-b-1">
                                        <Col xs="12">{this.state.details}</Col>
                                    </Row>
                                </CardBody>

                            </Card>
                        </TabPane>
                        <TabPane tabId="2">
                            <Card>
                                <CardBody className="p-0">
                                    {
                                        this.state.loadData && this.state.selectedOptions.map((data) => {
                                            return (
                                                <Row className="p-3 m-0 b-b-1" key={data.id}>
                                                    <Col xs="12" sm="12" md="4"
                                                         className="label-detail">{data.title}</Col>
                                                    <Col xs="12" sm="12" md="8">{this.state.optionSetValue[data.id].map((data,index)=>{
                                                        return(
                                                            <div key={index}>{data}</div>
                                                        )

                                                    })}</Col>
                                                </Row>
                                            )
                                        })
                                    }

                                </CardBody>

                            </Card>
                        </TabPane>
                        <TabPane tabId="3">
                        </TabPane>
                        <TabPane tabId="4">
                        </TabPane>
                        <TabPane tabId="5">
                        </TabPane>
                        <TabPane tabId="6">
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        )
    }
}

export default Detail;