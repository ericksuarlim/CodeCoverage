import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EstudiantesComponent } from "./estudiantes.component";

describe("Estudiantes Component", () => {
  let component: EstudiantesComponent;
  let fixture: ComponentFixture<EstudiantesComponent>;
  let de: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EstudiantesComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(EstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("fecha", () => {
    var result = component.mostrarBienLaFecha("2020-01-01");
    expect(result).toBe("01/01/2020");
  });
});
