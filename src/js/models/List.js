import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.items=[];
    }

    //Kreiranje proizvoda
    addItem(count, unit, ingredient) {
        const item = {
            //uniqid paket
            //Id mora biti jedinstven da bi se kasnije mogao brisati, menjati ...
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2] 
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8] - ne mutira originalni
        //Uklanja nadjeni element indexa
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        //pronalazi ceo element - radi kao findndex
        this.items.find(el => el.id === id).count = newCount;
        //Aplikacija dozvoljava samo menjanje kolicine count
    }
}