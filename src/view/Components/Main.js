import React, { Component } from 'react';
import { Row, Col, Button, Tooltip, message } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import PerfectScrollbar from 'perfect-scrollbar';

import { alterArticle, push, getRender } from '../../Api/api';
import { ArticleForm } from './Form/ArticleDetail';
import { ImageList } from './Form/ImageList';


class Main extends Component {
    constructor(props) {
        super(props);

        this.save_task = null;
        this.render_task = null;
        this.state = {
            code: "",
            html: "",
            saving: false,
            detailVisible: false,
            imagesVisible: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editedArticle !== null) {
            if (this.props.editedArticle === null || nextProps.editedArticle.source !== this.props.editedArticle.source) {
                this.setState({
                    code: nextProps.editedArticle.source,
                    html: nextProps.editedArticle.body
                });
            }
        } else {
            if (this.editedArticle !== null) {
                this.setState({
                    code: "",
                    html: ""
                });
            }
        }
    }

    setDetailVisible = (visible) => {
        this.setState({ detailVisible: visible });
    }
    setImageVisible = (visible) => {
        this.setState({ imagesVisible: visible });
    }

    push = () => {
        push().then(rep => {
            message.success("正在push到远程库");
        }).catch(err => {
            message.error("出现了一些差错");
        })
    }

    renderMarkdown = code => {
        if (this.render_task !== null) {
            clearTimeout(this.render_task);
        }
        this.render_task = setTimeout(code => {
            getRender(code).then(rep => {
                this.setState({ html: rep.data.data.result });
            }).catch(err => {
                console.log("渲染出现了点问题", { err });
            })
        }, 500, code);
    }
    onCodeChange = (newCode, e) => {
        this.setState({ code: newCode });
        this.renderMarkdown(newCode);
        if (this.props.editedArticle !== null) {
            if (this.save_task !== null) {
                clearTimeout(this.save_task);
            }
            this.save_task = setTimeout(() => {
                this.save();
            }, 5000);
        }
    }
    save = () => {
        this.setState({ saving: true })
        alterArticle(this.props.editedArticle.id, { 'source': this.state.code, 'body': this.state.html })
            .then(() => {
                message.success("文章内容保存成功")
            }).catch(() => {
                message.error("文章内容保存失败")
            }).then(() => {
                this.setState({ saving: false });
            })
        if (this.save_task !== null) {
            clearTimeout(this.save_task);
            this.save_task = null;
        }
    }
    handleKeyDown = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        // For MAC we can use metaKey to detect cmd key
        if ((event.ctrlKey && charCode === 's') || (event.metaKey && charCode === 's')) {
            event.preventDefault();
            if (this.props.editedArticle !== null) {
                this.save()
            }
        }
    }

    render() {
        let { detailVisible, imagesVisible, code, html, saving } = this.state;
        const options = {
            fontSize: '16',
            selectOnLineNumbers: true,
            wordWrap: true,
            minimap: {
                enabled: false
            }
        };
        const editedArticle = this.props.editedArticle;
        return (
            <Row gutter={0} style={{ height: "100%" }} onKeyDown={this.handleKeyDown}>
                <Col span={24} style={{ borderBottom: "1px solid #d9d9d9", position: "relative" }}>

                    <div style={{
                        position: "absolute",
                        display: "inline-block",
                        height: '100%',
                        textAlign: 'center',
                        left: 0,
                        right: 0,
                        lineHeight: '40px'
                    }}>
                        {(editedArticle != null && '正在编辑 - ' + editedArticle.title) || 'Maltose 编辑器'}
                    </div>

                    <div style={{ display: "inline-block" }}>
                        <Tooltip placement="bottomLeft" title={(editedArticle !== null && '编辑文章') || '新建文章'}
                            arrowPointAtCenter>
                            <Button size="large" shape="circle"
                                icon={(editedArticle !== null && 'form') || 'file-add'}
                                onClick={() => {
                                    this.setDetailVisible(true)
                                }}
                            />
                        </Tooltip>

                        <Tooltip placement="bottom" title={'关闭编辑'} arrowPointAtCenter>
                            <Button size="large" shape="circle" icon="close-circle"
                                onClick={() => {
                                    this.props.setEditedArticle(null)
                                }}
                            />
                        </Tooltip>

                        <Tooltip placement="bottom" title={'保存内容'} arrowPointAtCenter>
                            <Button size="large" shape="circle" icon="save"
                                onClick={this.save}
                                disabled={editedArticle === null}
                                loading={saving}
                            />
                        </Tooltip>

                        <Tooltip placement="bottom" title={'图片管理'} arrowPointAtCenter>
                            <Button size="large" shape="circle" icon="picture"
                                disabled={editedArticle === null}
                                onClick={() => {
                                    this.setImageVisible(true)
                                }}
                            />
                        </Tooltip>

                    </div>

                    <div style={{ display: "inline-block", float: "right" }}>
                        <Tooltip placement="bottom" title={'git push'} arrowPointAtCenter>
                            <Button size="large" shape="circle" icon="arrow-up"
                                onClick={() => {
                                    this.push()
                                }}
                            />
                        </Tooltip>
                        <a href='/accounts/logout/'>
                            <Tooltip placement="bottomRight" title="退出登录" arrowPointAtCenter>
                                <Button size="large" shape="circle" icon="logout" />
                            </Tooltip>
                        </a>
                    </div>

                </Col>
                <Col span={12} style={{ height: 'calc(100% - 41px)' }}>
                    <MonacoEditor
                        width={'100%'}
                        height={'100%'}
                        language="markdown"
                        theme="vs"
                        value={code}
                        options={options}
                        onChange={this.onCodeChange}
                    />
                </Col>
                <Col span={12} style={{ height: 'calc(100% - 41px)', overflowY: 'auto' }}>
                    <div id="markdown"
                        className="markdown-body ps"
                        style={{ padding: '20px' }}
                        dangerouslySetInnerHTML={{ __html: html }}>
                    </div>
                </Col>

                <ArticleForm
                    visible={detailVisible}
                    setVisible={this.setDetailVisible}
                    initArticle={this.props.editedArticle}
                    pushArticle={this.props.pushArticle}
                    setEditedArticle={this.props.setEditedArticle}
                    tags={this.props.tags}
                    pushTag={this.props.pushTag}
                    corpuses={this.props.corpuses}
                    pushCorpus={this.props.pushCorpus}
                    source={code}
                    body={html}
                />

                <ImageList
                    visible={imagesVisible}
                    setVisible={this.setImageVisible}
                    initArticle={this.props.editedArticle}
                    setEditedArticle={this.props.setEditedArticle}
                />

            </Row>
        );
    }

    componentDidMount() {
        this.ps = new PerfectScrollbar(document.querySelector("#markdown"));
    }

    componentDidUpdate() {
        this.ps.update();
    }

    componentWillUnmount() {
        this.ps.destroy();
        this.ps = null;
    }
}

export default Main;
