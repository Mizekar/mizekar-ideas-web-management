import React, {Component} from 'react';
import {Col, Row} from "reactstrap";
//import moment from "moment-jalaali";

export default class MyList extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            rows: props.rows,
            columns: props.columns
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            rows: nextProps.rows,
            columns: nextProps.columns
        })
    }

    render() {
        return (

            <Row className="mt-4">
                {
                    this.state.rows.length > 0 &&
                    <Col xs="12">
                        <Row className="row-list-header">
                            {this.state.columns.map((data) => {
                                return (
                                    <Col xs="12" sm={data.sm} className="col-list">{data.title}</Col>
                                )
                            })}
                        </Row>
                        {
                            this.state.rows.map((row) => {
                                return (
                                    <Row className="row-list" key={row.id}>
                                        {
                                            this.state.columns.map((col) => {
                                                return (
                                                    <Col xs="12" sm={col.sm} className="col-list">{row[col.key]}</Col>
                                                )
                                            })}
                                    </Row>
                                )

                            })
                        }
                    </Col>
                }

            </Row>
        )

    }
}