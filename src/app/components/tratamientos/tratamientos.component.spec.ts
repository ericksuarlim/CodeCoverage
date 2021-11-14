import { DebugElement } from "@angular/core";
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TratamientosComponent } from "./tratamientos.component";
import { TratamientosService } from "../../services/tratamientos.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
describe("Tratamientos Component", () => {
  let component: TratamientosComponent;
  let service: TratamientosService;
  let fixture: ComponentFixture<TratamientosComponent>;
  let de: DebugElement;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TratamientosComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TratamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
  });
  it("method should be called", () => {
    spyOn(service, "obtenerTratamientos");
    fixture.detectChanges(); // trigger ngOnInit here

    expect(service.obtenerTratamientos).toHaveBeenCalled();
  });
});
