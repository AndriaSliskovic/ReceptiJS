//Nacin definisanja pivatnih propertija
//Problem je sto se key vidi kroz request, data.config.url
//Bolje resenje je podatke smestiti na svoj server pa putem ajaxa pristupiti njima !!!
const _proxy = new WeakMap();
const _key = new WeakMap();

export default class Config{
    constructor(){
        _proxy.set(this,'https://cors-anywhere.herokuapp.com/');
        _key.set(this,'462b1cc8d4f2730081462fbc65136320')
    }

    get key(){
        return _key.get(this);
    }

    get proxy(){
        return _proxy.get(this);
    }

    //Setovanje privatnih propertija
    set key(value){
        _key.set(this,value);
    }
}