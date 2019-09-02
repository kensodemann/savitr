import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';

describe('DateService', () => {
  beforeEach(() => {
    jasmine.clock().install();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service).toBeTruthy();
  });

  describe('current begin date', () => {
    it('returns the Sunday before the current date', () => {
      const service: DateService = TestBed.get(DateService);
      jasmine.clock().mockDate(new Date('2019-07-03T14:23:35'));
      expect(service.currentBeginDate()).toEqual(
        new Date('2019-06-30T00:00:00')
      );
    });

    it('returns today if today is a Sunday', () => {
      const service: DateService = TestBed.get(DateService);
      jasmine.clock().mockDate(new Date('2019-07-07:23:35.000'));
      expect(service.currentBeginDate()).toEqual(
        new Date('2019-07-07T00:00:00.000')
      );
    });
  });

  describe('beginDates', () => {
    it('returns the current begin date plus 4 more', () => {
      const service: DateService = TestBed.get(DateService);
      jasmine.clock().mockDate(new Date('2019-07-03T14:23:35'));
      expect(service.beginDates()).toEqual([
        new Date('2019-06-30T00:00:00'),
        new Date('2019-07-07T00:00:00'),
        new Date('2019-07-14T00:00:00'),
        new Date('2019-07-21T00:00:00'),
        new Date('2019-07-28T00:00:00')
      ]);
    });

    it('handles today being Sunday', () => {
      const service: DateService = TestBed.get(DateService);
      jasmine.clock().mockDate(new Date('2019-07-07:23:35.000'));
      expect(service.beginDates()).toEqual([
        new Date('2019-07-07T00:00:00'),
        new Date('2019-07-14T00:00:00'),
        new Date('2019-07-21T00:00:00'),
        new Date('2019-07-28T00:00:00'),
        new Date('2019-08-04T00:00:00')
      ]);
    });
  });

  describe('weekDays', () => {
    it('returns an array of the days containing the week', () => {
      const service: DateService = TestBed.get(DateService);
      expect(service.weekDays(new Date('2019-07-17T14:13:12.000-0500'))).toEqual([
        new Date('2019-07-14T00:00:00'),
        new Date('2019-07-15T00:00:00'),
        new Date('2019-07-16T00:00:00'),
        new Date('2019-07-17T00:00:00'),
        new Date('2019-07-18T00:00:00'),
        new Date('2019-07-19T00:00:00'),
        new Date('2019-07-20T00:00:00')
      ]);
    });

    it('works if the first day of the week is passed', () => {
      const service: DateService = TestBed.get(DateService);
      expect(service.weekDays(new Date('2019-08-04T00:00:00'))).toEqual([
        new Date('2019-08-04T00:00:00'),
        new Date('2019-08-05T00:00:00'),
        new Date('2019-08-06T00:00:00'),
        new Date('2019-08-07T00:00:00'),
        new Date('2019-08-08T00:00:00'),
        new Date('2019-08-09T00:00:00'),
        new Date('2019-08-10T00:00:00')
      ]);
    });

    it('works if the last day of the week is passed', () => {
      const service: DateService = TestBed.get(DateService);
      expect(service.weekDays(new Date('2019-07-20T23:13:12.000-0500'))).toEqual([
        new Date('2019-07-14T00:00:00'),
        new Date('2019-07-15T00:00:00'),
        new Date('2019-07-16T00:00:00'),
        new Date('2019-07-17T00:00:00'),
        new Date('2019-07-18T00:00:00'),
        new Date('2019-07-19T00:00:00'),
        new Date('2019-07-20T00:00:00')
      ]);
    });
  });

  describe('format', () => {
    it('formats the date to the ISO date-only format', () => {
      const service: DateService = TestBed.get(DateService);
      expect(service.format(new Date('2019-07-03T14:23:35'))).toEqual(
        '2019-07-03'
      );
      expect(service.format(new Date('2019-07-05T00:00:00'))).toEqual(
        '2019-07-05'
      );
    });
  });
});
