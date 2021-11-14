import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormDiagnosticosComponent } from "./form-diagnosticos.component";

fdescribe("Formulario Diagnosticos Component", () => {
  
  let component: FormDiagnosticosComponent;
  let fixture: ComponentFixture<FormDiagnosticosComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FormDiagnosticosComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(FormDiagnosticosComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("Creacion Componente Formulario Diagnostico", () => {
    expect(component).toBeTruthy();
  });

  it("Testear Creacion de NgOnInit Formulario Diagnostico", () => {
    expect(component.ngOnInit()).toBeTruthy();
  });

  it("Validar si el formulario de Diagnostico es invalido con datos vacios", () => {
    expect(component.validarDiagnostico()).toBeFalse();
  });

  it("Abrir Modal Error FormDiagnostico", () => {
      var result = component.abrirModalError("");
    expect(result).toBeTruthy();
  });

  it("Abrir Modal Exito FormDiagnostico", () => {
    var result = component.abrirModalExito("");
    expect(result).toBeTruthy();
  });



});