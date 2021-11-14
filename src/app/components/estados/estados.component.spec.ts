import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EstadosComponent } from "./estados.component";

describe("Form Sesiones Component", () =>{
    let component: EstadosComponent;
    let fixture: ComponentFixture<EstadosComponent>;
    let de: DebugElement;
    beforeEach(async () =>{
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [EstadosComponent],
        }).compileComponents();
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