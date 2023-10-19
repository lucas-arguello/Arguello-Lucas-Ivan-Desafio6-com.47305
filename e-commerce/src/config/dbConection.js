import mongoose from "mongoose";

//Creamos la conexion con nuestra Base de Datos y luego la exportamos.
export const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://lucas5ivan:Lucas2251Atlas@lia2251.dc33gap.mongodb.net/Muebleria?retryWrites=true&w=majority");
        console.log("Base de Datos conectada, OK")

    }catch (error) {
        console.log(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}