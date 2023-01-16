const mobileIcon = document.querySelector('.mobile-icon');
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('.main');
const iconDesc = document.querySelectorAll('.icon-desc');
const icons = document.querySelectorAll('.side-icon');
const displays = document.querySelectorAll('.display');
const sidebarArrow = document.querySelectorAll('#sidebar-arrow');

// Sidebar functionality desktop + mobile

sidebar.addEventListener('mouseover', () => {
    sidebar.classList.add('sidebar-open');
    sidebarArrow.forEach(arrow => arrow.style.display = 'inline-block');
})

icons.forEach((icon, i) => {
    icon.addEventListener('click', () => {
        displays[i].classList.toggle('closed-sidebar');
        sidebarArrow[i].classList.toggle('sidebar-arrow-rotate');
    })
})

mobileIcon.addEventListener('click', () => {
    sidebar.classList.remove('sidebar-close-mobile');
    sidebarArrow.forEach(arrow => arrow.style.display = 'inline-block');
})
    
main.addEventListener('click', () => {
    sidebar.classList.add('sidebar-close-mobile');
    sidebar.classList.remove('sidebar-open');
    displays.forEach(item => item.classList.add('closed-sidebar'));
    iconDesc.forEach(item => item.style.transition = 'none');
    sidebarArrow.forEach(arrow => arrow.classList.remove('sidebar-arrow-rotate'));
    sidebarArrow.forEach(arrow => arrow.style.display = 'none');
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

// Create book cards

const grid = document.querySelector('.grid');

function displayBooks(books) {
    const htmlString = books.map(book => {
        return `
        <article class="card">
            <h3 id="title">${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.date}
            ${showRating(book)}</p>
            <div class="toggle-button">
                ${showHaveRead(book)}
            </div>
        </article>
        `;
    }).join('');

    grid.innerHTML = htmlString;
}

// Display rating on book cards

const showRating = (book) => {
    if (book.rating === '3') {
        return `<i class="material-icons-outlined icon">thumb_up</i>`
    } else if (book.rating === '2') {
        return `<i class="material-icons-outlined icon thumb-mid">thumb_up</i>`
    } else if (book.rating === '1') {
        return `<i class="material-icons-outlined icon">thumb_down</i>`
    } else return `<i class="material-icons-outlined icon thumb-hidden">thumb_up</i>`
}

// Display purple read button on book cards

const showHaveRead = (book) => {
    if (book.read === 'yes') {
        return `<button>Want to read</button><button class="toggle-on">Have read</button>`
    } else return `<button class="toggle-on">Want to read</button><button>Have read</button>`
}


// Fetch database

function fetchHandler() {
    displayLoading();

    fetch('https://my-bookshelf-backend.herokuapp.com/')
    .then(response => response.json())
    .then(data => { 

        bookData = data.values.map((item) => ({ 
            title: item[0], 
            author: item[1] || '', 
            date: item[2] || '',
            read: item[3],
            rating: item[4] || '',
            pages: item[5]
        }));

        //remove first row from spreadsheet
        bookData.shift();

        hideLoading();
        displayBooks(bookData);
        bookOptions();    
    })
    .catch(e => console.error(e))
}

fetchHandler();


// Add title and author filter for search section

const searchInput = document.querySelector('.search-input');

function filterResults(e) {
    let updateInput = e.target.value.toLowerCase();

    let filteredArr = bookData.filter(book => {
        return book.title.toLowerCase().includes(updateInput) || book.author.toLowerCase().includes(updateInput)
    })
    
    displayBooks(filteredArr);
}

searchInput.addEventListener('keyup', filterResults);


// Populate dropdown list in remove section

const titleDropdown = document.querySelector('.form-select');

const bookOptions = () => {
    const optionsList = bookData.map(book => {
        return `<option value=${book.title}>${book.title}</option>`
    })

    titleDropdown.innerHTML = optionsList;
}

// Show challenge display on sidebar

let goalPages = 10000;
let challengeYear = (new Date).getFullYear().toString();
let challengeYearTotalPages = 0;

let percentDisplay = (6258 / goalPages) * 100;
let root = document.documentElement;
root.style.setProperty('--challenge-percent', percentDisplay + '%');

const challengeText = document.querySelector('.challenge-text');

function displayChallengeText(currentPages, goalPages) {
    if (currentPages > goalPages) {
        return `You've reached your goal! ${currentPages.toLocaleString("en-US")} pages!`
    } else {
        return `You've read ${currentPages.toLocaleString("en-US")} of your ${goalPages.toLocaleString("en-US")} page goal. Keep going!`
    }
}
challengeText.innerHTML = displayChallengeText(6258, goalPages);