const mainContainer = document.getElementById('main-container-row');
const pagination = document.getElementsByClassName('pagination')[0];
const photosUrl = 'https://jsonplaceholder.typicode.com/photos';
const usersUrl = 'https://jsonplaceholder.typicode.com/users';

function createUsersSelect(users) {
    select = document.getElementsByTagName('select')[0];
    for (let user of users) {
        option = document.createElement('option');
        text = document.createTextNode(user.name);
        option.appendChild(text);
        option.value = user.id;
        select.appendChild(option);
    }
}
function createArticle(title, body, photos) {
    //creating the containing div
    div = document.createElement('div');
    div.classList.add('col-12');
    div.classList.add('col-md-6');
    div.classList.add('mb-3');

    //creating the article
    article = document.createElement('article');
    article.classList.add('p-3');
    article.classList.add('rounded');

    //creating article header
    header = document.createElement('header');
    h3 = document.createElement('h3');
    textH3 = document.createTextNode(title);
    h3.appendChild(textH3);
    header.appendChild(h3);

    //creating article content
    content = document.createElement('div');
    content.classList.add("content");
    for (p of body) {
        contentText = document.createTextNode(p);
        content.appendChild(contentText);
        content.appendChild(document.createElement('br'));
    }

    //creating figures content
    figures = document.createElement('div');
    figures.classList.add("figures");
    figures.classList.add("mt-3");
    row = document.createElement('div');
    row.classList.add('row');
    for (let k = 0; k < 3; k++) {
        figure = document.createElement('figure');
        figure.classList.add('col-4');
        figure.classList.add('figure');
        a = document.createElement('a');
        a.href = photos[k].url;
        img = document.createElement('img');
        img.src = photos[k].thumbnailUrl;
        img.title = 'ceva';
        img.classList.add('figure-img');
        img.classList.add('img-fluid');
        img.classList.add('rounded');
        a.appendChild(img);
        figcaption = document.createElement('figcaption');
        figcaption.classList.add("figure-caption");
        figcaptionText = document.createTextNode(photos[k].title);
        figcaption.appendChild(figcaptionText);
        figure.appendChild(a);
        figure.appendChild(figcaption);
        row.appendChild(figure);
    }
    figures.appendChild(row);

    //putting them together
    article.appendChild(header);
    article.appendChild(content);
    article.appendChild(figures);

    div.appendChild(article);
    return div;
}
function deleteArticles() {
    mainContainer.innerHTML = '';
}
function replaceBodyBr(body) {
    body = body.split('\n');
    return body;
}
//creating articles with coresponding images
function getArticles(userId = null, page = null, pageLimit = null) {
    console.log('called', userId, page, pageLimit);
    let articleUrl = `https://jsonplaceholder.typicode.com/posts`;
    if (userId != null) {
        articleUrl = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;
    }
    if (page != null && pageLimit != null) {
        //includem paginare in request
        articleUrl = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageLimit}`;
    }
    fetch(articleUrl).then((resp) => {
        return resp.json();
    }).then((body) => {
        for (let i = 0; i < body.length; i++) {
            fetch(`https://jsonplaceholder.typicode.com/albums/${body[i].id}/photos`)
                .then((resp) => {
                    return resp.json();
                }).then((photos) => {
                    let div = createArticle(body[i].title, replaceBodyBr(body[i].body), photos);
                    mainContainer.appendChild(div);
                });
        }
    });
}
//loading users into select
function getUsers() {
    fetch(usersUrl)
        .then((resp) => { return resp.json() })
        .then((users) => {
            createUsersSelect(users)
        })
}
function addArticle() {
    let title = document.getElementById('inputTitle').value;
    let body = document.getElementById('inputBody').value;
    let photosFake = [
        {
            "albumId": 2,
            "id": 51,
            "title": "non sunt voluptatem placeat consequuntur rem incidunt",
            "url": "https://via.placeholder.com/600/8e973b",
            "thumbnailUrl": "https://via.placeholder.com/150/8e973b"
        },
        {
            "albumId": 2,
            "id": 52,
            "title": "eveniet pariatur quia nobis reiciendis laboriosam ea",
            "url": "https://via.placeholder.com/600/121fa4",
            "thumbnailUrl": "https://via.placeholder.com/150/121fa4"
        },
        {
            "albumId": 2,
            "id": 53,
            "title": "soluta et harum aliquid officiis ab omnis consequatur",
            "url": "https://via.placeholder.com/600/6efc5f",
            "thumbnailUrl": "https://via.placeholder.com/150/6efc5f"
        }]
    console.log(title, body);
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            body: body,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            let div = createArticle(json.title, replaceBodyBr(json.body), photosFake);
            mainContainer.prepend(div);
        });
}
function deactivatePages() {
    let pageLinks = document.getElementsByClassName('page-link');
    for (a of pageLinks) {
        a.classList.remove('active');
    }
}
function activatePage(page) {
    let pageLinks = document.getElementsByClassName('page-link');
    pageLinks[page].classList.add('active');
}

// createArticle();
getArticles();
getUsers();

//filtering feature
form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', (e) => {
    deactivatePages();
    deleteArticles();
    getArticles(document.getElementsByTagName('select')[0].value);
    e.preventDefault();
});

//checking page number
var page = 1;
pagination.addEventListener('click', (e) => {
    e.preventDefault();
    //remove all active classes
    deactivatePages();
    let which = e.target.innerHTML;
    if (which === 'Next') {
        if (page <= 19) {
            page++;
        }
    } else
        if (which === 'Prev') {
            if (page >= 2) {
                page--;
            }
        } else {
            page = parseInt(e.target.innerHTML);
        }
    activatePage(page);
    document.getElementById('current-page').innerHTML = `Current page: ${page}`;
    deleteArticles();
    getArticles(null, page, 5);
});