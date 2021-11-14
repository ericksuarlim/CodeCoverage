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

  // xit(`should have as title 'avanza'`, () => {
  //   expect(component.title).toEqual("avanza");
  // });

  it("should be at homepage", () => {
    const url = component.router.url;
    const enPaginaPrincipal = component.enPaginaPrincipal();
    if (url === "/home") {
      expect(enPaginaPrincipal).toBeTruthy();
    } else {
      expect(enPaginaPrincipal).toBeFalsy();
    }
  });
  it("should be at graphics", () => {
    const url = component.router.url;
    const enGraficos = component.mostrarNavbarGraficos();
    if (url == "/graphic-estudiantes" || url == "/graphic-sesiones") {
      expect(enGraficos).toBeTruthy();
    } else {
      expect(enGraficos).toBeFalsy();
    }
  });
  it("should not be at graphics", () => {
    const url = component.router.url;
    const noEnGraficos = component.noEstaEnGraficos();
    if (url != "/graphic-estudiantes" && url != "/graphic-sesiones") {
      expect(noEnGraficos).toBeTruthy();
    } else {
      expect(noEnGraficos).toBeFalsy();
    }
  });
  it("should show Navbar", () => {
    const url = component.router.url;
    const noEnGraficos = component.mostrarNavbar();
    if (
      url != "/home" &&
      url != "/" &&
      url != "/crear-cuenta" &&
      !url.includes("/cambiar-clave") &&
      url != "/graphic-estudiantes" &&
      url != "/graphic-sesiones"
    ) {
      expect(noEnGraficos).toBeTruthy();
    } else {
      expect(noEnGraficos).toBeFalsy();
    }
  });
});
