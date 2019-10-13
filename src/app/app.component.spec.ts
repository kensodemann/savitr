import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { ApplicationService } from '@app/services';
import { createAngularFireAuthMock, createNavControllerMock } from 'test/mocks';
import { createApplicationServiceMock } from '@app/services/mocks';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        {
          provide: ApplicationService,
          useFactory: createApplicationServiceMock
        },
        { provide: NavController, useFactory: createNavControllerMock }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].textContent).toContain('Current');
    expect(menuItems[1].textContent).toContain('History & Planning');
    expect(menuItems[2].textContent).toContain('Exercises');
    expect(menuItems[3].textContent).toContain('About');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(AppComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual(
      '/workout/current'
    );
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual(
      '/workout/history'
    );
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual(
      '/exercises'
    );
    expect(menuItems[3].getAttribute('ng-reflect-router-link')).toEqual(
      '/about'
    );
  });

  describe('on init', () => {
    it('registers for updates', () => {
      const application = TestBed.get(ApplicationService);
      const fixture = TestBed.createComponent(AppComponent);
      expect(application.registerForUpdates).not.toHaveBeenCalled();
      fixture.detectChanges();
      expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
    });
  });

  describe('changing the user', () => {
    beforeEach(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });

    it('does not navigate if there is a user', () => {
      const angularFireAuth = TestBed.get(AngularFireAuth);
      const navController = TestBed.get(NavController);
      angularFireAuth.authState.next({ id: 42 });
      expect(navController.navigateRoot).not.toHaveBeenCalled();
    });

    it('navigates to login if there is no user', () => {
      const angularFireAuth = TestBed.get(AngularFireAuth);
      const navController = TestBed.get(NavController);
      angularFireAuth.authState.next();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
    });
  });
});
