import { RouterTestingModule } from "@angular/router/testing";
import { EstadosComponent } from "../estados/estados.component";
import { ProfesorasService } from "../../services/profesoras.service";
import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { Profesora } from "../../models/profesora.model";
import { ProfesorasComponent } from "./profesoras.component";

const mockProfesorasService = {
  profesoras: [
    {
      id: "1",
      nombres: "Ana",
      apellidos: "Lopez",
      celular: "70712345",
      telefono: "42222222",
      correoElectronico: "analopez@gmail.com",
    },
  ],
  obtenerProfesoras(): Profesora[] {
    return this.profesoras;
  },
  eliminarProfesora(profesora: Profesora): void {
    this.profesoras = this.profesoras.filter((p) => p.id !== profesora.id);
  },
};
fdescribe("ProfesorasComponent", () => {
  let component: ProfesorasComponent;
  let fixture: ComponentFixture<ProfesorasComponent>;
  let de: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProfesorasComponent],
      providers: [
        { provide: ProfesorasService, useValue: mockProfesorasService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return profesoras", async () => {
    const result = await component.profesorasService.obtenerProfesoras();
    expect(result).toBeTruthy();
    expect(result.length).toBe(1);
  });

  it("should delete estados", async () => {
    component.eliminarProfesora({
      id: "1",
      nombres: "Ana",
      apellidos: "Lopez",
      celular: "70712345",
      telefono: "42222222",
      correoElectronico: "analopez@gmail.com",
    });
    const result = await component.profesorasService.obtenerProfesoras();
    expect(result.length).toBe(0);
  });
});
