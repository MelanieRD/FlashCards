//-------------------------------- mi ultima API ------------------------------------------------
// ME FALTA EDITAR EL PUT Y YA TERMINO CON LA PARTE DE LA API
// TENGO QUE APRENDER CORS AHORA.

const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8081;

const fs = require("node:fs/promises");

const cargarJson = async () => {
  try {
    const flashCardsJson = await fs.readFile("flashcardsJSON.json", "utf-8"); //READ
    return JSON.parse(flashCardsJson);
  } catch (error) {
    console.log(`Error al leer el json`, error);
    return []; //Envie un array vacio para que no me grite feo en caso de que haya un error
  }
};

const guardarJson = async (dataflashcards) => {
  try {
    await fs.writeFile(
      "flashcardsJSON.json",
      JSON.stringify(dataflashcards, null, 2),
      "utf-8"
    ); // WRITE

    console.log(`Datos guardados correctamente, yayy!`);
  } catch (error) {
    console.log(`Error al guardar datos ${error}`);
  }
};

let flashcards = [];

cargarJson().then((dataflashcards) => {
  flashcards = dataflashcards;
});

app.use(express.json());
app.use(cors());

//all
app.get("/flashcards/all", (req, res) => {
  res.status(200).json(flashcards);
});

app.get("/flashcards/:id", (req, res) => {
  const flashcard = flashcards.find(
    (flashcard) => flashcard.id === parseInt(req.params.id)
  );
  if (!flashcard) {
    res
      .json({ error: `No se encuentra la flashcard con id: ${req.params.id} ` })
      .status(404);
  }
  res.json(flashcard);
});

app.post("/flashcards/:id", (req, res) => {
  const idFinal =
    flashcards.length > 0
      ? Math.max(...flashcards.map((flashcard) => flashcard.id))
      : 0;

  console.log(idFinal);

  const newFlashcard = {
    id: idFinal + 1,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    preguntas: req.body.preguntas.map((pregunta, index) => ({
      id: index + 1,
      pregunta: pregunta.pregunta,
      respuesta: pregunta.respuesta,
    })),
  };

  flashcards.push(newFlashcard);
  guardarJson(flashcards);
  res.status(201).json(newFlashcard);
});

// TENGO QUE MEJORAR MI PUT, PERO LO HARE DESPUES XD
app.put("/flashcards/:id", (req, res) => {
  const idFlashCard = parseInt(req.params.id);
  const flashcard = flashcards.findIndex(
    (flashcard) => flashcard.id === idFlashCard
  );
  let tituloF = flashcards[flashcard].titulo;
  let descripcionF = flashcards[flashcard].descripcion;

  if (flashcard !== -1) {
    if (req.body.titulo !== undefined) {
      tituloF = req.body.titulo;
    }

    if (req.body.descripcion !== undefined) {
      descripcionF = req.body.desarrollo;
    }

    flashcards[flashcard] = {
      id: idFlashCard,
      titulo: tituloF,
      descripcion: descripcionF,
    };
    return res.json(flashcards[flashcard]).status(201);
  }

  res.json(`No se encontro la flashcard id ${idFlashCard}`).status(404);
});

app.delete("/flashcards/:id", (req, res) => {
  const flashcard = flashcards.findIndex(
    (flashcard) => flashcard.id === parseInt(req.params.id)
  );
  if (flashcard === -1) {
    return res
      .json({
        error: `No se encuentra la flashcard con el id ${req.params.id}`,
      })
      .status(404);
  }

  flashcards.splice(flashcard, 1);
  guardarJson(flashcards);
  res
    .json(`La flashcard id: ${req.params.id} ha sido liminada con exito`)
    .status(201);
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

//-------------------------------- Desde aqui comienzan mis practicas con las APIS ------------------------------------------------

// const express = require('express');
// const app = express();
// const PORT = 3001;

// app.use(express.json());

// const data = [
//     {
//         id:1,
//         name:"Melanie"
//     },
//     {
//         id:2,
//         name:"Melanie"
//     },
//     {
//         id:3,
//         name:"Melanie"
//     }
// ];
// app.get('/api/all', (req, res)=>{

//     res.json(data).status(200);
// });

// app.get('/api/:id',(req, res)=>{
//     const dat = data.find(dat => dat.id === parseInt(req.params.id));
//     if(!dat){
//         return res.json(`El registro con ${dat} no existe`).status(404);
//     }
//     res.json(dat).status(200);
// });

// app.post('/api/:id', (req, res)=>{
//    const newDat = {
//         id: data.length+1,
//         nombre: req.body.name
//    };

//     data.push(newDat);

//     res.json(newDat).status(201);
// });

// app.delete('/api/:id', (req, res)=>{
// const id = parseInt(req.params.id);
// const dat = data.findIndex(dat => dat.id === id);

// if(dat !== -1){
//     data.splice(dat, 1);
//     return res.json(`Registro eliminado exitosamente`);
// }

// return res.json({error: `El registr con id ${id} no existe`}).status(404);

// });

// app.put('/api/:id', (req, res)=>{
//     const idparams = parseInt(req.params.id);
//     const datIndex = data.findIndex(dat => dat.id === idparams);

//     if(datIndex !== -1){
//     data[datIndex] = { id:idparams, name: req.body.name}
//     return res.json(data[datIndex]);
//     }

//     return res.json({error: `paciente con id ${idparams} no encontrado`});
// });

// app.listen(PORT, ()=>{

//     console.log(`Servidor corriendo en el puerto ${PORT}`);
// })

// const express = require('express');
// const app = express();
// const PORT = 3001;

// let flashcards = [
//     {
//         id:1,
//         titulo:"Api",
//         descripcion:"blablablabla",

//         cards: [
//             {
//                 id_card:"",
//                 front_card_text:"Que es un Api?",
//                 back_card_text:"Descripcion de que es un api y esas cosas"

//             },

//         ]
//     },

//     {
//         id:2,
//         titulo:"Api",
//         descripcion:"blablablabla",

//         cards: [
//             {
//                 id_card:"",
//                 front_card_text:"Que es un Api?",
//                 back_card_text:"Descripcion de que es un api y esas cosas"

//             },

//         ]
//     }
// ];

// //middleware
// app.use(express.json());

// app.get('/flashcards', (req, res)=>{
//  res.status(200).json(flashcards);
// });

// //get by id
// app.get('/flashcards/:id', (req, res)=>{
// const flashcard = flashcards.find(flashcard => flashcard.id ===  parseInt(req.params.id));

// if(!flashcard){
//     res.status(404).json("Flash card no encontrada");
// }

// res.status(201).json(flashcard);

// app.post('flashcards/:id', (req, res)=>{

//     newFlashcard = {
//         id: req.body.id,
//         titulo: req.body.titulo,
//         descripcion: req.body.descripcion
//     };

//     flashcards.push(newFlashcard);
//     res.status(201).json(newFlashcard);
// });

// });

// app.listen(PORT, ()=>{
//     console.log(`server corriendo en ${PORT}`);
// });

// const express = require('express');
// const app = express();
// const PORT = 3001;

// //middleWare
// app.use(express.json());

// let data=[

//     {
//         id:1,
//         nombre:"Melanie",
//         apellido:"HM"
//     },
//     {
//         id:2,
//         nombre:"Melanie",
//         apellido:"HM"
//     },
//     {
//         id:3,
//         nombre:"Melanie",
//         apellido:"HM"
//     }

// ];
// app.get("/api", (req, res)=>{

//     return res.json(data).status(200);
// });

// app.get('/api/:id', (req, res)=>{
// const id = parseInt(req.params.id);
// const dat = data.find(dat => dat.id === id);

// if(!dat){
//     return res.status(404).json({error:"dat no encontrado"});
// }

// res.json(dat);

// });

// app.listen(PORT, ()=>{
//     console.log(`Puerto abierto en ${PORT}`);
// });

//nodemon api.js

// const express = require('express');

// const app = express();
// const PORT = 3001;

// app.use(express.json());

// let data = [

//     {
//         id:1,
//         name:"Melanie"

//     }
// ];

// app.get('/api', (req, res)=>{
// return res.json(data).status(200);
// });

// app.listen(PORT, ()=>{
//     console.log(`Puerto abierto en ${PORT} gg`);
// });

// //IMPORTAR EXPRESS EN MI PROYECTO
// const express = require('express');

// //Constante que utilizare que tiene  mi modulo express();
// const app = express();

// //puerto
// const PORT = 3001;

// let data = [
//     {
//         id:1,
//         nombre:"Melanie"
//     }
// ];

// //Aqui coloco el middleware que necesito para que me reconozca los cuerpos json y de esta manera poder utilizar el re.body
// // Ahora, cada vez que reciba una solicitud con un cuerpo JSON, Express lo convertirá automáticamente en un objeto JavaScript accesible a través de req.body utilizando este middleware
// app.use(express.json());

// app.get('/api', (req, res)=>{

//     res.json(data).status(200);
// });

// app.listen(PORT, ()=>{

//     console.log(`Puero abierto en ${PORT}`)
// });

// const express = require('express');
// const app = express();
// const PORT = 3001;

// let items = [
//     {
//         id:0,
//         nombre:"Melanie",
//         apellido:"HM",
//         sueldo:"1,000,000 mensual"
//     }
// ]

// app.use(express.json());//middleware se ejecutara en cada solicitud, Analiza cuerpos json en solicitudes
// app.get('/api', (req, res)=>{

//   return  res.json(items).status(200);
// });

// app.listen(PORT,()=>{
//     console.log(`Puerto abierto en: ${PORT}`);
// });

// const express = require('express'); // importamos express a nuestro proyecto
// const app = express(); // Guardamos el modulo de express en esta variable (la estamos instanciando)

// let datos = [
//     {
//         id:1,
//         titulo:"Apis",
//         cuerpo:"Lorem impsu",

//         contenido:[
//             {
//         enunciadoId: 1 ,
//         enunciadoTexto:"¿Que es un api?",
//         desarrollo:"Blablablabla"
//        }  ],

//     },

//     {
//         id:2,
//         titulo:"Apis - 2",
//         cuerpo:"Lorem impsu",

//         contenido:[
//             {
//         enunciadoId: 1 ,
//         enunciadoTexto:"Comandos Apis",
//         desarrollo:"Blablablabla"
//        }  ],

//     }

// ];

// app.use(express.json());
// const PORT = 3001;

// app.get('/api/flashCards', (req, res)=>{
//  res.json(datos);

// });

// app.listen(PORT, ()=>{console.log(`Servidor realizado en el puerto ${PORT}`)})

/** 
 * 
 * (req, res) => { ... }: Este es un controlador de ruta, una función que se ejecuta cuando alguien accede a la ruta '/'. Toma dos parámetros:

req: Representa la solicitud HTTP y contiene datos sobre lo que el cliente está solicitando.
res: Representa la respuesta HTTP que enviarás de vuelta al cliente.
 

app.listen(port, ...): Esta función inicia el servidor y lo hace escuchar en el puerto que definiste anteriormente (port = 3000).

port: Aquí le pasas el puerto en el que quieres que el servidor escuche.

() => { ... }: Este es un callback que se ejecuta una vez que el servidor comienza a escuchar. En este caso, estás utilizando console.log para imprimir un mensaje en la consola indicando que la aplicación está corriendo y en qué puerto está escuchando.

*/
