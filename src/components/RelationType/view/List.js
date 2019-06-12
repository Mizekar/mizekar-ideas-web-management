import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Col, Row} from "reactstrap";
import {get, remove} from "../../../utils/apiMainRequest";
import Loading from "../../../utils/loading";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import {Link} from "react-router-dom"; // Import


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

        let response = await get("ideas/relationTypes", {
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize
        });
        //console.log(response)

        let totalCount=response.totalCount;
        let pageSize=response.pageSize;
        let pageNumber=response.pageNumber;

        if (response.items.length > 0) {
            this.setState((prevState) => ({
                items: prevState.items.concat(response.items),
                pageNumber: prevState.pageNumber + 1,
                totalCount:totalCount
            }))
        }
        if(pageNumber*pageSize>=totalCount){
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
                        <p>آیا نسبت به حذف این نوع رابطه مطمئنید؟</p>
                        <Button className="btn btn-square btn-primary ml-2" onClick={onClose}>نه</Button>
                        <Button className="btn btn-square btn-info ml-2" onClick={() => {
                            this.handleClickDelete(id)
                            onClose()
                        }}>بله نوع رابطه را حذف کن!
                        </Button>
                    </div>
                )
            }
        })
    }

    async handleClickDelete(id) {
        let response = await remove("ideas/relationTypes/" + id);

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
                            <BreadcrumbItem active>انواع رابطه ها</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12">
                        <div className="d-flex flex-row align-items-center">
                            <div>
                                <h1 className="list-title">انواع رابطه ها</h1>
                                <h5 className="num-record">{this.state.totalCount} رابطه</h5>
                            </div>

                            <Link to="/relationType/add" className="mlm-auto btn btn-primary">
                                <i className="fa fa-plus"></i>
                                &nbsp;
                                اضافه کردن نوع رابطه جدید
                            </Link>

                        </div>

                    </Col>
                </Row>
                <Row className="mt-4">
                    {this.state.items.length > 0 &&
                    <Col xs="12">
                       {/* <Row className="row-list-header">
                            <Col xs="12" sm="5" className="col-list">عنوان نوع رابطه</Col>
                            <Col xs="12" sm="1" className="col-list">رنگ</Col>
                            <Col xs="12" sm="2" className="col-list">اولویت نمایش</Col>
                            <Col xs="12" sm="2" className="col-list">وضعیت انتشار</Col>
                            <Col xs="12" sm="2" className="col-list">عملیات</Col>
                        </Row>*/}
                        {
                            this.state.items.map((data) => {
                                let hexColorStyle={
                                    background:data.hexColor
                                }
                                return (
                                    <Row className="row-list" key={data.id}>
                                        <Col xs="12" sm="8" className="col-list">{data.name}</Col>
                                        <Col xs="12" sm="1" className="col-list">
                                            <div className="circle-color" style={hexColorStyle}></div>
                                        </Col>
                                      {/*  <Col xs="12" sm="2" className="col-list">{data.displayOrder}</Col>*/}
                                        <Col xs="12" sm="2" className="col-list">
                                            {data.isPublished &&
                                            <Button className="btn btn-square btn-outline-success disabled" disabled="">منتشر شده</Button>
                                            }
                                            {!data.isPublished &&
                                            <Button className="btn btn-square btn-outline-secondary disabled" disabled="">عدم انتشار</Button>
                                            }
                                        </Col>
                                        <Col xs="12" sm="1" className="col-list">
                                            <Link className="btn btn-info ml-2"
                                                    to={"/relationType/edit/" + data.id}>
                                                <i className="fa fa-pencil"></i>
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
                            <div className="emptyList">هیچ نوع رابطه ای وارد نشده است!</div>
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
        );
    }

}
