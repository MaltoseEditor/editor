import axios from 'axios';

axios.defaults.withCredentials = true;

var URL = {
    'article': '/api/article/',
    'tag': '/api/tag/',
    'corpus': '/api/corpus/',
    'reference': '/api/reference/',
    'image': '/api/image/',
    'render': '/api/render/',
}

const ap = axios.create({
    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken',
})

export const getRender = (data) => {
    return ap.post(URL['render'], {"source": data})
}

export const push = () => {
    return axios.get('/push');
}

export const getAllArticle = () => {
    return axios.get(URL['article']);
}

export const newArticle = (data) => {
    return ap.post(URL['article'], data)
}

export const alterArticle = (id, data) => {
    return ap.patch(URL['article'] + "?id=" + id, data)
}

export const getArticle = (id) => {
    return axios.get(URL['article'] + "?id=" + id)
}

export const newImage = (article_id, image) => {
    let data = new FormData();
    data.append('file', image);
    data.append('article', article_id);
    return ap.post(URL['image'], data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const delImage = (image_id) => {
    return ap.delete(URL['image'] + '?id=' + image_id)
}

export const getAllTag = () => {
    return axios.get(URL['tag']);
}

export const newTag = (data) => {
    return ap.post(URL['tag'], data);
}

export const getAllCorpus = () => {
    return axios.get(URL['corpus']);
}

export const newCorpus = (data) => {
    return ap.post(URL['corpus'], data);
}
