import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

import { ApplicationService } from './application.service';
import { Subject } from 'rxjs';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';

describe('ApplicationService', () => {
  let alert;
  beforeEach(() => {
    alert = createOverlayElementMock();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useFactory: () => ({
            available: new Subject()
          })
        },
        {
          provide: AlertController,
          useFactory: () => createOverlayControllerMock(alert)
        }
      ]
    });
  });

  it('should be created', () => {
    const service: ApplicationService = TestBed.get(ApplicationService);
    expect(service).toBeTruthy();
  });

  describe('registered for updates', () => {
    beforeEach(() => {
      alert.onDidDismiss.mockResolvedValue({ role: 'cancel' });
      const service: ApplicationService = TestBed.get(ApplicationService);
      service.registerForUpdates();
    });

    it('asks the user if they would like an update', () => {
      const update = TestBed.get(SwUpdate);
      const alertController = TestBed.get(AlertController);
      expect(alertController.create).not.toHaveBeenCalled();
      update.available.next();
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalled();
    });
  });
});
