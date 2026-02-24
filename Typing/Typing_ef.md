# Typing

Recreamos una funcion similar a una caja de texto como la de un Agente de AI commo lo es la aplicacion de ChatGPT o Gemini. Donde tenemos un espaico de texto como Input y otra caja mas dinamica y ampliada de Output.

Jugamos con 2 objetivo claves. El texto generado por el LLM y generar espacios para el nuevo texto generado.

## Inicializar

Obtemos una 'Posicion' para agregar un espacio '<span>' al emnsaje para dar efecto de un espacio entre mensajes despues del anterior.

## Escritura

La funcion se llama en repeticion en cada 'seTimeout' donde espera 20 milisegundos a la escritura de cara caracter para un efecto escritura, donde lo añade el output para hacer un recorrido de la posicion del texto.

Nuestros Systemprompt genera el texto donde las palabras claves o enfacis tienen etiquetas HTML como '<b></b>' o '<em></em>' Buscamos su siguiente etiqueta cierre para añadir l a etiqueta completa para que el navegador interprete la etiqueta HTML correctamente.

## Auto-Scroll

Agregamos un efecto de auto-scroll que no hace muy natural a una aplicacion nativa de Agentes AI, donde ubicamos nuestro 'chat-window' se desplace hacia abajo para que siempre estemos observando el mensaje mas reciente. Esto tiene relevancia entre mas texto o preguntas se añaden en la conversacion.

## Configuración 

    ```javascript
    function escribir(TextoLLM,Posicion, nodoActual = null) {
    const output = getElementById('Mi output donde genero la salida');
    const chatWindow = getElementById('div donde se encuentra el output');
    const texto = Array.isArray(TextoLLM) ? TextoLLM.join('<br>') : TextoLLM; // Validacion protección si TextoLLM ya es string

    if (Posicion === 0) {
        nodoActual = createElement('span'); // contenedor exclusivo para ESTE mensaje nuevo
        nodoActual.style.display = "block"; // Para que ocupe su propia línea
        nodoActual.style.marginBottom = "10px"; // Separación entre mensajes
        output.appendChild(nodoActual); // Lo agregamos al final del chat sin borrar lo anterior
    }
    if (Posicion < texto.length) {
        let charsToPrint = 1;

        // DETECTOR DE ETIQUETAS
        if (texto.charAt(Posicion) === '<') {
            let closing = texto.indexOf('>', Posicion);
            if (closing !== -1) {
                charsToPrint = (closing + 1) - Posicion;
            }
        }

        if (nodoActual) {
            nodoActual.innerHTML = texto.substring(0, Posicion + charsToPrint);
        }
        Posicion += charsToPrint;
        chatWindow.scrollTop = chatWindow.scrollHeight;
        setTimeout(() => { escribir(TextoLLM, Posicion, nodoActual); }, 30);
        // Pasamos 'nodoActual' a la siguiente vuelta para seguir escribiendo en el mismo sitio
    }
}
    ```

