import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormProfesorasComponent } from "./form-profesoras.component";

fdescribe("Formulario Profesoras Component", () => {
  
  let component: FormProfesorasComponent;
  let fixture: ComponentFixture<FormProfesorasComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FormProfesorasComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(FormProfesorasComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

    it("Creacion Componente FormProfesoras", () => {
        expect(component).toBeTruthy();
    });

    it("Testear Creacion de NgOnInit FormProfesoras", () => {
        expect(component.ngOnInit()).toBeTruthy();
    });

    it("Validar creacion de formulario Vacio FormProfesoras", () => {
        expect(component.validarProfesora()).toBeFalsy();
    });

    it("Abrir Modal Error FormProfesoras", () => {
        var result = component.abrirModalError("");
        expect(result).toBeTruthy();
    });
  
    it("Abrir Modal Exito FormProfesoras", () => {
        var result = component.abrirModalExito("");
        expect(result).toBeTruthy();
    });


});

