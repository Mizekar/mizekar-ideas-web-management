import React, {Component, lazy, Suspense} from 'react';
import {Breadcrumb, BreadcrumbItem, Col, Row} from "reactstrap";

class Assessment extends Component {
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
                            <BreadcrumbItem active>سوژه ها</BreadcrumbItem>
                            <BreadcrumbItem>در حال ارزیابی</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Assessment;