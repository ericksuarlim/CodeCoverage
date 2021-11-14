import { RouterTestingModule } from "@angular/router/testing";
import { EstadosComponent } from "../estados/estados.component";
import { EstadosService } from "../../services/estados.service";
import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { Estado } from "../../models/estado.model";

const mockEstadosService = {
  estados: [
    {
      id: "1",
      numEstado: "1",
      estado: "Asiste",
    },
    {
      id: "2",
      numEstado: "2",
      estado: "No Asiste",
    },
  ],
  obtenerEstados(): Estado[] {
    return this.estados;
  },
  eliminarEstado(estado: Estado): void {
    this.estados = this.estados.filter((e) => e.id !== estado.id);
  },
};
fdescribe("EstadosComponent", () => {
  let component: EstadosComponent;
  //   let service: DiagnosticosService;
  let fixture: ComponentFixture<EstadosComponent>;
  let de: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EstadosComponent],
      providers: [{ provide: EstadosService, useValue: mockEstadosService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return estados", async () => {
    const result = await component.estadosService.obtenerEstados();
    expect(result).toBeTruthy();
    expect(result.length).toBe(2);
  });

  it("should delete estados", async () => {
    component.eliminarEstado({
      id: "1",
      numEstado: "1",
      estado: "Asiste",
    });
    const result = await component.estadosService.obtenerEstados();
    expect(result.length).toBe(1);
  });

  it("editarEstado", () => {
    var result = component.editarEstado(1);
    expect(result).toBeTruthy();
  });
  
  it("ordenarTabla", () => {
      var result = component.ordenarTabla();
      expect(result).toBeTruthy();
  });
});
