import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { Subject } from 'rxjs';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  let alert: any;

  beforeEach(() => {
    alert = createOverlayElementMock();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useFactory: () => ({
            available: new Subject(),
          }),
        },
        {
          provide: AlertController,
          useFactory: () => createOverlayControllerMock(alert),
        },
      ],
    });
  });

  it('should be created', () => {
    const service: ApplicationService = TestBed.inject(ApplicationService);
    expect(service).toBeTruthy();
  });

  describe('registered for updates', () => {
    beforeEach(() => {
      alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      const service: ApplicationService = TestBed.inject(ApplicationService);
      service.registerForUpdates();
    });

    it('asks the user if they would like an update', () => {
      const update = TestBed.inject(SwUpdate);
      const alertController = TestBed.inject(AlertController);
      expect(alertController.create).not.toHaveBeenCalled();
      (update.available as any).next();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });
  });
});
