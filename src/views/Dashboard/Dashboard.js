import React, {Component, lazy, Suspense} from 'react';
import {Breadcrumb, BreadcrumbItem, Col, Row} from "reactstrap";

class Dashboard extends Component {
    constructor(props) {
        super(props);

    }

    render() {

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
            </div>
        );
    }

}

export default Dashboard;