import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormSesionesComponent } from "./form-sesiones.component";

describe("Form Sesiones Component", () =>{
    let component: FormSesionesComponent;
    let fixture: ComponentFixture<FormSesionesComponent>;
    let de: DebugElement;
    beforeEach(async () =>{
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [FormSesionesComponent],
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormSesionesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        de = fixture.debugElement;
    });
    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("validarParteMedia", () => {
        var result = component.validarParteMedia();
        expect(result).toBe(false);
    });
    it("validarSesion", () => {
        var result = component.validarSesion();
        expect(result).toBe(false);
    });
    it("abrirModalExito", () => {
        var result = component.abrirModalExito();
        expect(result).toBeTruthy();
    });
    it("abrirModalError", () => {
        var result = component.abrirModalError();
        expect(result).toBeTruthy();
    });
    it("guardarSesion", () => {
        var result = component.guardarSesion();
        expect(result).toBeTruthy();
    });
    it("actalizarMontos", () => {
        var result = component.actalizarMontos();
        expect(result).toBeFalsy();
    });
    it("IrEditarEstudiante", () => {
        var result = component.IrEditarEstudiante();
        expect(result).toBeTruthy();
    });

    it("obtenerEstudiantes", () => {
        var result = component.obtenerEstudiantes();
        expect(result).toBeTruthy();
    });
    it("agregarAsistencia", () => {
        var result = component.agregarAsistencia();
        expect(result).toBeTruthy();
    });
    it("actalizarAsistencias", () => {
        var result = component.actalizarAsistencias(1);
        expect(result).toBeFalsy();
    });
});