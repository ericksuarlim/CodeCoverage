import { RouterTestingModule } from "@angular/router/testing";
import { EstadosComponent } from "../estados/estados.component";
import { ProfesorasService } from "../../services/profesoras.service";
import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { Tratamiento } from "../../models/tratamiento.model";
import { TratamientosComponent } from "./tratamientos.component";
import { TratamientosService } from "src/app/services/tratamientos.service";

const mockTratamientosService = {
  tratamientos: [
    {
      id: "1",
      tratamiento: "Musicoterapia",
      descripcion: "Terapia con musica",
    },
    {
      id: "2",
      tratamiento: "Terapia del habla",
      descripcion: "Aprende a vocalizar",
    },
    {
      id: "3",
      tratamiento: "Motricidad asistida",
      descripcion: "Ayuda al estudiante a mejorar la motricidad",
    },
  ],
  obtenerTratamientos(): Tratamiento[] {
    return this.tratamientos;
  },
  eliminarTratamiento(tratamiento: Tratamiento): void {
    this.tratamientos = this.tratamientos.filter(
      (t) => t.id !== tratamiento.id
    );
  },
};
fdescribe("ProfesorasComponent", () => {
  let component: TratamientosComponent;
  let fixture: ComponentFixture<TratamientosComponent>;
  let de: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TratamientosComponent],
      providers: [
        { provide: TratamientosService, useValue: mockTratamientosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TratamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return tratamientos", async () => {
    const result = await component.tratamientosService.obtenerTratamientos();
    expect(result).toBeTruthy();
    expect(result.length).toBe(3);
  });

  it("should delete estados", async () => {
    component.eliminarTratamiento({
      id: "2",
      tratamiento: "Terapia del habla",
      descripcion: "Aprende a vocalizar",
    });
    const result = await component.tratamientosService.obtenerTratamientos();
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBe(2);
  });
});
