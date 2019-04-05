import React, { Component } from 'react';
import { Row, Col, notification } from 'antd';
import './App.css';
import Sider from './Components/Sider';
import Main from './Components/Main';
// import Detail from './Components/Detail';
import { getAllArticle, getAllTag, getAllCorpus, getArticle } from './Api/api';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            tags: [],
            corpuses: [],
            editedArticle: null,
        }
    }

    setEditedArticle = (article) => {
        if (article === null) {
            this.setState({ editedArticle: article });
        } else {
            getArticle(article.id).then(rep => {
                this.setState({ editedArticle: rep.data.data });
            }).catch(err => {
                console.log({ err });
                notification.error({
                    message: `获取文章信息: ${article.title} 出现错误`,
                    description: err.response.data.message || err.message,
                    duration: 0,
                });
            })
        }
    }
    pushArticle = (article) => {
        let articles = this.state.articles,
            i;
        for (i = 0; i < articles.length; i++) {
            if (article.id === articles[i].id) {
                articles[i] = article;
            }
        }
        if (i === articles.length) {
            articles.shift(article);
        }
        this.setState({ 'articles': articles });
    }
    pushTag = (tag) => {
        let tags = this.state.tags,
            i;
        for (i = 0; i < tags.length; i++) {
            if (tag.id === tags[i].id) {
                tags[i] = tag;
            }
        }
        if (i === tags.length) {
            tags.push(tag);
        }
        this.setState({ 'tags': tags });
    }
    pushCorpus = (corpus) => {
        let corpuses = this.state.corpuses,
            i;
        for (i = 0; i < corpuses.length; i++) {
            if (corpus.id === corpuses[i].id) {
                corpuses[i] = corpus;
            }
        }
        if (i === corpuses.length) {
            corpuses.push(corpus);
        }
        this.setState({ 'corpuses': corpuses });
    }

    componentDidMount() {
        getAllArticle()
            .then(rep => {
                this.setState({ articles: rep.data.data });
            }).catch(err => {
                console.log({ err });
                notification.error({
                    message: '文章列表请求错误',
                    description: err.response.data.message || err.message,
                    duration: 0,
                });
            });
        getAllTag()
            .then(rep => {
                this.setState({ tags: rep.data.data });
            }).catch(err => {
                console.log({ err });
                notification.error({
                    message: '标签列表请求错误',
                    description: err.response.data.message || err.message,
                    duration: 0,
                });
            });
        getAllCorpus()
            .then(rep => {
                this.setState({ corpuses: rep.data.data });
            }).catch(err => {
                console.log({ err });
                notification.error({
                    message: '文集列表请求错误',
                    description: err.response.data.message || err.message,
                    duration: 0,
                });
            });
    }

    render() {
        const { articles, editedArticle, tags, corpuses } = this.state;
        return (
            <Row gutter={0} style={{ height: "100%" }}>
                <Col span={4} style={{ height: "100%" }}>
                    <Sider
                        articles={articles}
                        setEditedArticle={this.setEditedArticle}
                    />
                </Col>
                <Col span={20} style={{ height: "100%" }}>
                    <Main
                        editedArticle={editedArticle}
                        setEditedArticle={this.setEditedArticle}
                        pushArticle={this.pushArticle}
                        pushCorpus={this.pushCorpus}
                        pushTag={this.pushTag}
                        tags={tags}
                        corpuses={corpuses}
                    />
                </Col>
            </Row>
        );
    }
}

export default App;
