import {elements} from './base';
//Vracane vrednosti koja je uneta u input
export const getInput=()=>{return elements.searchInput.value};

//Brise polje za pretragu
export const clearInput=()=>{
    elements.searchInput.value='';
}

//Brise rezultate prthodne pretrage
export const clearResults=()=>{
    //Upisati nista i na taj nacin obrisati
    elements.searchResList.innerHTML='';
    //Brisanje rezultata pri paginaciji
    elements.searchResPages.innerHTML = '';
};

//Metod kako bi element u SideBaru bi selektovan za onaj proizvod koji je izabran u caontent delu
export const highlightSelected = id => {
    //ES6 fja 
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    //ukida selektovanje prethodno kliknutih
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
        //Dodavanje klase link-active
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};


//Sredjivanje teksta u naslovu dobijenih rezultata, default value
export const limitRecipeTitle=(title,limit=17)=>{
    const newTitle = [];
    if (title.length > limit) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

//Ovde se vrsi upisivanje recepata
const renderRecipe=recipe=>{
    //Renderovanje HTML koda
    const markup=`
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
    `;
    //Ubacivanje celog bloka HTML koda na odredjeno mesto
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//Funkcija za pravljenje buttona, vraca samo jednu vrednost template
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <!-- Ternarni operator za paginaciju-->
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

//Ispisivanje buttona paginacije
const renderButtons = (page, numResults, resPerPage) => {
    //izracunavanje broja stranica od datog rezultata
    //zaokruzivanje na veci ceo broj
    const pages = Math.ceil(numResults / resPerPage);

    //Definisan van bloka
    let button;
    //Ako ima vise od jedne stranice
    if (page === 1 && pages > 1) {
        // Prikazati samo dugme za sledecu stranicu - next
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Prikazati oba dugmeta
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Prikazati prev dugme
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
//Prikazivanje rezultata pretrage
// Paginacija,defaultne vrednosti su 1 i 10
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of currente page, kako bi se izbeglo hardkodovanje COOL
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    //slice metod u okviru forEacha
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    recipes.slice(start, end).forEach(renderRecipe);

    // renderovanje buttona paginacije
    renderButtons(page, recipes.length, resPerPage);
};

