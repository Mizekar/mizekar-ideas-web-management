import React from 'react';
import {Card, CardBody, Col, Progress, Row} from "reactstrap";
//import moment from "moment-jalaali";

export default class MyUpload extends React.Component {
    constructor(props) {
        super(props);

        //console.log(props);

        this.state = {
            items: props.items,
            onRemove: props.onRemove,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            items: nextProps.items,
        })
    }

    fileTypeViewer(data) {
        if (data.mimeType == 'image/jpeg' || data.mimeType == 'image/jpg' || data.mimeType == 'image/png' || data.mimeType == 'image/gif') {
            return (
                <img src={data.file} className="upload-img"/>
            )
        }
        else if (data.mimeType == 'video/mp4' || data.mimeType == 'video/mpeg' || data.mimeType == 'video/x-msvideo') {
            return (
                <div className="file-upload-application video">
                    <i className="fa fa-file-movie-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'audio/mpeg') {
            return (
                <div className="file-upload-application audio">
                    <i className="fa fa-file-audio-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'application/zip' || data.mimeType == 'application/x-rar-compressed') {
            return (
                <div className="file-upload-application zip">
                    <i className="fa fa-file-zip-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'application/pdf') {
            return (
                <div className="file-upload-application pdf">
                    <i className="fa fa-file-pdf-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'application/vnd.ms-excel' || data.mimeType=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return (
                <div className="file-upload-application excel">
                    <i className="fa fa-file-excel-o"></i>
                </div>
            )
        } else if (data.mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || data.mimeType=='application/msword') {
            return (
                <div className="file-upload-application word">
                    <i className="fa fa-file-word-o"></i>
                </div>
            )
        } else if (data.mimeType == 'aapplication/vnd.ms-powerpoint' || data.mimeType=="application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            return (
                <div className="file-upload-application powerpoint">
                    <i className="fa fa-file-powerpoint-o"></i>
                </div>
            )
        }
        else {
            return (
                <div className="file-upload-application ">
                    <i className="fa fa-file-o"></i>
                </div>
            )
        }
    }

    render() {

        return (


            this.state.items.map((data) => {
                return (
                    <Card className="gallery-box" key={data.id}>
                        <CardBody className="p-3">
                            <Row className="row-eq-height">
                                <Col xs="12" sm="2" lg="1">
                                    {this.fileTypeViewer(data)}

                                </Col>
                                <Col xs="12" sm="5" lg="6">
                                    <div className="file-title">{data.name}</div>
                                    <div className="file-size-text">اندازه فایل
                                        : {(data.size / 1024).toFixed(2)} کیلوبایت
                                    </div>
                                </Col>
                                <Col xs="12" sm="5" lg="5">
                                    <div className="clearfix">
                                        <div className="float-left">
                                            {data.percent} %
                                        </div>
                                    </div>
                                    <Progress className="progress-xs" color={data.percent < 98 ? 'info' : 'success'}
                                              value={data.percent}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                )
            })


        )
    }
}