import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';

const ai = new GoogleGenAI({apiKey:"MY_API_KEY"});

// ---------------------------------------------------------
//  SUBIR ARCHIVO LOCAL
// ---------------------------------------------------------
async function subirArchivoLocal(rutaArchivo) {
  try {
    // Limpieza de ruta para Windows
    const rutaLimpia = rutaArchivo.replace(/\\/g, "/");

    if (!fs.existsSync(rutaLimpia)) throw new Error("El archivo no existe");
      console.log(`📡 Subiendo archivo local a la nube...`);

      const uploadResult = await ai.files.upload({
        file: rutaLimpia,
        config: { mimeType: 'application/pdf' }
      });
      console.log(`✅ Archivo listo. ID: ${uploadResult.uri}`);

    return uploadResult.uri;//Devolvemos la URI para usarla después

  } catch (error) {
    console.error("❌ Error subiendo:", error.message);
    return null;
  }
}

// ---------------------------------------------------------
// SUBIR ARCHIVO DESDE URL DE CLOUD STORAGE
// ---------------------------------------------------------
async function subirArchivoDesdeURL(url) {
  try {
    console.log(`📡 Descargando archivo desde ${url}...`);
    // Hacemos la petición para obtener el archivo desde la URL pública
    // Nota: fetch está disponible globalmente en Node.js v18+
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    }
    // Convertimos la respuesta a un Buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Extraemos el nombre del archivo de la URL
    const displayName = url.substring(url.lastIndexOf('/') + 1);
    console.log(`📡 Subiendo buffer a la nube...`);

    // Subimos el buffer del archivo directamente
    const uploadResult = await ai.files.upload({
      file: buffer,
      config: {
        mimeType: 'application/pdf',
        displayName: displayName
      }
    });
    console.log(`✅ Archivo listo. ID: ${uploadResult.uri}`);
    return uploadResult.uri;

  } catch (error) {
    console.error("❌ Error subiendo desde URL:", error.message);
    return null;
  }
}

async function chatConPDF(uriDelArchivo, pregunta) {
  try {
    if (!uriDelArchivo) {
      console.error("⚠️ Error: No hay un archivo cargado (URI vacía).");
      return;
    }
    console.log(`\n🤔 Preguntando: "${pregunta}"...`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: 'user',
          parts: [
            { text: pregunta },
            {
              fileData: {
                mimeType: 'application/pdf',
                fileUri: uriDelArchivo // Usamos la URI recibida
              }
            }
          ]
        }
      ],
      config: {
            systemInstruction: {
                role: "system",
                parts: [{ text:
                `AQUI UTILIZA TUS INSTRUCCIONES` }],
            },
        },
    });

    // Limpiamos un poco el texto de salida
    const respuestaTexto = response.text.trim();
    console.log(`🗣️ Gemini: ${respuestaTexto}`);
    return respuestaTexto;

  } catch (error) {
    console.error("❌ Error en el chat:", error.message);
  }
}

// ---------------------------------------------------------
// preguntas
// ---------------------------------------------------------
export async function main(pregunta) {
    // PASO 1: Define la URL pública de tu archivo en Cloud Storage
    const urlArchivoGCS = "https://storage.googleapis.com/NOMBRE_DE_TU_BUCKET/RUTA/A/TU/ARCHIVO.pdf";

    // Subimos el archivo desde la URL y GUARDAMOS la URI en una variable
    const miArchivoURI = await subirArchivoDesdeURL(urlArchivoGCS);

    // Si la subida falló, detenemos todo
    if (!miArchivoURI) return;

    // Se usa la URI devuelta por la API de Gemini para chatear con el PDF.
    await chatConPDF(miArchivoURI, pregunta);
}

// Ejecutar
main("¿Que es 'Escucha Activa'?");