import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Col, Row} from "reactstrap";
import {get, remove} from "../../../utils/apiMainRequest";
import Loading from "../../../utils/loading";
import MyList from "../../../utils/MyList";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import
import moment from 'moment-jalaali'
import {Link} from "react-router-dom";



export default class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber: 1,
            pageSize: 10,
            loading: true,
            items: [],
            loadMore: true
        }

    }

    componentDidMount() {
        this.getList();
    }

    async getList() {
        this.setState(
            {
                loading: true
            }
        )

        let response = await get("ideas/Announcements", {
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize
        });
        console.log(response)

        let totalCount = response.totalCount;
        let pageSize = response.pageSize;
        let pageNumber = response.pageNumber;

        if (response.items.length > 0) {
            this.setState((prevState) => ({
                items: prevState.items.concat(response.items),
                pageNumber: prevState.pageNumber + 1,
                totalCount:totalCount
            }))
        }
        if (pageNumber * pageSize >= totalCount) {
            this.setState(
                {
                    loadMore: false
                }
            )

        }
        this.setState(
            {
                loading: false
            }
        )


    }

    confirmDelete(id) {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='confirm-box'>
                        <h4>تایید حذف!</h4>
                        <p>آیا نسبت به حذف این فراخوان مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDelete(id)
                            onClose()
                        }}>بله فراخوان را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDelete(id) {
        let response = await remove("ideas/Announcements/" + id);

        if (typeof response === 'string') {
            this.setState((prevState) => ({
                items: prevState.items.filter((item) => item.id !== id),
            }))
        }


    }

    render() {

        return (
            <div className="animated fadeIn">
                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/">خانه</Link></BreadcrumbItem>
                            <BreadcrumbItem active>فراخوان ها</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <div>
                                <h1 className="list-title">فراخوان ها</h1>
                                <h5 className="num-record">{this.state.totalCount} فراخوان</h5>
                            </div>
                            <Link to="/announcement/add" className="mlm-auto btn btn-primary">
                                <i className="fa fa-plus"></i>
                                &nbsp;
                                اضافه کردن فراخوان جدید
                            </Link>
                        </div>

                    </Col>
                </Row>
                {/*<MyList
                    rows={this.state.items}
                    columns={[
                        {
                            title: 'عنوان فراخوان',
                            sm: 4,
                            key: 'title'
                        },
                        {
                            title: 'تاریخ شروع',
                            sm: 1,
                            key: 'title'
                        },
                        {
                            title: 'تاریخ پایان',
                            sm: 1,
                            key: 'title'
                        },
                        {
                            title: 'وضعیت انتشار',
                            sm: 2,
                            key: 'title'
                        },
                        {
                            title: 'ویژه',
                            sm: 1,
                            key: 'title'
                        },
                        {
                            title: 'عملیات',
                            sm: 3,
                            key: 'buttons'
                        },
                    ]}

                />*/}
                <Row className="mt-4">

                    {this.state.items.length > 0 &&
                    <Col xs="12">
                      {/*  <Row className="row-list-header">
                            <Col xs="12" sm="4" className="col-list">عنوان فراخوان</Col>
                            <Col xs="12" sm="1" className="col-list">تاریخ شروع</Col>
                            <Col xs="12" sm="1" className="col-list">تاریخ پایان</Col>
                            <Col xs="12" sm="2" className="col-list">وضعیت انتشار</Col>
                            <Col xs="12" sm="1" className="col-list">ویژه</Col>
                            <Col xs="12" sm="3" className="col-list">عملیات</Col>
                        </Row>*/}
                        {
                            this.state.items.map((data) => {
                                let start = moment(data.startDate)
                                let end = moment(data.endDate)

                                return (
                                    <Row className="row-list" key={data.id}>
                                        <Col xs="12" sm="5" className="col-list">
                                            {data.mediaUrl &&<img src={data.mediaUrl} className="img-list"/>}
                                            {!data.mediaUrl &&<div className="default-img"></div>}
                                            {data.title}
                                        </Col>
                                        <Col xs="12" sm="1"
                                             className="col-list">{(start.jYear() + "-" + (start.jMonth() + 1) + "-" + start.jDate())}</Col>
                                        <Col xs="12" sm="1"
                                             className="col-list">{(end.jYear() + "-" + (end.jMonth() + 1) + "-" + end.jDate())}</Col>
                                        {/*<Col xs="12" sm="2" className="col-list">
                                            {data.isPublished &&
                                            <Button className="btn btn-square btn-outline-success " disabled={true}>منتشر
                                                شده</Button>
                                            }
                                            {!data.isPublished &&
                                            <Button className="btn btn-square btn-outline-secondary " disabled={true}>عدم
                                                انتشار</Button>
                                            }
                                        </Col>*/}
                                        <Col xs="12" sm="2" className="col-list">
                                            تعداد سوژه : <span className="text-cyan pl-1">{data.ideasCount}</span>
                                        </Col>
                                        <Col xs="12" sm="1" className="col-list">
                                            {data.isSpecial &&
                                            <span>فراخوان ویژه</span>

                                            }
                                            {!data.isSpecial &&
                                            <span>فراخوان عادی</span>
                                            }
                                        </Col>
                                        <Col xs="12" sm="2" className="col-list">
                                            <Link className="btn btn-secondary ml-2"
                                                    to={"/announcement/edit/" + data.id}>
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <Link className="btn btn-info ml-2"
                                                    to={"/announcement/upload/" + data.id}>
                                                <i className="fa fa-picture-o"></i>
                                            </Link>
                                            <Button
                                                className="btn btn-danger ml-1"
                                                onClick={() => this.confirmDelete(data.id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            })
                        }


                    </Col>
                    }
                    {
                        !this.state.loading && this.state.items.length === 0 &&
                        <Col xs="12">
                            <div className="emptyList">هیچ فراخوانی وارد نشده است!</div>
                        </Col>
                    }
                </Row>
                <Row className="mt-5">
                    {this.state.loading &&
                    <div className="loading-box">
                        <Loading color="#E8B51D"/>
                        <span className="loading-box-text">
                            لطفا منتظر بمانید...
                        </span>

                    </div>
                    }
                    {!this.state.loading && this.state.loadMore &&
                    <Col xs="12">
                        <Button className="btn-square btn btn-warning" onClick={() => this.getList()}>
                            بیشتر
                        </Button>
                    </Col>
                    }
                </Row>
            </div>
        )
            ;
    }

}
