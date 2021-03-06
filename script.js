const mobileIcon = document.querySelector('.mobile-icon');
const sidebar = document.querySelector('.sidebar');
const search = document.querySelector('.search');
const searchOpen = document.querySelector('.search-open');
const add = document.querySelector('.add');
const addOpen = document.querySelector('.add-open');
const remove = document.querySelector('.remove');
const removeOpen = document.querySelector('.remove-open');
const main = document.querySelector('.main');

// const sideIcon = document.querySelector('.side-icon');

// Sidebar functionality desktop + mobile

sidebar.addEventListener('click', () => {
    sidebar.classList.add('sidebar-open');
})

// sideIcon.addEventListener('click', (e) => {
//     e.classList.toggle('closed-sidebar');
// }) select diff opens with one click event

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



// Loading animation

const loading = document.querySelector('#loading');

function displayLoading() {
    loading.classList.add('display');

    setTimeout(() => {
        loading.classList.remove('display');
    }, 50000);
}

function hideLoading() {
    loading.classList.remove('display');
}

// Variables

let titleArr = [];
let authorArr = [];
let dateArr = [];
let haveReadArr = [];
let ratingArr = [];
let dataObject = {};

// Create book cards

const grid = document.querySelector('.grid');

function displayBooks(books) {
    const htmlString = books.map(book => {
        return `
        <article class="card">
            <h3 id="title">${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.date}<i   class="material-icons-outlined icon ${book.rating}">thumb_up</i></p>
            <div class="toggle-button">
                ${book.read}
            </div>
        </article>
        `;
    }).join('');

    grid.innerHTML = htmlString;
}

// Display rating on book cards

const showRating = () => {
    return ratingArr.map(rating => {
        return rating === '3' ? 'thumb'
             : rating === '2' ? `thumb-mid`
             : rating === '1' ? `thumb-down`
             : 'thumb-hidden';
    })
}

// Display purple read button on book cards

const showHaveRead = () => {
    return haveReadArr.map(index => {
        if (index === 'yes') {
            return `<button>Want to read</button><button class="toggle-on">Have read</button>`
        } else return `<button class="toggle-on">Want to read</button><button>Have read</button>`
    })
}

// Fetch database

function fetchHandler() {
    displayLoading();

    fetch('https://my-bookshelf-backend.herokuapp.com/')
    .then(response => response.json())
    .then(data => { 
        
        data.values.forEach(i => titleArr.push(i[0]));
        titleArr.shift(0);
        data.values.forEach(i => authorArr.push(i[1]));
        authorArr.shift(0);
        data.values.forEach(i => dateArr.push(i[2]));
        dateArr.shift(0);
        data.values.forEach(i => haveReadArr.push(i[3]));
        haveReadArr.shift(0);
        data.values.forEach(i => ratingArr.push(i[4]));
        ratingArr.shift(0);

        dataObject = titleArr.map((item, index) => ({ 
            title: item, 
            author: authorArr[index] || '', 
            date: dateArr[index] || '',
            rating: showRating(ratingArr)[index] || '',
            read: showHaveRead(haveReadArr)[index]
        }));

        hideLoading();
        displayBooks(dataObject);
        bookOptions(titleArr);
      
    })
    .catch(e => console.error(e))
}

fetchHandler();


// Add title and author filter for search section

const searchInput = document.querySelector('.search-input');

function filterResults(e) {
    let updateInput = e.target.value.toLowerCase();

    let filteredArr = dataObject.filter(book => {
        return book.title.toLowerCase().includes(updateInput) || book.author.toLowerCase().includes(updateInput)
    })
    
    displayBooks(filteredArr);
}

searchInput.addEventListener('keyup', filterResults);


// Populate dropdown list in remove section

const titleDropdown = document.querySelector('.form-select');

const bookOptions = () => {
    const optionsList = titleArr.map(title => {
        return `<option value=${title}>${title}</option>`
    })

    titleDropdown.innerHTML = optionsList;
}

