const mobileIcon = document.querySelector('.mobile-icon');
const sidebar = document.querySelector('.sidebar');
const search = document.querySelector('.search');
const searchOpen = document.querySelector('.search-open');
const add = document.querySelector('.add');
const addOpen = document.querySelector('.add-open');
const remove = document.querySelector('.remove');
const removeOpen = document.querySelector('.remove-open');
const main = document.querySelector('.main');

// Sidebar functionality desktop + mobile

sidebar.addEventListener('click', () => {
    sidebar.classList.add('sidebar-open');
})

search.addEventListener('click', () => {
    searchOpen.classList.toggle('closed-sidebar');
})

add.addEventListener('click', () => {
    // sidebar.classList.add('add-open');
    addOpen.classList.toggle('closed-sidebar');
})

remove.addEventListener('click', () => {
    // sidebar.classList.add('remove-open');
    removeOpen.classList.toggle('closed-sidebar');
})

mobileIcon.addEventListener('click', () => {
    sidebar.classList.remove('sidebar-close-mobile');
})
    
main.addEventListener('click', () => {
    sidebar.classList.add('sidebar-close-mobile');
    sidebar.classList.remove('sidebar-open');
    searchOpen.classList.add('closed-sidebar');
    addOpen.classList.add('closed-sidebar');
    removeOpen.classList.add('closed-sidebar');
})

// Adding card elements and info from database

const grid = document.querySelector('.grid');

let titleArr = [];
let authorArr = [];
let dateArr = [];
let card;


const addIcon = () => {
    let icon = document.createElement('i')
    icon.classList.add('material-icons-outlined');
    icon.classList.add('icon');
    icon.textContent = 'thumb_up';
    card.appendChild(icon);
}

const addButton = () => {
    let buttonDiv = document.createElement('div');
    let yesButton = document.createElement('button');
    let noButton = document.createElement('button');
    buttonDiv.classList.add('toggle-button');
    card.appendChild(buttonDiv);
    buttonDiv.appendChild(yesButton);
    buttonDiv.appendChild(noButton);
    yesButton.classList.add('toggle-on');
    yesButton.classList.add('left-button');
    noButton.classList.add('right-button');
    yesButton.textContent = 'Have read';
    noButton.textContent = 'Want to read';
}

// Loading animation

const loading = document.querySelector('#loading');

function displayLoading() {
    loading.classList.add('display');

    setTimeout(() => {
        loading.classList.remove('display');
    }, 5000);
}

function hideLoading() {
    loading.classList.remove('display');
}

// Fetch database

function fetchHandler() {
    displayLoading();

    fetch('https://my-bookshelf-backend.herokuapp.com/')
    .then(response => response.json())
    .then(data => { 
        hideLoading();

        data.values.forEach(item => titleArr.push(item[0]));
        titleArr.shift(0);
        data.values.forEach(item => authorArr.push(item[1]));
        authorArr.shift(0);
        data.values.forEach(item => dateArr.push(item[2]));
        dateArr.shift(0);

        for (item in titleArr){
            card = document.createElement('article');
            card.classList.add('.card');
            grid.appendChild(card);

            let title = document.createElement('h3');
            card.appendChild(title);
            title.textContent = titleArr[item];

            let author = document.createElement('p');
            card.appendChild(author);
            author.textContent = authorArr[item];

            let date = document.createElement('p');
            card.appendChild(date);
            date.textContent = dateArr[item];

            addIcon()
            addButton()
    
        }
        
    })
    .catch(e => console.log(e))
}

fetchHandler();