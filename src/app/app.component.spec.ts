import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { Router } from "@angular/router";

fdescribe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  xit(`should have as title 'avanza'`, () => {
    expect(component.title).toEqual("avanza");
  });

  it("esta en pagina principal", () => {
    const url = component.router.url;
    const enPaginaPrincipal = component.enPaginaPrincipal();
    if (url === "/home") {
      expect(enPaginaPrincipal).toBeTruthy();
    } else {
      expect(enPaginaPrincipal).toBeFalsy();
    }
  });
});
