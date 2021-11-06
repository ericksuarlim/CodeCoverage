export class Apoderado {
    id: string = "";
    nombres:string = "";
    apellidos: string = "";
    celular: string = "";
    telefono: string = "";
    correoElectronico: string = "";
    gradoRelacion: string = "";
    direccion: string = "";
    estudiantes: {
        id: string
    }[] = [];

}