import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormApoderadosComponent } from "./form-apoderados.component";

fdescribe("Formulario Apoderado Component", () => {
  
  let component: FormApoderadosComponent;
  let fixture: ComponentFixture<FormApoderadosComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FormApoderadosComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(FormApoderadosComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

    it("Creacion Componente FormApoderados", () => {
        expect(component).toBeTruthy();
    });

    it("Testear Creacion de NgOnInit FormApoderados", () => {
      expect(component.ngOnInit()).toBeTruthy();
  });

  
  it("Validar creacion de formulario Vacio FormApoderados", () => {
    expect(component.validarApoderado()).toBeFalsy();
    });
  
    it("Abrir Modal Error FormApoderados", () => {
      var result = component.abrirModalError("");
      expect(result).toBeTruthy();
  });
  it("Abrir Modal Exito FormApoderados", () => {
    var result = component.abrirModalExito("");
    expect(result).toBeTruthy();
  });





  
});