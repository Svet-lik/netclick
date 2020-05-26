const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'a63a6f7d2fbae0da1e7f7325031c30ac';


const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if(res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        };        
    }

    getTestData = () => {
        return this.getData('test.json')
    }
};

const renderCard = response => {
    //console.log(response);
    tvShowsList.textContent = '';
    response.results.forEach(item => {
        const  { 
            backdrop_path:backdrop, 
            name : title, 
            poster_path : poster, 
            vote_average : vote 
        } = item;

        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropImg = backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
        <a href="#" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                             src="${posterImg}"
                             data-backdrop="${backdropImg}"
                             alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
        `;
        tvShowsList.append(card);

        //console.log(card);
    });;
};

new DBService().getTestData().then(renderCard);



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
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    };
});

// открытие модального окна

tvShowsList.addEventListener('click', evet => {
    evet.preventDefault();
    const target = evet.target,
    card = target.closest('.tv-card');

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
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


/*мое решение

document.querySelectorAll('.tv-card__img').forEach((card)=>{
    let src = card.src;
    card.addEventListener('mouseenter', () => {           
        card.src = card.getAttribute('data-backdrop');
    });
    card.addEventListener('mouseleave',() => {card.src = src});
});*/