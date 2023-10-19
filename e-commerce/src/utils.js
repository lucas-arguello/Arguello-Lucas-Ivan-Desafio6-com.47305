//Aqui creamos una variable que me va a permitir ubicar los archivos que yo tenga dentro del proyecto.
import path from "path"; //instalamos esta libreria de Nodejs que ya viene integrada. Me ayuda a unir diferentes rutas.
import { fileURLToPath } from "url";

//El valor que obtenemos de esta variable "__dirname" va ser la "ruta" de la carpeta que contiene el archivo, donde 
//creamos la variable "__dirname". Nos sirve como punto de referencia para poder ubicar las diferentes carpetas o archivos
//del proyecto y referenciamos de esta forma hacia la carpeta "src".
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

