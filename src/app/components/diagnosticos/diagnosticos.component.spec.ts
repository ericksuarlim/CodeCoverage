import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DiagnosticosComponent } from "./diagnosticos.component";

fdescribe("Diagnosticos Component", () => {
  
  let component: DiagnosticosComponent;
  let fixture: ComponentFixture<DiagnosticosComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DiagnosticosComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticosComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("Creacion Componente Diagnostico", () => {
    expect(component).toBeTruthy();
  });

  it("Testear Creacion de NgOnInit Diagnostico", () => {
    expect(component.ngOnInit()).toBeTruthy();
  });

  it("Dirigir a editar diagnostico desde Diagnosticos", () => {
    expect(component.EditarDiagnostico(2)).toBeTruthy();
  });

  
  it("Eliminar diagnostico desde Diagnosticos Componente ",() => {
    const auxDiagnostico = {id: "",
      codigoColor:"",
      color: 2 ,
      diagnostico: ""
    } 
    expect(component.eliminarDiagnostico(auxDiagnostico)).toBeTruthy();
  });

});
