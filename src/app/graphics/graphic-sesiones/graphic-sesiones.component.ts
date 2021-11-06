import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts'
import { Chart } from 'chart.js'
import { ProfesorasService } from 'src/app/services/profesoras.service';
import { SesionesService } from 'src/app/services/sesiones.service';

@Component({
  selector: 'app-graphic-sesiones',
  templateUrl: './graphic-sesiones.component.html',
  styleUrls: ['./graphic-sesiones.component.scss']
})
export class GraphicSesionesComponent implements OnInit {
  constructor(
    private profesorasService: ProfesorasService,
    private sesionesService: SesionesService
  ) { }

  myChart: Chart = new Chart("myChart", {});
  myChartColor=['rgba(217, 237, 146, 0.5)','rgba(181, 228, 140, 0.5)','rgba(153, 217, 140, 0.5)','rgba(118, 200, 147, 0.5)'
  ,'rgba(82, 182, 154, 0.5)','rgba(52, 160, 164, 0.5)','rgba(26, 117, 159, 0.5)','rgba(24, 78, 119, 0.5)',
  'rgba(30, 96, 145, 0.5)','rgba(30, 96, 145, 0.5)','rgba(30, 96, 145, 0.5)','rgba(30, 96, 145, 0.5)',
  'rgba(30, 96, 145, 0.5)','rgba(30, 96, 145, 0.5)']

  listaProfesoras: any = [];
  listaDeSesiones:any=[];
  listaDeAnios:any=[]
  ChartTypes = '';
  chartOptions = {};
  chartDatasets: any;
  chartLabels: any = [];
  anios=[0]
  listaMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  mesesContador=[0,0,0,0,0,0,0,0,0,0,0,0]
  anioSeleccionado=0;
  show=false
  ChartColors: Color[] = [
    {
      backgroundColor: ['rgba(82, 182, 154, 0.5)',
        'rgba(181, 228, 140, 0.5)']
    },
  ];

  async init() {
    await Promise.all([
      this.createChart(),
      this.ListaProfesoras(), 
      this.ListaCantidadSesiones()
    ]);
  }

  async ngOnInit() {
    this.init();
  }
  async ListaCantidadSesiones(anio:number=0) {
    await Promise.all([
      this.listaDeSesiones = await this.sesionesService.obtenerListaFechas(anio),
      this.listaDeAnios=await this.sesionesService.listadoFiltradoAñosGlobales(),
      this.generarListaAnios()]);
  }
  generarListaAnios(){
    this.listaDeAnios.sort();
  }
  opcionesParaBarra(tituloGrafico:string,xAxestitulo:string,yAxestitulo:string) {
    this.chartOptions = {
      responsive: true,
      title: {
        display: true,
        text: tituloGrafico,
        fontSize:30,
        fontColor:'Black',
        fontStyle:"bold",
        fontFamily: "arial"
      },
      scales: {
        xAxes:[{
          scaleLabel:{
            display:true,
            labelString: xAxestitulo
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yAxestitulo
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
  }
  opcionesParaPie(texto: string) {
    this.chartOptions={
      responsive: true,
      title:{
        display: true,
        text: texto,
        fontSize:30,
        fontColor:'Black',
        fontStyle:"bold",
        fontFamily: "arial"
      }
    }
  }
  createChart() {
    this.myChart = new Chart("myChart", {})
  }
  async ObtenerOpciones(jsonOpciones: any) {
    if (jsonOpciones.value.tipoDeGrafico == "") {
      this.ChartTypes = 'bar';
    }
    else {
      this.ChartTypes = jsonOpciones.value.tipoDeGrafico;
    }

    if (jsonOpciones.value.filtroCategoria == 2 && jsonOpciones.value.tipoDeGrafico != "") {
      this.actulizarChartPorProfesora();
    }
    if (jsonOpciones.value.filtroCategoria == 1 && jsonOpciones.value.tipoDeGrafico!="" &&jsonOpciones.value.filtroAnio!="") {
      this.anioSeleccionado=Number(jsonOpciones.value.filtroAnio);
      await this.ListaCantidadSesiones(this.anioSeleccionado);
      this.actulizarChartPorAsistencia();
    }
  } 
  
  actulizarChartPorAsistencia() {
    this.myChart.destroy();
    this.createChart();
    var ctx = document.getElementById("myChart") as HTMLCanvasElement
    this.myChart.ctx = ctx.getContext("2d")
    this.myChart.config.type = this.ChartTypes;
    switch (this.ChartTypes) {
      case 'bar':
        break;
      case 'pie':
        this.graficoPorPieAsistencia();
        break;
      default:
        this.createChart();
        break;
    }
  }
  ContadorMeses(){
    var chartDatasetsAux=[0,0,0,0,0,0,0,0,0,0,0,0]
    var object=this.listaDeSesiones;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key];
        var dateAux:Date=new Date(element);
        var mesNumero=dateAux.getMonth()
        chartDatasetsAux[mesNumero]=chartDatasetsAux[mesNumero]+1;
      }
    }
    this.chartDatasets=chartDatasetsAux;
  }
  graficoPorPieAsistencia(){
    this.ContadorMeses();
    this.myChart.data.labels = this.listaMeses
    this.myChart.data.datasets = [{
       label:'CANTIDAD',data: this.chartDatasets, backgroundColor:this.myChartColor
    }];
    this.opcionesParaPie('Grafico cantidad asistencias por meses');
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }

  actulizarChartPorProfesora() {
    this.myChart.destroy()
    this.createChart()
    var ctx = document.getElementById("myChart") as HTMLCanvasElement
    this.myChart.ctx = ctx.getContext("2d")
    this.myChart.config.type = this.ChartTypes;
    switch (this.ChartTypes) {
      case 'bar':
        this.graficoPorBarraProfesora();
        break;
      case 'pie':
        this.graficoPorPieProfesora();
        break;
      default:
        this.createChart();
        break;
    }
  }
  async ListaProfesoras() {
    var aux = await this.profesorasService.obtenerProfesoras()
    for (const key in aux) {
      if (Object.prototype.hasOwnProperty.call(aux, key)) {
        const element = aux[key];
        this.chartLabels.push(element.nombres);
      }
    }
    this.listaProfesoras = await this.sesionesService.porProfesoras() //por porfesoras
  }

  graficoPorBarraProfesora() {
    this.myChart.data.labels = ["PROFESORAS"]
    this.chartDatasets = this.crearDatosPorProfesora(1);
    this.myChart.data.datasets = this.chartDatasets
    this.opcionesParaBarra("Grafico de barras por profesoras","","CANTIDAD DE SESIONES");
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }
  graficoPorPieProfesora() {
    this.myChart.data.labels = this.chartLabels
    this.chartDatasets = this.crearDatosPorProfesora(2);
    this.myChart.data.datasets = [{
      data: this.chartDatasets, backgroundColor: this.myChartColor
    }];
    this.opcionesParaPie("Grafico total por profesora");
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }

  crearDatosPorProfesora(tipoRes: number) {
    var totalProfesoras;
    var dataProfesoras = [];
    var lee: any = [];
    for (let index1 = 0; index1 < this.chartLabels.length; index1++) {
      totalProfesoras = 0;
      for (let index2 = 0; index2 < this.listaProfesoras.length; index2++) {
        lee = this.listaProfesoras[index2];
        for (let index3 = 0; index3 < this.listaProfesoras.length; index3++) {
          if (this.listaProfesoras[index3].nombres == this.chartLabels[index1]) {
            totalProfesoras = totalProfesoras + 1
          }
        }
      }
      totalProfesoras = totalProfesoras / this.listaProfesoras.length;
      if (tipoRes == 1) {
        dataProfesoras.push({ label: this.chartLabels[index1], data: [totalProfesoras], backgroundColor: this.myChartColor[index1] })
      }
      if (tipoRes == 2) {
        dataProfesoras.push(totalProfesoras)
      }
    }
    return dataProfesoras;
  }

  visibilidad(value:string){
    var aux=document.getElementById("lista-anios") as HTMLElement;
    var aux1=document.getElementById("tiposGraficos") as HTMLSelectElement;
    switch (value) {
      case "1":
        aux.style.visibility="visible"  
        if(aux1.length>2){
          aux1.remove(aux1.length-1);
        }
        break;
      case"2":
      aux.style.visibility="collapse"
      var option = document.createElement("option");
      option.text = "Barra";
      option.value='bar';
      if(aux1.length<3){
        aux1.add(option);
      }
      break;    
      default:
        break;
    }
  }
}