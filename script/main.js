//меню
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

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


//переключение картинок карточек
document.querySelectorAll('.tv-card__img').forEach((card)=>{
    let src = card.src;
    card.addEventListener('mouseenter', () => {           
        card.src = card.getAttribute('data-backdrop');
    });
    card.addEventListener('mouseleave',() => {card.src = src});
});