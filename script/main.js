const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader = document.querySelector('.preloader');
const imageContent = document.querySelector('.image__content');

const loading = document.createElement('div');
loading.className = 'loading';


const DBService = class {
    constructor(API_KEY,SERVER) {
        this.API_KEY = 'a63a6f7d2fbae0da1e7f7325031c30ac';
        this.SERVER = 'https://api.themoviedb.org/3';
    }
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        };        
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => this
        .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);
    

    getTvShow = id => this
    .getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    
};

//генерируем карточки
const renderCard = response => {    
    tvShowsList.textContent = '';    
    if (response.total_results) {   
        tvShowsList.classList.remove('search__none');   
        response.results.forEach(item => {
            const  { 
                backdrop_path:backdrop, 
                name : title, 
                poster_path : poster, 
                vote_average : vote,
                id
            } = item;

            const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropImg = backdrop ? IMG_URL + backdrop : '';
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
            const card = document.createElement('li');    

            card.className = 'tv-shows__item';
            card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                            ${voteElem}
                            <img class="tv-card__img"
                                 src="${posterImg}"
                                 data-backdrop="${backdropImg}"
                                 alt="${title}">
                            <h4 class="tv-card__head">${title}</h4>
                        </a>
            `;
            loading.remove();
            tvShowsList.append(card);

        })} else {
            const errCard = document.createElement('p');
            errCard.className = 'description';
            loading.remove();            
            errCard.textContent = `Фильмов с таким названием не найдено. Попробуйте изменить запрос.`;
            tvShowsList.append(errCard);
            tvShowsList.classList.add('search__none');
    }
};

// реализуем поиск
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    searchFormInput.value = '';
    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
});

//открытие/закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    };
});

// открытие модального окна

tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target,
    card = target.closest('.tv-card');
    preloader.style.display = 'block';
    if (card) {
        new DBService().getTvShow(card.id)
            .then(({ 
                poster_path : posterPath,
                name : title,
                vote_average : voteAverage,
                genres,
                overview,
                homepage
            }) => {
                if (posterPath) {
                    imageContent.style.visibility = 'visible';
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                } else {
                    imageContent.style.visibility = 'hidden';
                };                
                modalTitle.textContent = title;
                genresList.textContent = '';
                for (const item of genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                };                
                rating.textContent  = voteAverage;
                description.textContent  = overview;
                modalLink.href = homepage;                
            })
            .then(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            });

        
    }
});

//закрытие

modal.addEventListener('click', evet => {
    const target = event.target;    
    if ((target.closest('.cross'))||
        (target.classList.contains('modal'))) {
            document.body.style.overflow = '';
            modal.classList.add('hide');
    }
});

//переключение картинок карточек
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');            
        if (img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] =
            [img.src, img.dataset.backdrop];
        }
            
    }

};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);