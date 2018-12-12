// Global app controller
//API key   d9a6413c98c9383e020259bd1d483b25
//http://food2fork.com/api/search

import Search from './models/Search';
//Ucitavanje svega iz searc Viewa
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView'; 
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

//Globalni state cele aplikacije -svi ostali se stavljaju u njega
const state={};

/*
Potrebni state za sledece modele
-Search objekat
-Trenutni recipe objekat
-Shoping list objekat
-Liked objekat
*/

//SEARCH CONTROLLER
const controlSearch=async ()=>{
    // 1. Dobijanje promenljive query iz viewa kao rezultat onoga sto je upisano u search
    const query=searchView.getInput();
//TESTIRANJE
//const query='sarma';
    
    if(query){
        //Pravljenje search objekat i setovanje state.search objekta
        state.search=new Search(query);


        //Pripremanje prikazanih rezultata
        searchView.clearInput();

        //Brisanje prethodnih rezultata
        searchView.clearResults();

        //Renderovanje loadera
        renderLoader(elements.searchRes);
        try {
            //Pretraga recepata gore je instancirana klasa
        await state.search.getResults(); //Vraca Promis
        //Brisanje loadera kada se ucitaju rezultati
        clearLoader();
        //Prikazivanje rezultata (rezultati treba da budu ucitani zato ide await u Pretrazi)
        searchView.renderResults(state.search.result);
        } catch (error) {
            alert(error="Ne moze se pronaci trazeni proizvod !");
            clearLoader();
        }
        
    }

}

//TEST EVENT
// window.addEventListener('load',e=>{
//     e.preventDefault();
//     controlSearch();
// });

//Hvatanje dogadjaja pritiskom na dugme SEARCH - submit event
//Promenljiva je iz views/base.js
elements.searchForm.addEventListener('submit',e=>{
    //callBack funkcija
    //Da se ne bi reloudovala stranica
    e.preventDefault();
    //Pozivanje funkcije
    controlSearch();
});

//Hendlovanje klika na dugme za paginaciju
elements.searchResPages.addEventListener('click', e => {
    //closest metod- cita vrednosti susednih elemenata
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    const btn = e.target.closest('.btn-inline');
    //Da li postoji button za paginaciju -> da li ima potrebe za njom
    if (btn) {
        //Parsiranje broja koji je procitan iz atributa dataset.goto
        const goToPage = parseInt(btn.dataset.goto, 10);
        //prilikom pritiska na next treba obrisati prethodne rezultate
        searchView.clearResults();
        //Renderovanje rezultata posle klika na paginaciono dugme
        searchView.renderResults(state.search.result, goToPage);
    }
});

//RECEPIE CONTROLLER
const controlRecipe = async () => {
    // Uzimanje IDa iz url-a, uzimanje iz globalnog objekta
    const id = window.location.hash.replace("#","");
    //Ako id postoji
    if (id) {
        // Pripreme UI za promene
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Obelezavanje elementa, ako je doslo preko searcha
        if (state.search) searchView.highlightSelected(id);

        // Kreiranje novog objekta recipe
        state.recipe = new Recipe(id);

        //TEST
//window.r=state.recipe;

        try {
            //Uzimanje podataka od modela, ovde ceka da se ucitaju podaci
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //Izracunavanje vremena serviranja
        state.recipe.calcTime();
        state.recipe.calcServings();

        clearLoader();
        recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        
        } catch (error) {
            alert(error="Ne moze se ucitati trazeni proizvod !");
        }
    }
}

//POJEDINACNO POZIVANJE EVENTa
// //pozivanje dogadjaja kada se klikne na odredjeni proizvod
// window.addEventListener("hashchange",controlRecipe);
// //Dodavanje dogadjaja na reload stranice
// window.addEventListener("load",controlRecipe);
//Dinamicko pozivanje vise evenListenera, pravi se niz COOL
//Pokusati sa SPREADOM
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    //Kreiranje objekta ako vec ne postoji
    if (!state.list) state.list = new List();

    // Dodaj sastojke u listu
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handlovanje updatea i deleta na shoping listi
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    //Id prikazanog proizvoda
    const currentID = state.recipe.id;

    //User NIJE lajkovo proizvod
    if (!state.likes.isLiked(currentID)) {
        //Dodaj like u state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Promeni izgled buttona - tooggle
        //ako je lajkovan salje true
        likesView.toggleLikeBtn(true);

        //Dodaj like u listu
        likesView.renderLike(newLike);

    //User JE lakovao proizvod
    } else {
        //Ukloni like iz statea
        state.likes.deleteLike(currentID);

        //Promeni izgled buttona - tooggle
        likesView.toggleLikeBtn(false);

        // Ukloni sa liste lajkova
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handlovanje klika na recepte + ili -
elements.recipe.addEventListener('click', e => {
    //ne moze closest jer ima vise elemenata sa razlicitom funkcionalnoscu
    //Button se trazi  po klasi (* znaci i svako njegovo dete)
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Kliknut je Decrease button
        //Samo ako je broj osoba >1
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Kliknut je Increase button
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

