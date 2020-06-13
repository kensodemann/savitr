import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { ApplicationService } from '@app/services';
import { load as loadExercises } from './store/actions/exercise.actions';
import { loginChanged } from './store/actions/auth.actions';
import { State } from './store/reducers';
import { createAngularFireAuthMock, createNavControllerMock } from '@test/mocks';
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
        { provide: NavController, useFactory: createNavControllerMock },
        provideMockStore<State>()
      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].textContent).toContain('Current');
    expect(menuItems[1].textContent).toContain('History & Planning');
    expect(menuItems[2].textContent).toContain('Exercises');
    expect(menuItems[3].textContent).toContain('About');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(4);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/workout/current');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/workout/history');
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/exercises');
    expect(menuItems[3].getAttribute('ng-reflect-router-link')).toEqual('/about');
  });

  describe('on init', () => {
    it('registers for updates', () => {
      const application = TestBed.inject(ApplicationService);
      const fixture = TestBed.createComponent(AppComponent);
      expect(application.registerForUpdates).not.toHaveBeenCalled();
      fixture.detectChanges();
      expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
    });

    it('dispatches the load of the exercises', () => {
      const store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(loadExercises());
    });
  });

  describe('changing the user', () => {
    let store: Store;
    beforeEach(() => {
      store = TestBed.inject(Store);
      store.dispatch = jest.fn();
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      (store.dispatch as any).mockClear();
    });

    describe('on login', () => {
      it('does not navigate', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next({ id: 42, email: 'test@testty.com' });
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });

      it('dispatches the user change and load', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next({ id: 42, email: 'test@testty.com' });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(loginChanged({ email: 'test@testty.com' }));
      });
    });

    describe('on logout', () => {
      it('navigates to login', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        const navController = TestBed.inject(NavController);
        (angularFireAuth.authState as any).next(null);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['login']);
      });

      it('dispatches the user change', () => {
        const angularFireAuth = TestBed.inject(AngularFireAuth);
        (angularFireAuth.authState as any).next(null);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(loginChanged({ email: null }));
      });
    });
  });
});
