import React from 'react';
import { message, Button, Drawer, Form, Input, Select, Checkbox, Modal, notification, Tooltip } from 'antd';
import { newArticle, alterArticle, newTag, newCorpus } from '../../../Api/api';


const CorpusCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        onCancel = () => {
            this.props.setVisible(false);
        }
        onCreate = () => {
            let data = this.props.form.getFieldsValue();
            newCorpus(data).then(rep => {
                let corpus = rep.data.data;
                this.props.pushCorpus(corpus);
                message.success("新建文集成功");
            }).catch(err => {
                notification.error({
                    message: '新建文集失败',
                    description: err.response.data.message || err.message,
                    duration: 0,
                });
                console.log({ err });
            }).then(() => {
                this.props.setVisible(false);
            });
        }

        render() {
            const {
                visible, form,
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="新建文集"
                    okText="新建"
                    onCancel={this.onCancel}
                    onOk={this.onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="名称">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请填写Corpus的名称' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);

export const ArticleForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                submiting: false,
                addCorpusStatus: false,
            }
        }

        setAddCorpusStatus = status => {
            this.setState({ addCorpusStatus: status });
        }

        render() {
            const { visible, initArticle, form } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    sm: { span: 4 },
                },
                wrapperCol: {
                    sm: { span: 15 },
                },
            };
            const formCheckboxLayout = {
                labelCol: {
                    sm: { span: 4 },
                },
                wrapperCol: {
                    sm: { span: 20 },
                },
            }

            return (
                <Drawer
                    title={(initArticle !== null && initArticle.title) || "新建文章"}
                    width={500}
                    onClose={this.onClose}
                    visible={visible}
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 108px)',
                        paddingBottom: '108px',
                    }}
                >
                    <CorpusCreateForm
                        visible={this.state.addCorpusStatus}
                        setVisible={this.setAddCorpusStatus}
                        pushCorpus={this.props.pushCorpus}
                    />
                    <Form>
                        <Form.Item
                            {...formItemLayout}
                            label="标题"
                        >
                            {getFieldDecorator('title', {
                                initialValue: initArticle !== null ? initArticle.title : "",
                                rules: [
                                    { required: true, message: '请输入文章的标题' },
                                    { max: 25, message: '最长不超过25个字符' },
                                    { whitespace: true },
                                ],
                            })(
                                <Input />//disabled={initArticle !== null} />
                            )}
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="Slug"
                        >
                            {getFieldDecorator('slug', {
                                initialValue: initArticle !== null ? initArticle.slug : "",
                                rules: [
                                    { required: true, message: '请输入文章的slug' },
                                    { max: 50, message: '最长不超过50个字符' },
                                    { whitespace: true },
                                ],
                            })(
                                <Input />//disabled={initArticle !== null} />
                            )}
                        </Form.Item>

                        <Form.Item
                            {...formCheckboxLayout}
                            label="全体可见"
                        >
                            {getFieldDecorator('is_public', {
                                valuePropName: 'checked',
                                initialValue: initArticle !== null ? initArticle.is_public : true,
                            })(
                                <Checkbox disabled={initArticle === null} />
                            )}
                            <p style={{ "display": "inline-block", marginLeft: "1em", marginBottom: 0, fontSize: "0.8em", color: "#bbb" }}>文章不出现在任何地方, 仅能通过链接访问</p>
                        </Form.Item>

                        <Form.Item
                            {...formCheckboxLayout}
                            label="暂不发布"
                        >
                            {getFieldDecorator('is_draft', {
                                valuePropName: 'checked',
                                initialValue: initArticle !== null ? initArticle.is_draft : true,
                            })(
                                <Checkbox disabled={initArticle === null} />
                            )}
                            <p style={{ "display": "inline-block", marginLeft: "1em", marginBottom: 0, fontSize: "0.8em", color: "#bbb" }}>文章为草稿状态, 不能被访问</p>
                        </Form.Item>

                        <Form.Item
                            {...formCheckboxLayout}
                            label="时效警告"
                        >
                            {getFieldDecorator('has_timeliness', {
                                valuePropName: 'checked',
                                initialValue: initArticle !== null ? initArticle.has_timeliness : true,
                            })(
                                <Checkbox disabled={initArticle === null} />
                            )}
                            <p style={{ "display": "inline-block", marginLeft: "1em", marginBottom: 0, fontSize: "0.8em", color: "#bbb" }}>文章会出现时效性警示</p>
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="标签"
                        >
                            {getFieldDecorator('tags', {
                                initialValue: initArticle !== null ? initArticle.tags.map(item => { return item.name }) : [],
                            })(
                                <Select
                                    mode="tags"
                                    placeholder="输入标签"
                                    style={{ width: '100%' }}
                                >
                                    {this.props.tags.map(item => (
                                        <Select.Option key={item.id} value={item.name}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label="文集"
                        >
                            {getFieldDecorator('corpus', {
                                initialValue: initArticle !== null && initArticle.corpus !== null ? initArticle.corpus.id : "",
                            })(
                                <Select
                                    placeholder="选择文集"
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                >
                                    {this.props.corpuses.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                            <Tooltip placement="bottom" title="新增文集" arrowPointAtCenter>
                                <Button
                                    style={{ position: "absolute", right: '-41px', bottom: '-5px' }}
                                    shape="circle"
                                    icon="plus"
                                    onClick={() => { this.setAddCorpusStatus(true); }}
                                />
                            </Tooltip>
                        </Form.Item>

                    </Form>

                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>取消</Button>
                        <Button onClick={this.onSubmit} type="primary" loading={this.state.submiting}>提交</Button>
                    </div>
                </Drawer>
            );
        }

        onClose = () => {
            this.props.setVisible(false);
            this.props.form.resetFields();
        }

        onSubmit = () => {
            let data = this.props.form.getFieldsValue();
            data.source = this.props.source;
            data.body = this.props.body;
            this.setState({ submiting: true });
            let _tags = [], _lock = 0;
            for (let i = 0; i < data.tags.length; i++) {
                let j = 0;
                for (; j < this.props.tags.length; j++) {
                    if (data.tags[i] === this.props.tags[j].name) {
                        _tags.push(this.props.tags[j].id);
                        break;
                    }
                }
                if (this.props.tags.length === j) {
                    _lock++;
                    newTag({ "name": data.tags[i] }).then(rep => {
                        let tag = rep.data.data;
                        _tags.push(tag.id);
                        message.success(`自动创建标签${data.tags[i]}成功`)
                        this.props.pushTag(tag);
                    }).catch(err => {
                        console.log({ err })
                        message.success(`自动创建标签${data.tags[i]}失败`)
                    }).then(() => {
                        _lock--;
                    })
                }
            }
            (function _submit(self) {
                setTimeout((self) => {
                    if (_lock !== 0) {
                        _submit();
                        return;
                    }
                    data.tags = _tags;
                    if (self.props.initArticle === null) {
                        newArticle(data).then(rep => {
                            let article = rep.data.data;
                            self.props.pushArticle(article)
                            self.props.setEditedArticle(article);
                            self.props.setVisible(false);
                            message.success("新建文章成功")
                        }).catch(err => {
                            notification.error({
                                message: '新建文章失败',
                                description: err.response.data.message || err.message,
                                duration: 0,
                            });
                            console.log({ err });
                        }).then(() => {
                            self.setState({ submiting: false });
                            self.onClose();
                        })
                    }
                    else {
                        alterArticle(self.props.initArticle.id, data).then(rep => {
                            self.props.setEditedArticle(self.props.initArticle);
                            message.success("修改文章信息成功")
                        }).catch(err => {
                            notification.error({
                                message: '修改文章信息失败',
                                description: err.response.data.message || err.message,
                                duration: 0,
                            });
                            console.log({ err });
                        }).then(() => {
                            self.setState({ submiting: false });
                            self.onClose();
                        })
                    }
                }, 500, self);
            })(this);
        }

    });
