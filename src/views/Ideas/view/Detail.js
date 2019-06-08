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
import moment from 'moment-jalaali'


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
        this.getIdeaRelations();
        this.getIdeaStatuses();
        this.getIdeaLikes();
        this.getIdeaComments();
        await this.getById();

    }

    async getById() {

        //get option set items for idea
        let responseOption = await get("ideas/optionsets", {
            pageNumber: 1,
            pageSize: 1000
        });
        let optionSetValue = []

        for (let i = 0; i < responseOption.items.length; i++) {
            let data = responseOption.items[i];
            optionSetValue[data.id] = []
        }

        //get idea detail info
        let response = await get("ideas/details/" + this.state.id, {});
        //console.log(response)
        //console.log(response)
        for (let i = 0; i < response.selectedOptions.length; i++) {
            let data = response.selectedOptions[i];
            optionSetValue[data.ideaOptionSetId].push(
                data.title
            );
        }

        console.log(response)

        this.setState(
            {
                loadData: true,
                subject: response.subject,
                summary: response.summary,
                details: response.details,
                selectedOptions: responseOption.items,
                optionSetValue: optionSetValue,
                categories: response.categories,
                statusId: response.statusId

            }
        )
    }

    async getIdeaStatuses() {
        let response = await get("ideas/status", {
            pageNumber: 1,
            pageSize: 1000
        });

        this.setState({
            ideaStatuses: response.items
        })
    }

    async getIdeaRelations() {
        let response = await get("ideas/relations/idea/" + this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response)

        let ideaRelations = []
        let relationTypeId = []
        for (let i = 0; i < response.items.length; i++) {
            let data = response.items[i];
            let index = relationTypeId.indexOf(data.relationTypeId)
            if (index == -1) {
                relationTypeId.push(data.relationTypeId)
                index = relationTypeId.indexOf(data.relationTypeId)
            }

            if (ideaRelations[index] === undefined) {
                ideaRelations[index] = {
                    id: data.relationTypeId,
                    title: data.relationType,
                    items: []
                }
            }
            ideaRelations[index].items.push(
                {
                    id: data.id,
                    fullName: data.fullName,
                    telephone: data.telephone,
                    mobile: data.mobile,
                    email: data.email,
                    description: data.description,
                }
            )
        }

        this.setState({
            relations: ideaRelations,
        })
    }

    async getIdeaLikes() {
        let response = await get("social/likes/post/"+ this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response);

        this.setState({
            ideaLikesItems: response.items,
            totalLikes:response.totalCount
        })
    }
    async getIdeaComments() {
        let response = await get("social/comments/post/"+ this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response);

        this.setState({
            ideaCommentsItems: response.items,
            totalComments:response.totalCount
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
                <Card className="mt-2">
                    <CardBody className="p-0">
                        <Row className="p-3 m-0">
                            <Col xs="12" md="10">
                                {
                                    this.state.loadData && this.state.ideaStatuses.map(data => {
                                        let className = "btn-white"
                                        if (data.id == this.state.statusId) {
                                            className = "btn-cyan"
                                        }
                                        //alert(className)

                                        return (
                                            <Button className={"btn ml-2 " + className} key={data.id}>
                                                {data.name}
                                            </Button>
                                        )
                                    })
                                }
                            </Col>
                            <Col xs="12" md="2" className="action-detail">
                                <a href={"#/ideas/edit/" + this.state.id} className="btn btn-white ml-4">ویرایش</a>
                                <a className="trash-detail"><i className="fa fa-trash"></i> </a>
                            </Col>
                        </Row>

                    </CardBody>

                </Card>
                <div className="mt-3">
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
                                        <Col xs="12" sm="2" md="1" className="label-detail">دسته بندی :</Col>
                                        <Col xs="12" sm="10" md="11">
                                            {
                                                this.state.loadData && this.state.categories.map((data, index) => {
                                                    return (
                                                        <div key={index}>{data.name}</div>
                                                    )
                                                })
                                            }
                                        </Col>
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
                                                    <Col xs="12" sm="12"
                                                         md="8">{this.state.optionSetValue[data.id].map((data, index) => {
                                                        return (
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
                            {
                                this.state.loadData && this.state.relations.map((data) => {
                                    return (
                                        <Card key={data.id}>
                                            <CardBody className="p-0">
                                                <Row className="p-3 m-0 b-b-1">
                                                    <Col xs="12" className="label-relation">{data.title}</Col>
                                                </Row>
                                                {data.items.map(item => {
                                                    return (
                                                        <Row className="p-3 m-0 b-b-1" key={item.id}>
                                                            <Col xs="12" md="3">
                                                                <div className="avatar-yellow float-right ml-2"></div>
                                                                <div className="float-right">
                                                                    <div>{item.fullName}</div>
                                                                    <div className="file-size-text">{item.email}</div>
                                                                </div>
                                                            </Col>
                                                            <Col xs="12" md="7">
                                                                <div className="description-relation">
                                                                    {item.description}
                                                                </div>

                                                            </Col>
                                                            <Col xs="12" md="2">
                                                                {item.telephone &&
                                                                <div className="contact-relation mb-2">
                                                                    <i className="fa fa-phone"></i>
                                                                    {item.telephone}
                                                                </div>
                                                                }
                                                                {item.mobile &&
                                                                <div className="contact-relation mb-1">
                                                                    <i className="fa fa-mobile"></i>
                                                                    {item.mobile}
                                                                </div>
                                                                }

                                                            </Col>
                                                        </Row>
                                                    )
                                                })}

                                            </CardBody>

                                        </Card>
                                    )
                                })
                            }
                        </TabPane>
                        <TabPane tabId="5">
                            <Row className="mt-4">

                                {this.state.loadData && this.state.ideaLikesItems.length > 0 &&
                                <Col xs="12">
                                    <div className="mb-4">
                                        {this.state.totalLikes} نفر این سوژه را پسندیدند.
                                    </div>
                                    {
                                        this.state.ideaLikesItems.map((data) => {

                                            //console.log(data.writer);


                                            let create = moment(data.baseInfo.createdOn);
                                            let date =new Date(data.baseInfo.createdOn);

                                            let year=create.jYear();
                                            let month=(create.jMonth() + 1)>=10?(create.jMonth() + 1):'0'+(create.jMonth() + 1);
                                            let day=create.jDate()>=10?create.jDate():'0'+create.jDate();


                                            return (
                                                <Row className="row-list" key={data.writer.id}>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        <img src={'../../assets/img/avatars/default.png'} className="img-avatar-list" alt=""/>
                                                    </Col>
                                                    <Col xs="12" sm="9" className="col-list">
                                                        {data.writer.firstName+" "+data.writer.lastName}
                                                    </Col>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        {year+ "/" + month + "/" + day}

                                                    </Col>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        {
                                                            date.getHours()+":"+date.getMinutes()
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </Col>
                                }
                            </Row>

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