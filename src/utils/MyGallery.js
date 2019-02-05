import React from 'react';
import {Card, CardBody, Col, Row} from "reactstrap";
import ReactPlayer from 'react-player'
//import moment from "moment-jalaali";

export default class MyGallery extends React.Component {
    constructor(props) {
        super(props);

        console.log(props);

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
                <img src={data.fileUrl} className="file-url-box-img"/>
            )
        } else if (data.mimeType == 'video/mp4') {
            return (
                <ReactPlayer
                    url={data.fileUrl}
                    className="file-url-box-img"
                    controls={true}
                />
            )
        } else if (data.mimeType == 'audio/mpeg') {
            return (
                <ReactPlayer
                    url={data.fileUrl}
                    className="file-url-box-img"
                    controls={true}
                />
            )
        }
        else if (data.mimeType == 'application/zip' || data.mimeType == 'application/x-rar-compressed') {
            return (
                <div className="file-url-box-application pdf">
                    <i className="fa fa-file-zip-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'application/pdf') {
            return (
                <div className="file-url-box-application pdf">
                    <i className="fa fa-file-pdf-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'application/vnd.ms-excel' || data.mimeType=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            return (
                <div className="file-url-box-application excel">
                    <i className="fa fa-file-excel-o"></i>
                </div>
            )
        } else if (data.mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || data.mimeType=='application/msword') {
            return (
                <div className="file-url-box-application word">
                    <i className="fa fa-file-word-o"></i>
                </div>
            )
        }
        else if (data.mimeType == 'aapplication/vnd.ms-powerpoint' || data.mimeType=="application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            return (
                <div className="file-url-box-application powerpoint">
                    <i className="fa fa-file-powerpoint-o"></i>
                </div>
            )
        }
        else {
            return (
                <div className="file-url-box-application">
                    <i className="fa fa-file-o"></i>
                </div>
            )
        }
    }

    render() {

        return (
            <Row className="row-eq-height">
                {
                    this.state.items.map((data) => {
                        return (
                            <Col xs="12" sm="6" lg="3" key={data.id} className="gallery-col">
                                <Card className="gallery-box">
                                    <CardBody className="pt-3 pr-3 pl-3 pb-0">
                                        <div className="file-url-box">
                                            {this.fileTypeViewer(data)}
                                        </div>
                                        <div>{data.filename}</div>
                                        <div className="file-size-text">اندازه فایل : {(data.length)} کیلوبایت</div>
                                        {
                                            data.id &&
                                            <div className="pt-3">
                                                <a onClick={() => {
                                                    this.state.onRemove(data.id)
                                                }} className="btn btn-danger text-white"><i
                                                    className="fa fa-trash"></i> حذف </a>
                                                <a href={data.fileUrl} className="btn btn-info text-white mr-1"><i
                                                    className="fa fa-download"></i> دانلود</a>
                                            </div>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        )
                    })

                }
            </Row>
        )
    }
}