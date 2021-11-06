export class Sesion {
    id:string="";
    estudiante: {
        id: string
    }= {id:''};
    profesora: {
        id:string,
        nombres:string
    }= {id:'', nombres:''};
    tratamiento: {
        id: string
    } = {id:''};
    asistencias: {
        fecha: string,
        hora: string
    }[] = [];
    tipoDePago:string="";
    cantidadDeSesiones: string="";
    costoPorSesion: string ="";
    cuotas:string [] = [];
}