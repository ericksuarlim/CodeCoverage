import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../services/estudiantes.service'
import { Color} from 'ng2-charts'
import { Chart} from 'chart.js'
import { DiagnosticosService } from 'src/app/services/diagnosticos.service';
import { EstadosService } from 'src/app/services/estados.service';

@Component({
  selector: 'app-graphic-estudiantes',
  templateUrl: './graphic-estudiantes.component.html',
  styleUrls: ['./graphic-estudiantes.component.scss']
})
export class GraphicEstudiantesComponent implements OnInit {

  constructor(private estudiantesService: EstudiantesService,
    private diagnosticosService: DiagnosticosService,
    private estadosService: EstadosService) { }

  myChart: Chart = new Chart("myChart", {});
  myChartColor=['rgba(217, 237, 146, 0.5)','rgba(181, 228, 140, 0.5)','rgba(153, 217, 140, 0.5)','rgba(118, 200, 147, 0.5)'
                ,'rgba(82, 182, 154, 0.5)','rgba(52, 160, 164, 0.5)','rgba(26, 117, 159, 0.5)','rgba(24, 78, 119, 0.5)',
                'rgba(30, 96, 145, 0.5)']
  listaDiagnosticos:any= [];
  listaEstados:any=[]
  listaEstudianteDiagnosticos:any=[]
  listaEstudianteEstados:any=[]
  PorSexoMasculino = 0;
  PorSexoFemenino = 0;
  ChartTypes = '';
  chartOptions = {};
  chartDatasets: any;
  chartLabels:any = [];
  chartLabelsa:any = [];
  ChartColors: Color[] = [
    {
      backgroundColor: ['rgba(82, 182, 154, 0.5)',
        'rgba(181, 228, 140, 0.5)']
    },
  ];

  async init() {
    await Promise.all([
    this.createChart(),
    this.ListaCantidadSexo(),
    this.ListaDiagnosticos(),
    this.ListaEstados()
    ]);
  }

  async ngOnInit() {
    this.init();
  }

  async ListaCantidadSexo() {
    await Promise.all([
      this.PorSexoFemenino = await this.estudiantesService.porSexoFemenino(),
      this.PorSexoMasculino = await this.estudiantesService.porSexoMasculino(),
      this.chartDatasets=await this.estudiantesService.porSexo()]);
  }
  opcionesParaBarra(tituloGrafico:string,xAxestitulo:string,yAxestitulo:string){
    this.chartOptions={ 
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
            beginAtZero: true,
          }
        }]
      }};
  }
  opcionesParaPie(texto:string){
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
  actulizarChartPorSexo() {
    this.myChart.destroy()
    this.ListaCantidadSexo(),
    this.createChart()
    var ctx = document.getElementById("myChart") as HTMLCanvasElement
    this.myChart.ctx = ctx.getContext("2d")
    this.myChart.config.type = this.ChartTypes;
    switch (this.ChartTypes) {
      case 'bar':
        this.graficoPorBarraSexo();
        break;
      case 'pie':
        this.graficoPorPieSexo();
        break;
      default:
        this.createChart();
        break;
    }
  }
  createChart() {
    this.myChart = new Chart("myChart", {})
  }
  ObtenerOpciones(jsonOpciones: any) {
    if (jsonOpciones.value.tipoDeGrafico == "") {
      this.ChartTypes = 'bar';
    }
    else {
      this.ChartTypes = jsonOpciones.value.tipoDeGrafico;
    }

    if (jsonOpciones.value.filtroCategoria == 1 && jsonOpciones.value.tipoDeGrafico!="") {
      this.actulizarChartPorSexo();
    }
    if(jsonOpciones.value.filtroCategoria == 2 && jsonOpciones.value.tipoDeGrafico!=""){
      this.actulizarChartPorDiagnostico();
    }
    if(jsonOpciones.value.filtroCategoria == 3 && jsonOpciones.value.tipoDeGrafico!=""){
      this.actulizarChartPorEstados();
    }
  }
  graficoPorBarraSexo(){
    this.myChart.data.labels = ["SEXO"]
    this.myChart.data.datasets = [{
      label: "Masculino", data: [this.PorSexoMasculino], backgroundColor: [
        'rgba(52, 160, 164, 0.5)',
      ],
    }, {
      label: "Femenino", data: [this.PorSexoFemenino], backgroundColor: [
        'rgba(153, 217, 140, 0.5)',
      ]
    }];
    this.opcionesParaBarra("Grafico de barras por sexo","","CANTIDAD ESTUDIANTES");
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }
  graficoPorPieSexo(){
    this.myChart.data.labels = ['Masculino','Femenino']
    this.myChart.data.datasets = [{
       label:'sexo',data: this.chartDatasets, backgroundColor: [
        'rgba(52, 160, 164, 0.5)','rgba(153, 217, 140, 0.5)'
      ]
    }];
    this.opcionesParaPie("Grafico total por sexo");
    this.myChart.options=this.chartOptions;
    this.myChart.update();
  }

  actulizarChartPorDiagnostico(){
    this.myChart.destroy()
    this.createChart()
    var ctx = document.getElementById("myChart") as HTMLCanvasElement
    this.myChart.ctx = ctx.getContext("2d")
    this.myChart.config.type = this.ChartTypes;
    switch (this.ChartTypes) {
      case 'bar':
        this.graficoPorBarraDiagnostico();
        break;
      case 'pie':
        this.graficoPorPieDiagnostico();
        break;
      default:
        this.createChart();
        break;
    }
  }
  async ListaDiagnosticos(){
    var aux= await this.diagnosticosService.obtenerDiagnosticos()
    for (const key in aux) {
      if (Object.prototype.hasOwnProperty.call(aux, key)) {
        const element = aux[key];
        this.chartLabels.push(element.diagnostico);
      }
    }
    this.listaEstudianteDiagnosticos=await this.estudiantesService.porDiagnosticos()
  }
  crearDatosPorDiagnostico(tipoRes:number){
    var totalDiagnostico;
    var dataDiagnostico=[];
    var led:any;
    for (let index1 = 0; index1 < this.chartLabels.length; index1++) {
      totalDiagnostico=0;
      for (let index2 = 0; index2 < this.listaEstudianteDiagnosticos.length; index2++) {
        led=this.listaEstudianteDiagnosticos[index2]
        for (let index3 = 0; index3 < led.length; index3++) {
          if(led[index3].diagnostico==this.chartLabels[index1]){
            totalDiagnostico=totalDiagnostico+1
          }
        }
      }
      if(tipoRes==1){
        dataDiagnostico.push({label:this.chartLabels[index1],data:[totalDiagnostico],backgroundColor:this.myChartColor[index1]})
      }
      if(tipoRes==2){
        dataDiagnostico.push(totalDiagnostico)
      }
      
    }
    return dataDiagnostico;
  }
  graficoPorBarraDiagnostico(){
    this.myChart.data.labels=["DIAGNOSTICOS"]
    this.chartDatasets=this.crearDatosPorDiagnostico(1);
    this.myChart.data.datasets = this.chartDatasets
    this.opcionesParaBarra("Grafico de barras por diagnostico","","CANTIDAD ESTUDIANTES");
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }
  graficoPorPieDiagnostico(){
    this.myChart.data.labels = this.chartLabels
    this.chartDatasets=this.crearDatosPorDiagnostico(2);
    this.myChart.data.datasets = [{
      data:this.chartDatasets, backgroundColor: this.myChartColor
    }];
    this.opcionesParaPie("Grafico total por diagnostico");
    this.myChart.options=this.chartOptions;
    this.myChart.update();
  }

  actulizarChartPorEstados(){
    this.myChart.destroy()
    this.createChart()
    var ctx = document.getElementById("myChart") as HTMLCanvasElement
    this.myChart.ctx = ctx.getContext("2d")
    this.myChart.config.type = this.ChartTypes;
    switch (this.ChartTypes) {
      case 'bar':
        this.graficoPorBarraEstados();
        break;
      case 'pie':
        this.graficoPorPieEstados();
        break;
      default:
        this.createChart();
        break;
    }
  }
  async ListaEstados(){
    var aux= await this.estadosService.obtenerEstados()
    for (const key in aux) {
      if (Object.prototype.hasOwnProperty.call(aux, key)) {
        const element = aux[key];
        this.chartLabelsa.push(element.estado);
      }
    }
    this.listaEstudianteEstados=await this.estudiantesService.porEstados()
  }

  crearDatosPorEstado(tipoRes:number){
    var totalEstados;
    var dataEstado=[];
    var lee:any;
    for (let index1 = 0; index1 < this.chartLabelsa.length; index1++) {
      totalEstados=0;
      for (let index2 = 0; index2 < this.listaEstudianteEstados.length; index2++) {
        lee=this.listaEstudianteEstados[index2]
        for (let index3 = 0; index3 < lee.length; index3++) {
          if(lee[index3].estado==this.chartLabelsa[index1]){
            totalEstados=totalEstados+1
          }
        }
      }
      if(tipoRes==1){
        dataEstado.push({label:this.chartLabelsa[index1],data:[totalEstados],backgroundColor:this.myChartColor[index1]})
      }
      if(tipoRes==2){
        dataEstado.push(totalEstados)
      }
      
    }
    return dataEstado;
  }
  graficoPorBarraEstados(){
    this.myChart.data.labels=["ESTADOS"]
    this.chartDatasets=this.crearDatosPorEstado(1);
    this.myChart.data.datasets = this.chartDatasets
    this.opcionesParaBarra("Grafico de barras por estados","","CANTIDAD ESTUDIANTES");
    this.myChart.options = this.chartOptions;
    this.myChart.update();
  }
  graficoPorPieEstados(){
    this.myChart.data.labels = this.chartLabelsa
    this.chartDatasets=this.crearDatosPorEstado(2);
    this.myChart.data.datasets = [{
      data:this.chartDatasets, backgroundColor: this.myChartColor
    }];
    this.opcionesParaPie("Grafico total por estados");
    this.myChart.options=this.chartOptions;
    this.myChart.update();
  }
}


