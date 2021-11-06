export class Estudiante {
    id: string = "";
    nombres:string = "";
    apellidos: string = "";
    fecNacimiento: string = "";
    mes: string = "";
    anio: string = "";
    numHistorico: string = ""; 
    numGestion: string = "";
    gestionRegistro: string = "";
    sexo: string = "";
    sesiones: {
        id: string
    }[]=[];
    estados: {
        estado: string,
        fecha: string
    }[] = [];
    diagnosticos: {
        diagnostico: string
    }[] = [];
    direccion: string = "";
    apoderados:{
        id: string
    }[]=[];
}  
