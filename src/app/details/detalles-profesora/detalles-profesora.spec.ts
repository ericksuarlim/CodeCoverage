import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DetallesProfesoraComponent } from "./detalles-profesora.component";

fdescribe("Profesora Vista Component", () => {
  
  let component: DetallesProfesoraComponent;
  let fixture: ComponentFixture<DetallesProfesoraComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DetallesProfesoraComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesProfesoraComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

    it("Creacion Componente Profesora", () => {
        expect(component).toBeTruthy();
    });

    it("Testear Creacion de NgOnInit Profesoras", () => {
        expect(component.ngOnInit()).toBeTruthy();
    });

    it("Dirigir a editar profesora desde Profesora", () => {
        expect(component.editarProfesora(2)).toBeTruthy();
    });

    it("Eliminar Profesora", () => {
        const profesora ={
            id: "",
            nombres:"",
            apellidos:"",
            celular: "",
            telefono:"",
            correoElectronico:""
        }
        expect(component.eliminarProfesora(profesora)).toBeTruthy();
    });

    
});