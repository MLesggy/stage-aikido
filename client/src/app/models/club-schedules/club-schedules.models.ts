export class ClubSchedule {
    club_schedule_id: number = -1;
    club_schedule_day_of_week : number = -1;
    club_schedule_start_time : Date | string = new Date();
    club_schedule_end_time : Date | string = new Date();
    club_schedule_notes : string = ''; 
    club_id: number = -1;
}