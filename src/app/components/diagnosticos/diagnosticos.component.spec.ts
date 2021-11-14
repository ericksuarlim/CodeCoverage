import { RouterTestingModule } from "@angular/router/testing";
import { DiagnosticosComponent } from "../diagnosticos/diagnosticos.component";
import { DiagnosticosService } from "../../services/diagnosticos.service";
import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { Diagnostico } from "../../models/diagnostico.model";

const mockDiagnosticosService = {
  diagnosticos: [
    {
      id: "1",
      codigoColor: "#fffff",
      color: 1,
      diagnostico: "Rojo",
    },
    {
      id: "2",
      codigoColor: "#000000",
      color: 2,
      diagnostico: "Negro",
    },
  ],
  obtenerDiagnosticos(): Diagnostico[] {
    return this.diagnosticos;
  },
  eliminarDiagnostico(diagnostico: Diagnostico): void {
    this.diagnosticos = this.diagnosticos.filter(
      (d) => d.id !== diagnostico.id
    );
  },
};

describe("DiagnosticosComponent", () => {
  let component: DiagnosticosComponent;
  //   let service: DiagnosticosService;
  let fixture: ComponentFixture<DiagnosticosComponent>;
  let de: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DiagnosticosComponent],
      providers: [
        { provide: DiagnosticosService, useValue: mockDiagnosticosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return diagnosticos", async () => {
    const result = await component.diagnosticosService.obtenerDiagnosticos();
    expect(result).toBeTruthy();
    expect(result.length).toBe(2);
  });

  it("should delete diagnosticos", async () => {
    component.eliminarDiagnostico({
      id: "1",
      codigoColor: "#fffff",
      color: 1,
      diagnostico: "Rojo",
    });
    const result = await component.diagnosticosService.obtenerDiagnosticos();
    expect(result.length).toBe(1);
  });
});
