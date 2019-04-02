import React, { Component } from 'react';
import { List, Input, Button } from 'antd';

const Search = Input.Search;

class Sider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: "",
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

    render() {
        let searchValue = this.state.searchValue;
        let articles = this.props.articles;
        articles = this.state.searchValue !== "" && articles.length >= 0 ? articles.filter(item => { return item.title.indexOf(searchValue) > -1; }) : articles;
        return (
            <div style={{ width: '100%', height: "100%", overflow: "auto" }}>
                <List
                    style={{ minHeight: "100%" }}
                    size="large"
                    header={<Search
                        placeholder="input search text"
                        onSearch={value => { this.setState({ searchValue: value }); }}
                        style={{ width: '100%' }}
                    />}
                    footer={<div></div>}
                    bordered
                    dataSource={articles}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button shape="circle" icon="edit" onClick={this.editArticle(item)} />,
                                <Button shape="circle" icon="eye" onClick={this.openArticleInWeb(item)} />
                            ]}>
                            {item.title}
                        </List.Item >
                    )}
                />
            </div>
        )
    }
}

export default Sider;
