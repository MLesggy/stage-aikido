import { Injectable } from '@angular/core';
import { ClubSchedule } from '../../models/club-schedules/club-schedules.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Club } from '../../models/clubs/clubs.models';

@Injectable({
  providedIn: 'root'
})
export class ClubSchedulesService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/clubs';

  constructor(private http: HttpClient) { }

  getClubSchedulesForClub(clubId: number) {
    return this.http.get(`${this.apiURL}/${clubId}/club-schedules`);
  }

  getClubSchedule(clubId: number, clubScheduleId: number) {
    return this.http.get(`${this.apiURL}/${clubId}/club-schedules/${clubScheduleId}`);
  }
  
  addScheduleForClub(clubId: number, schedule: ClubSchedule): Observable<ClubSchedule> {
    //here we do a little bit of format conversion, since in database schedules are stocked as HH:MM:SS and actually, schedules are Date object
    schedule.club_schedule_start_time = this.dateToTimeString(schedule.club_schedule_start_time as Date)
    schedule.club_schedule_end_time = this.dateToTimeString(schedule.club_schedule_end_time as Date)
    return this.http.post<ClubSchedule>(`${this.apiURL}/${clubId}/club-schedules`, schedule);
  }

  updateScheduleForClub(clubId: number, schedule: ClubSchedule): Observable<ClubSchedule> {
    //here we do a little bit of format conversion, since in database schedules are stocked as HH:MM:SS and actually, schedules are Date object
    schedule.club_schedule_start_time = this.dateToTimeString(schedule.club_schedule_start_time as Date)
    schedule.club_schedule_end_time = this.dateToTimeString(schedule.club_schedule_end_time as Date)
    return this.http.put<ClubSchedule>(`${this.apiURL}/${clubId}/club-schedules/${schedule.club_schedule_id}`, schedule);
  }

  deleteScheduleForClub(clubId: number, clubScheduleId: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${clubId}/club-schedules/${clubScheduleId}`);
  }

  public getDayFromNumber(dayNumber: number){
    switch (dayNumber) {
      case 1:
        return "Lundi";
      case 2:
        return "Mardi";
      case 3:
        return "Mercredi";
      case 4:
        return "Jeudi";
      case 5:
        return "Vendredi";
      case 6:
        return "Samedi";
      case 7:
        return "Dimanche";
    }
    return "ErrorBadDay";
  }

  // convertir HH:MM en Date
  public timeStringToDate(timeStr: string): Date  {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Convertit une date en TimeString 
  public dateToTimeString(date: Date): string {
    if (!date) return '';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }
}
