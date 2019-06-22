import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Card, Col, Row} from "reactstrap";

import {get} from "../../utils/apiMainRequest";

class Dashboard extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      commonStatistics:{}
    }

  }
  componentDidMount() {
    this.commonStatistics()
    this.ideasStatistics()
    this.assessmentResults()
    this.profilesStatistics()
  }
  async commonStatistics()
  {
    let response=await get("ideas/statistics/common")

    this.setState({
      commonStatistics:response
    })

  }
  async ideasStatistics()
  {

  }
  async assessmentResults()
  {

  }
  async profilesStatistics()
  {

  }

  render() {
    let {commonStatistics}=this.state

        return (
            <div className="animated fadeIn">
                <Row className="default-breadcrumb">
                    <Col xs="12">
                        <Breadcrumb>
                            <BreadcrumbItem tag="a" href="#">خانه</BreadcrumbItem>
                            <BreadcrumbItem active>پیشخوان</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
              <Row>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-white d-flex align-items-center">
                    <i className="fa fa-plus color-yellow"></i>
                    <div className="title">
                      <div className="stat-num color-yellow">{commonStatistics.ideas}</div>
                      <div className="stat-title">سوژه</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-white d-flex align-items-center">
                    <i className="fa fa-bullhorn color-cyan"></i>
                    <div className="title">
                      <div className="stat-num color-yellow">{commonStatistics.announcements}</div>
                      <div className="stat-title">فراخوان</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-white d-flex align-items-center">
                    <i className="fa fa-check-square-o color-yellow"></i>
                    <div className="title">
                      <div className="stat-num color-yellow">{commonStatistics.assessmentResults}</div>
                      <div className="stat-title">ارزیابی</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-white d-flex align-items-center">
                    <i className="fa fa-user color-cyan"></i>
                    <div className="title">
                      <div className="stat-num color-yellow">{commonStatistics.users}</div>
                      <div className="stat-title">کاربر</div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-yellow d-flex align-items-center">
                    <i className="fa fa-heart"></i>
                    <div className="title">
                      <div className="stat-num color-white">{commonStatistics.likes}</div>
                      <div className="stat-title">پسند</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-yellow d-flex align-items-center">
                    <i className="fa fa-comments-o"></i>
                    <div className="title">
                      <div className="stat-num color-white">{commonStatistics.comments}</div>
                      <div className="stat-title">پیام</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-yellow d-flex align-items-center">
                    <i className="fa fa-file"></i>
                    <div className="title">
                      <div className="stat-num color-white">{commonStatistics.media} </div>
                      <div className="stat-title">فایل</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <div className="stat-box bg-yellow d-flex align-items-center">
                    <i className="fa fa-database"></i>
                    <div className="title">
                      <div className="stat-num color-white">{commonStatistics.mediaSizeKb}Kb</div>
                      <div className="stat-title">فضای اشغال شده</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
        );
    }

}

export default Dashboard;
