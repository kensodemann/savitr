import { Injectable } from '@angular/core';
import { addWeeks, format, setDay, startOfDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {}

  currentBeginDate(): Date {
    // The "Date.now()" bit just makes testing easier
    const d = new Date(Date.now());
    return startOfDay(setDay(d, 0));
  }

  beginDates(): Array<Date> {
    const dt = this.currentBeginDate();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      dates.push(addWeeks(dt, i));
    }
    return dates;
  }

  weekDays(dt: Date): Array<Date> {
    return [
      startOfDay(setDay(dt, 0)),
      startOfDay(setDay(dt, 1)),
      startOfDay(setDay(dt, 2)),
      startOfDay(setDay(dt, 3)),
      startOfDay(setDay(dt, 4)),
      startOfDay(setDay(dt, 5)),
      startOfDay(setDay(dt, 6))
    ];
  }

  format(dt: Date): string {
    return format(dt, 'yyyy-MM-dd');
  }
}
