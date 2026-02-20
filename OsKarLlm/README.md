# Chat con PDF usando Gemini API

Este proyecto es un script de Node.js que demuestra cómo utilizar la API de Google Gemini (`@google/genai`) para subir un archivo PDF, y luego mantener una conversación con una IA que utiliza el contenido de ese archivo como fuente de conocimiento.

## Instalación de Dependencias

El script utiliza el paquete `@google/genai`. Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para instalarlo:

```bash
npm install @google/genai
```
También necesitarás la librería `fs` que viene por defecto en Node.js, por lo que no requiere instalación adicional.

## Configuración de la API Key

    ```javascript
    const ai = new GoogleGenAI({apiKey:"MY_API_KEY"});
    ```
1. Reemplaza `"MY_API_KEY"` con tu propia clave de API de [Google AI Studio](https://aistudio.google.com/app/apikey).

## Descripción

1.  `subirArchivoDesdeURL(rutaArchivo)`: Se encarga de subir un archivo (PDF) de Google Storage. Una vez subido, Google genera una URI única para ese archivo. Esta URI es lo que usaremos para referirnos al archivo en futuras llamadas a la API, evitando la necesidad de subirlo repetidamente.

2.  `chatConPDF(uriDelArchivo, pregunta)`: Esta función toma la URI del archivo previamente subido y una pregunta del usuario. Envía ambos a un modelo de Gemini (`gemini-2.5-flash`), junto con un conjunto de instrucciones del sistema (`systemInstruction`) que definen el rol y el comportamiento de la IA. La función devuelve la respuesta generada por el modelo.
    >NOTA: Pudes utilizar el modelo a tu eleccion. Recomiendo utilizar `gemini-2.5-flash` en los procesos de configuracion y pruebas. Esto para obtener resultados mas rapidos, buscamos que las pruebas sean correctas antes que los resultados del agente.
    En mi caso decidi utilizar `gemini-3-pro-preview` con el fin de hacer pruebas mas reobustas.
    A la fecha de esta ultima actualizacion el Modelo `gemini-3-pro-preview` genera resultadosa mas robustos pero a mayor tiempo. Como desventaja a considerar de ser una version *preview* omite ciertas instrucciones de `systemInstruction`, importante revisar respuestas en posibles fallas.

3.  `main(pregunta)`: Es la función principal que orquesta todo el proceso. Primero, llama a `urlArchivoGCS` para obtener la URI del PDF y, una vez obtenida, la utiliza para llamar a `chatConPDF` con una pregunta específica.

## Subir archivo local

Utiliza la funcion `subirArchivoLocal(rutaArchivo)` disponible si se desea cargar un archivo desde ruita local. COnsidera cambiar el llamado a la funcion `subirArchivoDesdeURL(rutaArchivo)` por `subirArchivoLocal(rutaArchivo)`. Aqui se utiliza una limpia de ruta de archivo para evitar inconvenientes con las diagonales de ruta.

## Ejecutar Script

Abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:

```bash
node src/gemini.js
```

Verás en la consola el proceso: primero la subida del archivo y luego la pregunta y la respuesta de Gemini.

```
📡 Descargando archivo...
📡 Subiendo buffer a la nube...
✅ Archivo listo. ID: xxxxxxx
🤔 Preguntando: "¿Aqui Hay una pregunta?"...
🗣️ Gemini: Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga distinctio ex quas ducimus laborum aperiam et labore dolore laboriosam aspernatur! Deleniti voluptatum tenetur sed corporis quasi eum officiis sit culpa?
```

Para hacer una pregunta diferente, simplemente modifica el texto dentro de la llamada a `main` al final del archivo:

```javascript
// Cambia la pregunta aquí
main("¿Aqui debo poner otra pregunta?");
```
