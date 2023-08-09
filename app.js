let puntaje = 0;
let indicePreguntaActual = 0;
let preguntasRespondidas = 0;
let preguntas = [];
const contenedorQuiz = document.getElementById('contenedor-quiz');
const botonSiguiente = document.getElementById('saltar-pregunta');
const botonNuevaTrivia = document.getElementById('nueva-trivia');
const mostrarPuntaje = document.getElementById('puntaje');

// Accediendo a los nuevos elementos
const seleccionCategoria = document.getElementById('categoria');
const seleccionDificultad = document.getElementById('dificultad');
const seleccionTipo = document.getElementById('tipo');

// Función para obtener preguntas de la API de OpenTDB
function obtenerPreguntas(cantidad = 10, categoria, dificultad, tipo) {
    fetch(`https://opentdb.com/api.php?amount=${cantidad}&category=${categoria}&difficulty=${dificultad}&type=${tipo}`)
        .then(response => response.json())
        .then(data => {
            preguntas = data.results;
            mostrarPregunta();
        });
}
// Función para mostrar una pregunta
function mostrarPregunta() {
    const pregunta = preguntas[indicePreguntaActual];
    contenedorQuiz.innerHTML = `
        <h3>${pregunta.question}</h3>
        ${pregunta.incorrect_answers.map(respuesta => `<button class="btn btn-primary respuesta">${respuesta}</button>`).join('')}
        <button class="btn btn-primary respuesta">${pregunta.correct_answer}</button>
    `;

    // Agregar listener de eventos a todos los botones de respuesta
    document.querySelectorAll('.respuesta').forEach((boton, index) => {
        boton.addEventListener('click', (e) => {
            seleccionarRespuesta(e);
            pregunta.respuestaSeleccionada = true;
        });
    });
}

// Función para manejar la selección de respuestas
function seleccionarRespuesta(e) {
    const botonSeleccionado = e.target;
    const respuestaCorrecta = preguntas[indicePreguntaActual].correct_answer;

    // Verificar si la respuesta seleccionada es correcta
    if (botonSeleccionado.innerText === respuestaCorrecta) {
        puntaje += 100;
        mostrarPuntaje.innerText = `Puntaje: ${puntaje}`;
    }

    // Pasar a la siguiente pregunta
    indicePreguntaActual++;
    if (indicePreguntaActual < preguntas.length) {
        mostrarPregunta();
        
    } else {
        contenedorQuiz.innerHTML = '<h2>¡Trivia terminada!</h2>';
        botonSiguiente.disabled = true; 
    }
}

// Función para iniciar una nueva trivia
function iniciarNuevaTrivia() {
    puntaje = 0;
    preguntasRespondidas = 0;
    indicePreguntaActual = 0;
    botonSiguiente.disabled = false;
    mostrarPuntaje.innerText = `Puntaje: ${puntaje}`;
    // Obtener preguntas basadas en la selección del usuario
    obtenerPreguntas(
        10, 
        seleccionCategoria.value, 
        seleccionDificultad.value, 
        seleccionTipo.value
    );
    
}

// Función para manejar el botón "Saltar Pregunta"
function saltarPregunta() {
    if (preguntas[indicePreguntaActual].respuestaSeleccionada) {
        preguntasRespondidas++;
    }

    if (indicePreguntaActual < preguntas.length - 1) { 
        indicePreguntaActual++;
        mostrarPregunta();
    } else {
        contenedorQuiz.innerHTML = '<h2>¡Trivia terminada!</h2>';
        botonSiguiente.disabled = true; 
    }
}

botonSiguiente.addEventListener('click', saltarPregunta);
botonNuevaTrivia.addEventListener('click', iniciarNuevaTrivia);

// Iniciar la primera trivia
obtenerPreguntas();
