import React, { Component } from 'react';
import { List, Input, Button, Select } from 'antd';
import PerfectScrollbar from 'perfect-scrollbar';

const { Option } = Select;

class Sider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: "",
            corpus: "",
        };
    }

    editArticle = (article) => {
        return () => {
            this.props.setEditedArticle(article);
        }
    }
    openArticleInWeb = (article) => {
        return () => {
            window.open('/articles/' + article.slug + '/');
        }
    }

    setCorpus = (corpus) => {
        this.setState({ corpus: corpus })
    }

    render() {
        const { searchValue, corpus } = this.state;
        let articles = this.props.articles;
        if (searchValue && articles.length >= 0) {
            articles = articles.filter(item => { return item.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1; })
        }
        if (corpus && articles.length >= 0) {
            articles = articles.filter(item => { return item.corpus !== null && item.corpus.name === corpus })
        }
        return (
            <div ref="sider" className="ps" style={{ width: '100%', height: "100%", overflow: "auto" }}>
                <List
                    style={{ minHeight: "100%" }}
                    size="large"
                    header={<div>
                        <Input
                            placeholder="对标题进行搜索"
                            onChange={e => { this.setState({ "searchValue": e.target.value }) }}
                            style={{ width: '100%' }}
                            allowClear
                        />
                        <Select
                            showSearch
                            style={{ width: "100%", marginTop: 10 }}
                            placeholder="选择文集"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.setCorpus}
                        >
                            <Option value={""}>{"杂记"}</Option>
                            {
                                this.props.corpuses.map(corpus => {
                                    return <Option value={corpus.name}>{corpus.name}</Option>
                                })
                            }
                        </Select>
                    </div>}
                    footer={<div></div>}
                    bordered
                    dataSource={articles}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button shape="circle" icon="edit" onClick={this.editArticle(item)} />,
                                <Button shape="circle" icon="eye" onClick={this.openArticleInWeb(item)} />
                            ]}>
                            <div style={{ width: "100%", wordBreak: "break-all" }}>
                                {item.title}
                            </div>
                        </List.Item >
                    )}
                />
            </div>
        )
    }

    componentDidMount() {
        this.ps = new PerfectScrollbar(this.refs.sider);
    }

    componentDidUpdate() {
        this.ps.update();
    }

    componentWillUnmount() {
        this.ps.destroy();
        this.ps = null;
    }
}

export default Sider;
