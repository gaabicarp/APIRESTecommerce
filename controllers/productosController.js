var fs = require('fs');
var bd = JSON.parse(fs.readFileSync('db.json'))
var data = bd.products;


//DECLARACION DE FUNCIONES


//ORDENA ARRAY
const ordenar = (data, param) =>{
    return data.sort(function(prev, next){
        if (param=="expensive"){
            return next.price - prev.price;
        } else{
            return prev.price -next.price;
        }
            
    })
};

//Se pasa por parametro la cantidad de productos que compró y se genera un número aleatorio. Si coincide con el número 14 Gana.
const sorteo = (cant) =>{
    let prob = 30 - cant*3;
    prob<0 ? prob=0 : null
    const nr1 = parseInt(Math.random()*(20+prob));
    const nr2 = 14;
    return nr1 === nr2 ? "GANASTE" : "SEGUI INTENTANDO";
}

//Función para reescribir la base de datos
const writef = (bd, data) =>{
    bd.products = data;
    fs.writeFile('db.json', JSON.stringify(bd, null, 2), function (err) {
        if (err) return console.log(err);
    });
}

//Cuenta la cantidad de productos de un mismo tipo
const count = (data, elem) =>{
    return data.filter(function(dato){
        return dato.type == elem;
    })}

//Borra repetidos del array 
Array.prototype.unique=function(a){
    return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
  });



//CONTROLLER

const productosController = {
    expensive: async(req,res)=>{
        try{
            const max = ordenar(data, "expensive")
            res.json({respuesta: max[0]}).status(200);
        }catch(error){
            res.send(error).status(500);
        }
    },
    cheaper: async(req,res) =>{
        try{
            const min = ordenar(data, "cheap").slice(0, 5)
            console.log(min)
            res.json({respuesta: min}).status(200)
        }catch(error){
            res.send(error).status(500)
        }
    },
    type: async(req,res)=>{
        try{
            var type = data.map((dat, index, array) => {
            return dat.type ? dat.type : "Without category";
            });
            type = type.unique();
            var resp = type.map(elem =>{
                var aux = count(data, elem)
                return ({type: elem,
                        value: aux.length});
            })
            res.json({respuesta: resp}.status(200))
    }catch(error){
        res.send(error).status(500)
    }
    },
    name: async(req,res)=>{
        try{        
            let productRequested = req.params.name;
            console.log(productRequested)
            const resp = data.filter(prod =>{
                return prod.title == productRequested
            })
            resp.length !=0 ? res.json({respuesta: resp}).status(200) : res.send("Producto Not Found").status(204)
            
        }catch(error){
            res.send(error).status(500)
        }

    },
    buy: async(req,res)=>{
        try{
            let productRequested = req.params.name;
            let cant = req.body.cant;
            var indexOfprod = data.findIndex(prod => prod.title === productRequested);
            if(cant>0){
            if(data[indexOfprod].stock - cant >=0){
                //sorteo
                const premio = data[indexOfprod].stock > 3 ? sorteo(cant) : null;
                //recomendaciones
                const recomen = data.filter(prod =>{
                    return prod.type == data[indexOfprod].type
                })
                //guarda stock nuevo
                data[indexOfprod].stock = data[indexOfprod].stock - cant;
                res.json({respuesta: data[indexOfprod], sorteo: premio, recomendaciones: recomen })
                writef(bd, data);
                
            }else{
                res.send("No hay stock suficiente").status(400)
            }
            }else{
                res.send("Bad Request").status(400)
            }
        }catch(error){
            res.send(error).status(500)
        }
        
        
    },
    create: async (req, res) =>{
        try{        
            const newprod = {
            title: req.body.title,
            type: req.body.type,
            price: req.body.price,
            stock: req.body.stock
        }
        data.push(newprod)
        writef(bd, data)
        res.status(201)
    }catch(error){
        res.send(error).status(500)
    }

    }
}


module.exports = productosController;