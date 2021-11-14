import { DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ProfesorasComponent } from "./profesoras.component";

fdescribe("Profesoras Component Principal", () => {
  
  let component: ProfesorasComponent;
  let fixture: ComponentFixture<ProfesorasComponent>;
  let de: DebugElement;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProfesorasComponent],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorasComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it("Creacion Componente Lista Profesoras", () => {
    expect(component).toBeTruthy();
  });

  it("Testear Creacion de NgOnInit Lista Profesoras", () => {
    expect(component.ngOnInit()).toBeTruthy();
  });

  
});
