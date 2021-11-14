import { DebugElement } from "@angular/core";
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DetallesEstudianteComponent } from "./detalles-estudiante.component";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

describe("Detalles Estudiantes Component", () => {
  let component: DetallesEstudianteComponent;
  let fixture: ComponentFixture<DetallesEstudianteComponent>;
  let de: DebugElement;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DetallesEstudianteComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("editar estudiante lleva a la ruta", fakeAsync(() => {
    var call = component.editarEstudiante(1);
    var expected = router.navigate([`/form-estudiantes/1`]);
    tick();
    expect(call).toBe(expected);
  }));
});
