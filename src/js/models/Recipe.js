import axios from 'axios';
import Config from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    //Metod za dohvatanje odredjenog recepta po IDu
    async getRecipe() {
        const config=new Config();
        try {
            //Smestanje svih dobijenih podataka u jednu promenljivu
            const res = await axios(`${config.proxy}http://food2fork.com/api/get?key=${config.key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('Podaci nisu isporuceni sa APIja :(');
        }
    }
    //Izracunavanje vremena koje je potrebno da se svaki sastojak spremi, uzeto je 15 min za svaki od 3 sastojka
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    //Broj osoba za koje se sprema obrok je 4
    calcServings() {
        this.servings = 4;
    }

    //Metod za sredjivanje sastojaka - rad sa stringovima i nizovima
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        //Dodavanje na prethodni niz, destructuring
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients=this.ingredients.map(el=>{

//1. Unificiranje jedinica za meru
        let ingredient=el.toLowerCase();
//Prolazak kroz niz unitsLong, gde je unit trenutni clan niza unitsLong i menjanje njega sa clanom niza unitsShort koji ima isti index
        unitsLong.forEach((unit,i)=>{
            ingredient=ingredient.replace(unit,unitsShort[i]);
            //Potrebno je da se nizovi podudaraju
        });

//2. Uklanjanje zagrada i svega sto je u njima - regularni izrazi
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
        
//3. Parsiranje sastojaka - sredjivanje niza sa razlicitom vrstom podataka
        //Pretvaranje svake reci u poseban element
        const arrIng = ingredient.split(' ');
        //Pronalazenje indexa gde je postvaljena jedinica za kolicinu
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        //vraca true ili false ako trenutni element zadovoljava kriterijum
        //Radi kao forEach - prolazi kroz niz
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2))
//Ispitivanje da li niz sadrzi odredjeni clan i vraca vrednost njegovog indexa
        let objIng;
        if (unitIndex > -1) {
            //Postoji jedinica za kolicinu
            // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
            // Ex. 4 cups, arrCount is [4]
            const arrCount = arrIng.slice(0, unitIndex);
            
            let count;
            if (arrCount.length === 1) {

                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }
            //Setovanje objekta prvog clana niza, utvrdjivanje da li je broj, jedinica ili naziv sastojka
            //Objekat koji definise koji je tip prvi clan niza
            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            };

        } else if (parseInt(arrIng[0], 10)) {
            //Nema jedinice kol. , ali je prvi element broj
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if (unitIndex === -1) {
            //Nema jedinice kol. i nema boja
            objIng = {
                count: 1,
                unit: '',
                ingredient:ingredient
            }
        }
        return objIng;
        });
        //Ovaj niz menja originalni ingridian
        this.ingredients=newIngredients;
    }
    //Dodavanje broja osoba za odredjeni recept
    updateServings (type) {
        //type je povecanje (increase) ili smanjenje (decrease)
        // Broj osoba
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Sastojci -prolazi kroz niz i proporcionalno uvecava
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
            //ing.count=ing.count*(newServings / this.servings) - duza varijanta
        });
        //Setovanje nove vrednosti za br. osoba
        this.servings = newServings;
    }
}    