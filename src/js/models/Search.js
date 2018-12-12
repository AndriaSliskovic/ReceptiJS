import axios from 'axios';
import Config from '../config';


export default class Search{
    //Prima parametar pretrage i pravi property za njega
    constructor (query){
        this.query=query;
    }
    //Metod za dohvatanje podataka
    async getResults(query) {
        const config=new Config();
        try{
            const res = await axios(`${config.proxy}http://food2fork.com/api/search?key=${config.key}&q=${this.query}`);
            //Vraca objekat result iz try
            this.result=res.data.recipes;
        }catch(error){
            alert(error);
        }
        
       
    }
}