import React from 'react';
import ClipboardJS from 'clipboard';
import { message, Button, Drawer, Icon, Modal, List } from 'antd';
import { newImage, delImage } from '../../../Api/api';

var clipboard = new ClipboardJS('.copy-image-text');

clipboard.on('success', function (e) {
    message.success("成功复制：" + e.text);

    e.clearSelection();
});

clipboard.on('error', function (e) {
    message.error("复制出错");
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});

class UploadImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uploading: false
        }
    }

    onError = () => {

        this.setState({ uploading: false });
    }
    onSuccess = () => {

        this.setState({ uploading: false });
    }
    check = (event) => {
        let input = event.target;
        if (input.files.length === 0) {
            return;
        }
        let obj = {
            file: input.files[0],
            onError: this.onError,
            onSuccess: this.onSuccess,
        }
        this.setState({ uploading: true });
        this.props.submit(obj);
    }

    render() {
        return (
            <div style={{ position: "relative", textAlign: 'center' }}>
                <div style={{ position: "relative", zIndex: -1 }}>
                    <Icon type="plus" />
                    <div>Upload</div>
                </div>
                <div style={{
                    position: "absolute", zIndex: 0,
                    top: 0, bottom: 0, left: 0, right: 0
                }}></div>
                {
                    !this.state.uploading && <input style={{
                        position: "absolute", zIndex: 0,
                        top: 0, bottom: 0, left: 0, right: 0, opacity: 0,
                        cursor: 'pointer'
                    }} type='file' accept="image/*" onChange={this.check} />
                }
            </div>
        )
    }
}

export class ImageList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previewVisible: false,
            previewImage: '',
            filelist: [],
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.initArticle !== null) {
            if (this.props.initArticle !== null) {
                this.setState({ filelist: this.props.initArticle.image });
            }
        }
        else {
            this.setState({ filelist: [] });
        }
    }

    handlePreviewCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    onClose = () => {
        this.props.setVisible(false);
    }

    uploadImage = (obj) => {
        newImage(this.props.initArticle.id, obj.file).then(rep => {
            let filelist = this.state.filelist;
            filelist.push(rep.data.data);
            this.setState({ 'filelist': filelist });
            message.success(rep.data.message);
            obj.onSuccess();
        }).catch(err => {
            message.error("上传失败, 详细错误请看控制台");
            obj.onError();
            console.log({ err })
        });
    }
    deleteImage = (image_id) => {
        return () => {
            delImage(image_id).then(rep => {
                let filelist = this.state.filelist;
                for (let i = 0; i < filelist.length; i++) {
                    if (filelist[i].id === image_id) {
                        filelist.splice(i, 1);
                    }
                }
                this.setState({ 'filelist': filelist });
                message.success(rep.data.message);
            }).catch(err => {
                message.error("删除失败, 详细错误请看控制台");
                console.log({ err });
            });
        }
    }

    render() {
        const { visible, initArticle } = this.props;
        const { previewVisible, previewImage, filelist } = this.state;

        if (initArticle === null) {
            return (
                <Drawer
                    title={'图片管理'}
                    width={500}
                    onClose={this.onClose}
                    visible={visible}
                    style={{
                        overflow: 'auto'
                    }}
                />
            );
        }

        return (
            <Drawer
                title={initArticle.title + ' - 图片管理'}
                width={500}
                onClose={this.onClose}
                visible={visible}
                style={{
                    overflow: 'auto'
                }}
            >
                <List
                    style={{ minHeight: "100%" }}
                    size="large"
                    header={null}
                    footer={
                        <UploadImage
                            submit={this.uploadImage}
                        />
                    }
                    bordered
                    dataSource={filelist}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button className="copy-image-text" shape="circle" icon="copy"
                                    data-clipboard-text={'![](' + item.file + ')'}
                                />,
                                // <Button shape="circle" icon="eye" onClick={null} />,
                                <Button shape="circle" icon="delete" onClick={this.deleteImage(item.id)} />,
                            ]}>
                            <a href={item.file} target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
                                <div style={{
                                    width: "100%", height: '4em',
                                    backgroundImage: 'url(' + item.file + ')',
                                    backgroundSize: '100% auto',
                                    backgroundPosition: 'center center'
                                }}></div>
                            </a>
                        </List.Item >
                    )}
                />

                <Modal
                    width={'auto'}
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handlePreviewCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        );
    }
}