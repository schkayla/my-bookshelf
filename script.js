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

// Variables

let titleArr = [];
let authorArr = [];
let dateArr = [];
let haveReadArr = [];
let ratingArr = [];
let pagesArr = [];
let bookData = {};

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
        data.values.forEach(i => pagesArr.push(i[5]));
        pagesArr.shift(0);

        bookData = titleArr.map((item, index) => ({ 
            title: item, 
            author: authorArr[index] || '', 
            date: dateArr[index] || '',
            rating: showRating(ratingArr)[index] || '',
            read: showHaveRead(haveReadArr)[index],
            pages: pagesArr[index]
        }));

        hideLoading();
        displayBooks(bookData);
        bookOptions(titleArr);
        // console.log(bookData.filter(el => el.date.slice(-2) === challengeYear.slice(-2)));

        const getChallengeYearTotalPages = (books) => {
            return books.forEach(book => {
                book.filter(el => {
                if (el.date.slice(-2) === challengeYear.slice(-2)) {
                    return el.pages
                }
            })
            
        })}
        console.log(getChallengeYearTotalPages(bookData))
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
    const optionsList = titleArr.map(title => {
        return `<option value=${title}>${title}</option>`
    })

    titleDropdown.innerHTML = optionsList;
}

// Show challenge display on sidebar

let goalPages = 10000;
let challengeYear = (new Date).getFullYear().toString();
let challengeYearTotalPages = 0;

// console.log(bookData.filter(el => el.date.slice(-2) === challengeYear.slice(-2)));
// console.log(bookData)

// function getChallengeYearTotalPages(books) {
//     return books.reduce(el => {
//         if (el.date.slice(-2) === challengeYear.slice(-2)) {
//             challengeYearTotalPages += el.pages
//         }
//     })


//     // let entries = Object.entries(bookData);
//     // for (const [key, value] of books) {
//     //     if (books.date.slice(-2) === challengeYear.slice(-2)) {
//     //         challengeYearTotalPages += value;
//     //     }
//     // }
//     // console.log(bookData.date)
//     // console.log(challengeYear)
//     // return challengeYearTotalPages;
// }

// console.log(getChallengeYearTotalPages(bookData))

// currentYearPagesArr = bookData.filter(el => bookData.date === challengeYear)

// console.log(currentYearPagesArr);

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