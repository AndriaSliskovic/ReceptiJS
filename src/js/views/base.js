//Eksportovanje elemenata DOMa
export const elements={
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}
//Eksportovanje stringa u okviru elementa (css fajl), kako se ne bi hardkodovalo
export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

//loader metod za ukidanje beskonacnog rotiranja
export const clearLoader = () => {
    //mora postojati loader da bi se ukinuo
    const loader = document.querySelector(`.${elementStrings.loader}`);
    //Ide se u paren element i onda se uklanja njegovo dete
    if (loader) loader.parentElement.removeChild(loader);
};

