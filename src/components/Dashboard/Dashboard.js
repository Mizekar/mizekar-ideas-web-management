import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardTitle, Col, Row} from "reactstrap";
import {Bar, Line} from 'react-chartjs-2';

import {get} from "../../utils/apiMainRequest";
import {CustomTooltips} from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {getStyle, hexToRgba} from '@coreui/coreui/dist/js/coreui-utilities'
import moment from "moment-jalaali";


const brandInfo = getStyle('--info')

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commonStatistics: {},
            ideasStatistics: [],
            ideasStatisticsLoading: true,
            ideasStatisticsPeriod: "Last30Days",
            assessmentResults: "Last30Days"
        }

    }

    componentDidMount() {
        this.commonStatistics()
        this.ideasStatistics()
        this.assessmentResults()
        this.profilesStatistics()
    }

    async commonStatistics() {
        let response = await get("ideas/statistics/common")

        this.setState({
            commonStatistics: response
        })

    }

    async ideasStatistics() {
        let response = await get("ideas/statistics/ideas/"+this.state.ideasStatisticsPeriod,{
            timePeriod: this.state.ideasStatisticsPeriod
        })

        //console.log(response)
        let label = [];
        let data = [];
        for (let i = 0; i < response.length; i++) {
            let item = response[i];
            let create = moment(item.date);


            let year = create.jYear();
            let month = (create.jMonth() + 1) >= 10 ? (create.jMonth() + 1) : '0' + (create.jMonth() + 1);
            let day = create.jDate() >= 10 ? create.jDate() : '0' + create.jDate();


            label.push(year + "/" + month + "/" + day)
            data.push(item.count)

        }

        let chart = {
            labels: label,
            datasets: [
                {

                    backgroundColor: hexToRgba(brandInfo, 10),
                    borderColor: brandInfo,
                    pointHoverBackgroundColor: '#fff',
                    borderWidth: 2,
                    data: data,
                }
            ],
        };

        let chartOpts = {
            tooltips: {
                enabled: false,
                custom: CustomTooltips,
                intersect: true,
                mode: 'index',
                position: 'nearest',
                callbacks: {
                    labelColor: function (tooltipItem, chart) {
                        return {backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor}
                    }
                }
            },
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                xAxes: [
                    {
                        gridLines: {
                            drawOnChartArea: false,
                        },
                    }],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 5,


                        },
                    }],
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                },
            },
        };
        this.setState({
            ideasStatistics: chart,
            ideasStatisticsOption: chartOpts,
            ideasStatisticsLoading: false
        })
    }
    async handleChangeIdeasStatisticsPeriod(period)
    {
        await this.setState({
            ideasStatisticsPeriod:period
        })

        this.ideasStatistics()
    }

    async assessmentResults() {
        let response = await get("ideas/statistics/assessments/results/"+this.state.assessmentResultsPeriod,{
            timePeriod: this.state.assessmentResultsPeriod
        })

        console.log(response)
    }

    async profilesStatistics() {

    }

    render() {
        let {commonStatistics} = this.state

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
                    <Col>
                        <Card className="p-3">
                            <Row>
                                <Col sm="5">
                                    <CardTitle className="mb-0">سوژه های جدید</CardTitle>
                                    <div className="small text-muted"></div>
                                </Col>
                                <Col sm="7" className="d-none d-sm-inline-block">
                                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                                        <ButtonGroup className="ml-3" aria-label="First group">
                                            <Button color="outline-secondary"
                                                    onClick={() => this.handleChangeIdeasStatisticsPeriod("Last7Days")}
                                                    active={this.state.ideasStatisticsPeriod === "Last7Days"}>7 روز
                                                گذشته</Button>
                                            <Button color="outline-secondary"
                                                    onClick={() => this.handleChangeIdeasStatisticsPeriod("Last30Days")}
                                                    active={this.state.ideasStatisticsPeriod === "Last30Days"}>30 روز
                                                گذشته</Button>
                                            <Button color="outline-secondary"
                                                    onClick={() => this.handleChangeIdeasStatisticsPeriod("Total")}
                                                    active={this.state.ideasStatisticsPeriod === "Total"}>تمام زمان
                                                ها</Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </Col>
                            </Row>
                            {!this.state.ideasStatisticsLoading &&
                            <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                                <Line
                                    data={this.state.ideasStatistics}
                                    options={this.state.ideasStatisticsOption}
                                    height={300}
                                />
                            </div>
                            }


                        </Card>
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
