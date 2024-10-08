/* WAAAAAAAAARNING CODIGO ESPAGUETTI A CONTINUACION,
    NO ME HAGO RESPONSABLE DE QUE SE TE SALGAN LOS OJOS,
    LOS PROXIMOS SI LOS HARE DE MEJOR MANERA, E INTENTARE APLICAR
    LOS PRINCIPIOS DE PROGRAMACION Y BUENAS PRACTICAS, PARA ESO 
    ESTAMOS APRENDIENDO. GRACIAS!

    me servira esto de recuerdo jajajaj XD
*/

let flashcards = [];

//obteniendo data de flashcards para colocarlas en mi web UwU OwO
onload = async () => {
  try {
    flashcards = await cargarData(); // para esperar que el fetch se complete
  } catch (error) {
    console.error("error al cargar los datos");
  }
  vistaFlashcardsGeneral();
};

async function cargarData() {
  try {
    const respuesta = await fetch("http://localhost:8081/flashcards/all");

    if (!respuesta.ok) {
      throw new Error("La respuesta no esta bien");
    }
    const flashCardParseado = await respuesta.json();
    return flashCardParseado;
  } catch (e) {
    console.error("Error al realizar fetch", e);
  }
}

// ------------------- Ver cartas en general en el navegador ------------------- //
// Card que encontré para la practica en este link: https://www.devsolitude.com/blog/how-to-create-html-css-cards-flashcards
let cards = [];

let cardView = (id, titulo, descripcion) => {
  return `<div class="card-wrapper" onclick='mostrarPanelEstudiar(${id})'>
        <div class="card-body">
          <div class="card-front">
            <p id="titulo">${titulo}<p>
          </div>
          <div class="card-back">
            <p id="descripcion">${descripcion}</p>
          </div>
        </div>
    </div>
`;
};

function vistaFlashcardsGeneral() {
  flashcards.forEach((flashcard) => {
    cards.push(cardView(flashcard.id, flashcard.titulo, flashcard.descripcion));
  });

  document.getElementById("cardContainerView").innerHTML = cards.join("");
}
// ------------------- Crear flashacard formulario (seccion) ------------------- //

let crearSectionHide = true;

function vistaCrearFlashcard() {
  document.getElementById("EstudiarFlashcard").style.display = "none";

  if (crearSectionHide) {
    document.getElementById("cardContainerView").style.display = "none";
    document.getElementById("createContainerView").style.display = "block";
    crearSectionHide = false;
  } else if (!crearSectionHide) {
    document.getElementById("cardContainerView").style.display = "block";
    document.getElementById("createContainerView").style.display = "none";
    crearSectionHide = true;
  }
}

// agregar otras preguntas al formulario
let otras_Preguntas = [];

let pregunta = (contador) => {
  return `<label for="preguntaTxt${contador}"> Pregunta #${contador}</label>
<input type="text" name="preguntaTxt${contador}" id="preguntaTxt${contador}" />
<br/>
<label for="respuestaTxt${contador}">Respuesta</label>
<textarea name="respuestaTxt${contador}" id="respuestaTxt${contador}"></textarea>
<br /><br /><hr /><br />
`;
};

function agregarPregunta() {
  let contador =
    document.getElementById("preguntas").getElementsByTagName("label").length /
    2;
  otras_Preguntas.push(pregunta(contador + 1));

  // El adjacentHtml es lo que me agrega mas parte del formulario para crear preguntas, gracias W3School por ese regalo, amen.
  document
    .getElementById("preguntas")
    .insertAdjacentHTML("beforeend", pregunta(contador + 1));

  console.log(pregunta(contador + 1));
}

function contadorPreguntas() {
  let preguntas = [];
  let contador =
    document.getElementById("preguntas").getElementsByTagName("label").length /
    2;

  for (i = 0; i < contador; i++) {
    let newPregunta = {
      id: i + 1,
      pregunta: document.getElementById(`preguntaTxt${i + 1}`).value,
      respuesta: document.getElementById(`respuestaTxt${i + 1}`).value,
    };

    preguntas.push(newPregunta);
  }

  return preguntas;
}

function guardarFlashcards() {
  let newFlashcards = {
    //  Tranqui, la api se encarga de otorgarle un id unico, ggezz
    titulo: document.getElementById("tituloTxt").value,
    descripcion: document.getElementById("descripcionTxt").value,
    preguntas: contadorPreguntas(),
  };

  enviarDatos(newFlashcards);
  console.log(newFlashcards);
  vistaCrearFlashcard();
  reload();
}

const enviarDatos = (data) => {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:8081/flashcards/1", {
      method: "POST", // Especificamos el método HTTP POST
      headers: {
        "Content-Type": "application/json", // Indicamos que enviamos datos JSON
      },
      body: JSON.stringify(data), // Convertimos el objeto JS a JSON
    })
      .then((response) => {
        if (!response.ok) {
          reject("Error en la petición");
        } else {
          return response.json(); // Convertimos la respuesta a JSON
        }
      })
      .then((data) => {
        resolve(data); // Resolvemos la promesa con la respuesta del servidor
      })
      .catch((error) => {
        reject(error); // Manejamos errores en caso de que ocurra algo mal
      });
  });
};

// ------------------- Pantalla de Estudiar las cartas ------------------- //

// Me falta hacer lo siguiente:
// Funcionalidad suffle (Opcional, lo hare despues probablemente)

let viewPanelEstudiar = false;
let contadorEnSerie = 0;
let cardDataActual = {}; // mi flashcard actual, hare que el panel de vista la devuelva, asi puedo acceder con facilidad.
let repetirPreguntasNoConocidas = false;

function mostrarPanelEstudiar(id) {
  if (document.getElementById("card-Repeatbody")) {
    document.getElementById("EstudiarSeccion").remove();
  }

  if (!repetirPreguntasNoConocidas) {
    document.getElementById("aprendida").innerText = "Aprendida";
    document.getElementById("noAprendida").innerText = "No Aprendida";
  }

  if (cardDataActual.id !== id) {
    contadorEnSerie = 0;
  }

  let cardData = [];
  let pregunta = "";
  let respuesta = "";
  let cantidadPreguntas = 0;

  if (repetirPreguntasNoConocidas) {
    cardData = preguntasNoConocidas;
    pregunta = cardData[contadorEnSerie].pregunta;
    respuesta = cardData[contadorEnSerie].respuesta;
    cantidadPreguntas = cardData.length;
  } else {
    cardData = flashcards.find((cardData) => cardData.id === id);
    cardDataActual = cardData;
    pregunta = cardData.preguntas[contadorEnSerie].pregunta;
    respuesta = cardData.preguntas[contadorEnSerie].respuesta;
    cantidadPreguntas = cardData.preguntas.length;
  }

  let cardEstudiar = `<div class="card-wrapperEstudiar" id="EstudiarSeccion">
          <div class="card-body">
            <div class="card-front">
              <p id="pregunta">${pregunta}</p>
              <p></p>
            </div>

            <div class="card-back">
              <p id="respuesta">${respuesta}</p>
            </div>
          </div>
        </div>
`;

  if (!viewPanelEstudiar) {
    document
      .getElementById("EstudiarFlashcard")
      .insertAdjacentHTML("afterbegin", cardEstudiar);
    viewPanelEstudiar = true;
  } else if (viewPanelEstudiar) {
    document.getElementById("pregunta").innerHTML = pregunta;

    document.getElementById("respuesta").innerHTML = respuesta;
  }

  document.getElementById("preguntasSeguimiento").innerText = ` ${
    contadorEnSerie + 1
  } / ${cantidadPreguntas} `;

  document.getElementById("EstudiarFlashcard").style.display = "block";

  return cardDataActual;
}

// Funcionalidad del menu para reestudiar preguntas NoConocidas
let preguntasConocidas = [];
let preguntasNoConocidas = [];

let cardBottons = `
  <div id="card-Repeatbody">
  <div id="card-RepeatMenu">
          <div id="repetirTodas" onclick='repetirTodas()'>
            <p id="titulo">Repetir Todas<p>
          </div>
          <div id="repetirNoConocidas" onclick='repetirNoConocidas()'>
            <p id="descripcion">Repetir No Conocidas</p>
          </div>

       <div>
       <div>
`;

// ARREGLAR QUE LA ULTIMA PREGUNTA NO SE GUARDA EN EL PUSH AL DARLE NO CONOCIDA
function PreguntaEstado(estado) {
  if (
    repetirPreguntasNoConocidas &&
    contadorEnSerie < preguntasNoConocidas.length
  ) {
    if (estado && contadorEnSerie < preguntasNoConocidas.length - 1) {
      contadorEnSerie += 1;
      mostrarPanelEstudiar(cardDataActual.id);
    } else if (
      !estado &&
      contadorEnSerie > 0 &&
      preguntasNoConocidas.length - 1
    ) {
      contadorEnSerie -= 1;
      mostrarPanelEstudiar(cardDataActual.id);
    } else {
      cartasRepetidasLeidas();
    }
  } else if (
    !repetirPreguntasNoConocidas &&
    contadorEnSerie < cardDataActual.preguntas.length - 1
  ) {
    if (estado) {
      preguntasConocidas.push(cardDataActual.preguntas[contadorEnSerie]);
    } else if (!estado) {
      preguntasNoConocidas.push(cardDataActual.preguntas[contadorEnSerie]);
    }
    contadorEnSerie += 1;
    mostrarPanelEstudiar(cardDataActual.id);
  } else {
    cartasRepetidasLeidas();
  }
}

function cartasRepetidasLeidas() {
  console.log("Se han leido todas las cartas");
  console.log(preguntasNoConocidas);
  document.getElementById("EstudiarSeccion").innerHTML = cardBottons;
  viewPanelEstudiar = false;
}

//Funcionalidad Repetir Todas
function repetirTodas() {
  contadorEnSerie = 0;
  repetirPreguntasNoConocidas = false;
  preguntasConocidas = [];
  preguntasNoConocidas = [];
  mostrarPanelEstudiar(cardDataActual.id);
}

//Funcionalidad Repetir no conocidas
function repetirNoConocidas() {
  document.getElementById("noAprendida").innerText = "Anterior";
  document.getElementById("aprendida").innerText = "Siguiente";

  if (preguntasNoConocidas.length) {
    contadorEnSerie = 0;
    console.log(preguntasNoConocidas);
    repetirPreguntasNoConocidas = true;
    mostrarPanelEstudiar(cardDataActual.id);
  }

  console.log("Todas las preguntas son conocidas");
}

// refrescar la pagina al hacer click en el logo
function reload() {
  location.reload(true);
}

// ------------------- editar cartas------------------- //
// Crear view editar cartas
//editar cartas

let cardEditarView = ``;
// ------------------- Eliminar cartas------------------- //
// Poder eliminar carta desde la view editar cartas
