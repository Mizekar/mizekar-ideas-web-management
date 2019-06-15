import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Col, Row} from "reactstrap";
import {get, remove} from "../../../utils/apiMainRequest";
import Loading from "../../../utils/loading";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import {Link} from "react-router-dom";
import moment from "moment-jalaali"; // Import


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

        let response = await get("ideas", {
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
                totalCount: totalCount
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
                        <p>آیا نسبت به حذف این سوژه مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDelete(id)
                            onClose()
                        }}>بله سوژه را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDelete(id) {
        let response = await remove("ideas/" + id);

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
                            <BreadcrumbItem active>سوژه ها</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <div>
                                <h1 className="list-title">سوژه ها</h1>
                                <h5 className="num-record">{this.state.totalCount} سوژه</h5>
                            </div>

                            <Link to="/ideas/add" className="mlm-auto btn btn-primary">
                                <i className="fa fa-plus"></i>
                                &nbsp;
                                اضافه کردن سوژه جدید
                            </Link>
                        </div>


                    </Col>
                </Row>
                <Row className="mt-4">

                    {this.state.items.length > 0 &&
                    <Col xs="12">
                        {/*<Row className="row-list-header">
                            <Col xs="12" sm="4" className="col-list">عنوان سوژه</Col>
                            <Col xs="12" sm="1" className="col-list">تاریخ شروع</Col>
                            <Col xs="12" sm="1" className="col-list">تاریخ پایان</Col>
                            <Col xs="12" sm="2" className="col-list">وضعیت انتشار</Col>
                            <Col xs="12" sm="1" className="col-list">ویژه</Col>
                            <Col xs="12" sm="3" className="col-list">عملیات</Col>
                        </Row>*/}
                        {
                            this.state.items.map((data) => {

                                let create = moment(data.baseInfo.createdOn);
                                let date = new Date(data.baseInfo.createdOn);

                                let year = create.jYear();
                                let month = (create.jMonth() + 1) >= 10 ? (create.jMonth() + 1) : '0' + (create.jMonth() + 1);
                                let day = create.jDate() >= 10 ? create.jDate() : '0' + create.jDate();

                                return (
                                    <Row className="row-list" key={data.id}>
                                        <Col xs="12" sm="5" className="col-list">
                                            <div>
                                                {data.mediaUrl && <img src={data.mediaUrl} className="img-list"/>}
                                                {!data.mediaUrl && <div className="default-img"></div>}
                                            </div>
                                            <div>
                                                <div>
                                                    {data.subject}
                                                </div>
                                                <div className="d-flex text-description">
                                                    <div>{data.baseInfo.createdBy.firstName + " " + data.baseInfo.createdBy.lastName}</div>
                                                    <div className="pl-3">  {year + "/" + month + "/" + day}</div>
                                                    <div className="pl-3">
                                                        {
                                                            date.getHours() + ":" + date.getMinutes()
                                                        }
                                                    </div>
                                                </div>

                                            </div>

                                        </Col>
                                        <Col xs="12" sm="3" className="col-list">
                                            فراخوان : <span className="text-cyan pl-1">{data.announcement.title}</span>
                                        </Col>
                                        <Col xs="12" sm="2" className="col-list">

                                            <Button className="btn btn-square btn-outline-success " disabled={true}>
                                                {data.status.name}
                                            </Button>

                                        </Col>
                                        <Col xs="12" sm="2" className="col-list">
                                            <Link className=" btn btn-success ml-2"
                                                  to={"/ideas/detail/" + data.id}>
                                                <i className="fa fa-list-alt"></i>
                                            </Link>
                                            <Link className=" btn btn-secondary ml-2"
                                                  to={"/ideas/edit/" + data.id}>
                                                <i className="fa fa-pencil"></i>
                                            </Link>
                                            <Link className="btn btn-info ml-2"
                                                  to={"/ideas/upload/" + data.id}>
                                                <i className="fa fa-picture-o"></i>
                                            </Link>
                                            <Button
                                                className=" btn btn-danger ml-1"
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
                            <div className="emptyList">هیچ سوژه ای وارد نشده است!</div>
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
