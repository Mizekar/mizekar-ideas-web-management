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
import {get, post, remove} from "../../../utils/apiMainRequest";
import moment from 'moment-jalaali'
import {Link} from "react-router-dom";
import ReactPlayer from "../../../utils/MyGallery";
import {confirmAlert} from "react-confirm-alert";


class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            activeTab: '1',
            loadData: false,
            ideaCommentsItems: [],
            ideaAssessmentsItems: []
        }
    }

    async componentWillMount() {
        this.getIdeaRelations();
        this.getIdeaStatuses();
        this.getIdeaLikes();
        this.getIdeaComments();
        this.getIdeaAssessments();
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

        //console.log(response)

        this.setState(
            {
                loadData: true,
                subject: response.subject,
                summary: response.summary,
                details: response.details,
                selectedOptions: responseOption.items,
                optionSetValue: optionSetValue,
                categories: response.categories,
                statusId: response.statusId,
                announcement: response.announcement,
                media: response.media

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
        let response = await get("social/likes/post/" + this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response);

        this.setState({
            ideaLikesItems: response.items,
            totalLikes: response.totalCount
        })
    }

    async getIdeaComments() {
        let response = await get("social/comments/post/" + this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });

        //console.log(response);

        this.setState({
            ideaCommentsItems: response.items,
            totalComments: response.totalCount
        })
    }

    async getIdeaAssessments() {
        let response = await get("ideas/assessments/result/idea/" + this.state.id, {
            pageNumber: 1,
            pageSize: 1000
        });
        //console.log(response)

        this.setState({
            ideaAssessmentsItems: response.items,
            totalAssessments: response.totalCount
        })

    }

    confirmDelete(assessmentId, byUser,index) {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-box'>
                        <h4>تایید حذف!</h4>
                        <p>آیا نسبت به حذف این ارزیابی مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleDeleteAssessment(assessmentId, byUser,index)
                            onClose()
                        }}>بله ارزیابی را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleDeleteAssessment(assessmentId, byUser,index) {
        let response = await remove("ideas/assessments/do/", {
            ideaId: this.state.id,
            assessmentId: assessmentId,
            byUser: byUser
        });

        //console.log(response)


        if (typeof response === 'string') {
           this.setState((prevState) => ({
               ideaAssessmentsItems: prevState.ideaAssessmentsItems.filter((item,indexItem) =>indexItem !== index),
           }))
         }


    }
    async editAssessment(assessmentId, byUser)
    {
        let response = await get("ideas/assessments/result/details", {
            ideaId: this.state.id,
            assessmentId:assessmentId,
            creatorId: byUser
        });

        this.props.history.push({
            pathname: '/ideas/assessment/'+this.state.id,
            state: {
                data: response
            }
        })

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    fileTypeViewer(data) {
        if (data.mimeType === 'image/jpeg' || data.mimeType === 'image/jpg' || data.mimeType === 'image/png' || data.mimeType === 'image/gif') {
            return (
                <img src={data.fileUrl} className="file-url-box-img-detail"/>
            )
        } else if (data.mimeType === 'video/mp4') {
            return (
                <ReactPlayer
                    url={data.fileUrl}
                    className="file-url-box-img"
                    controls={true}
                />
            )
        } else if (data.mimeType === 'audio/mpeg') {
            return (
                <ReactPlayer
                    url={data.fileUrl}
                    className="file-url-box-img"
                    controls={true}
                />
            )
        } else if (data.mimeType === 'application/zip' || data.mimeType === 'application/x-rar-compressed') {
            return (
                <div className="file-url-box-application pdf">
                    <i className="fa fa-file-zip-o"></i>
                </div>
            )
        } else if (data.mimeType === 'application/pdf') {
            return (
                <div className="file-url-box-application pdf">
                    <i className="fa fa-file-pdf-o"></i>
                </div>
            )
        } else if (data.mimeType === 'application/vnd.ms-excel' || data.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return (
                <div className="file-url-box-application excel">
                    <i className="fa fa-file-excel-o"></i>
                </div>
            )
        } else if (data.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || data.mimeType === 'application/msword') {
            return (
                <div className="file-url-box-application word">
                    <i className="fa fa-file-word-o"></i>
                </div>
            )
        } else if (data.mimeType === 'aapplication/vnd.ms-powerpoint' || data.mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            return (
                <div className="file-url-box-application powerpoint">
                    <i className="fa fa-file-powerpoint-o"></i>
                </div>
            )
        } else {
            return (
                <div className="file-url-box-application">
                    <i className="fa fa-file-o"></i>
                </div>
            )
        }
    }

    render() {

        return (

            <div className="animated fadeIn">
                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/">خانه</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/ideas">سوژه ها</Link></BreadcrumbItem>
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
                                <Link to={"/ideas/edit/" + this.state.id} className="btn btn-white mr-4">ویرایش</Link>
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
                                نظرات ({this.state.totalComments})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({active: this.state.activeTab === '7'})}
                                onClick={() => {
                                    this.toggle('7');
                                }}
                            >
                                ارزیابی ها
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
                                        <Col xs="12" sm="10"
                                             md="11">{this.state.announcement != null ? this.state.announcement.title : '---'}</Col>
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
                            {
                                this.state.loadData && this.state.media.map((data) => {
                                    return (
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    <Col xs={12} sm={2}>
                                                        {this.fileTypeViewer(data)}
                                                    </Col>
                                                    <Col xs={12} sm={10} className="file-description">

                                                        <div>
                                                            {data.description}
                                                        </div>
                                                        <a href={data.fileUrl} className="btn btn-info text-white ml-1"><i
                                                            className="fa fa-download"></i> دانلود</a>

                                                    </Col>

                                                </Row>
                                            </CardBody>
                                        </Card>
                                    )
                                })
                            }

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
                                                                <div className="avatar-yellow float-left mr-2"></div>
                                                                <div className="float-left">
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
                                            let date = new Date(data.baseInfo.createdOn);

                                            let year = create.jYear();
                                            let month = (create.jMonth() + 1) >= 10 ? (create.jMonth() + 1) : '0' + (create.jMonth() + 1);
                                            let day = create.jDate() >= 10 ? create.jDate() : '0' + create.jDate();


                                            return (
                                                <Row className="row-list" key={data.writer.id}>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        <img src={'../../assets/img/avatars/default.png'}
                                                             className="img-avatar-list" alt=""/>
                                                    </Col>
                                                    <Col xs="12" sm="9" className="col-list">
                                                        {data.writer.firstName + " " + data.writer.lastName}
                                                    </Col>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        {year + "/" + month + "/" + day}

                                                    </Col>
                                                    <Col xs="12" sm="1" className="col-list">
                                                        {
                                                            date.getHours() + ":" + date.getMinutes()
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
                            {
                                this.state.ideaCommentsItems.length > 0 && this.state.ideaCommentsItems.map((data) => {
                                    let create = moment(data.baseInfo.createdOn);


                                    let year = create.jYear();
                                    let month = (create.jMonth() + 1) >= 10 ? (create.jMonth() + 1) : '0' + (create.jMonth() + 1);
                                    let day = create.jDate() >= 10 ? create.jDate() : '0' + create.jDate();
                                    return (
                                        <Card className="box-item p-3 comment-box">
                                            <div className="author mb-0">
                                                {data.writer.profileImage === "" &&
                                                <div className="avatar-yellow"></div>
                                                }
                                                {data.writer.profileImage !== "" &&
                                                <img src={data.writer.profileImage}></img>
                                                }

                                                <h5
                                                    className="ideas-title-2 pl-2 text-black">{data.writer.firstName + " " + data.writer.lastName}</h5>


                                            </div>
                                            <div className="comment-text">
                                                {
                                                    data.text.split('\n').map((item, key) => {
                                                        return <span key={key}>{item}<br/></span>
                                                    })
                                                }

                                            </div>

                                            <div className="action-comment d-flex align-items-center">
                                                <div className="date-comment">
                                                    {year + "/" + month + "/" + day}
                                                </div>
                                            </div>


                                            {
                                                data.lastSubComments.map((item) => {

                                                    return (
                                                        <div className="sub-comment">
                                                            <div className="author mb-0">
                                                                {item.writer.profileImage === "" &&
                                                                <div className="avatar-yellow"></div>
                                                                }
                                                                {item.writer.profileImage !== "" &&
                                                                <img src={item.writer.profileImage}></img>
                                                                }

                                                                <h5
                                                                    className="ideas-title-2 pl-2 text-black">{item.writer.firstName + " " + item.writer.lastName}</h5>

                                                            </div>
                                                            <div className="comment-text">
                                                                {
                                                                    item.text.split('\n').map((items, key) => {
                                                                        return <span key={key}>{items}<br/></span>
                                                                    })
                                                                }

                                                            </div>
                                                            <div className="action-comment d-flex align-items-center">
                                                                <div className="date-comment">
                                                                    {year + "/" + month + "/" + day}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )

                                                })
                                            }

                                        </Card>

                                    )
                                })
                            }

                        </TabPane>
                        <TabPane tabId="7">
                            <Link to={"/ideas/assessment/" + this.state.id} className="mlm-auto btn btn-primary mb-3">
                                <i className="fa fa-plus"></i>
                                &nbsp;
                                ثبت ارزیابی جدید
                            </Link>
                            {
                                this.state.ideaAssessmentsItems.map((data,index) => {
                                    let create = moment(data.baseInfo.createdOn);


                                    let year = create.jYear();
                                    let month = (create.jMonth() + 1) >= 10 ? (create.jMonth() + 1) : '0' + (create.jMonth() + 1);
                                    let day = create.jDate() >= 10 ? create.jDate() : '0' + create.jDate();
                                    return (
                                        <Row className="row-list" key={data.id}>
                                            <Col xs="12" sm="5" className="col-list d-flex">
                                                <div>
                                                    {data.baseInfo.createdBy.profileImage !== '' &&
                                                    <img src={data.baseInfo.createdBy.profileImage} className="avatar br-100"/>
                                                    }
                                                    {data.baseInfo.createdBy.profileImage === '' &&
                                                    <div className="avatar-yellow"></div>

                                                    }
                                                </div>
                                                <div className="ml-2">
                                                    <div>{data.baseInfo.createdBy.firstName + " " + data.baseInfo.createdBy.lastName}</div>
                                                    <div className="text-description">{year + "/" + month + "/" + day}</div>
                                                </div>

                                            </Col>
                                            <Col xs="12" sm="5" className="col-list">
                                                {data.ideaAssessment}
                                            </Col>

                                            <Col xs="12" sm="1" className="col-list">
                                                امتیاز : <span className="text-cyan pl-1"> {data.score}</span>
                                               </Col>
                                            <Col xs="12" sm="1" className="col-list">
                                                <Button
                                                    className="btn btn-secondary ml-2"
                                                    onClick={() => this.editAssessment(data.ideaAssessmentId, data.baseInfo.createdById)}
                                                     >
                                                    <i className="fa fa-pencil"></i>
                                                </Button>
                                                <Button
                                                    className=" btn btn-danger ml-1"
                                                    onClick={() => this.confirmDelete(data.ideaAssessmentId, data.baseInfo.createdById,index)}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }

                        </TabPane>
                    </TabContent>
                </div>
            </div>
        )
    }
}

export default Detail;
