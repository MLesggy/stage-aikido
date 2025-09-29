import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Club } from '../../models/clubs/clubs.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ClubService {
  private apiClub = 'https://stage-aikido-production.up.railway.app/api/clubs';

  constructor(private http: HttpClient) { }

  getClubs() {
    return this.http.get('https://stage-aikido-production.up.railway.app/api/clubs?include=images,address,schedules,links');
  }

  getClub(clubId: number) {
    return this.http.get(`${this.apiClub}/${clubId}`);
  }
  
  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>(this.apiClub, club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(`${this.apiClub}/${club.club_id}`, club);
  }

  deleteClub(id: number): Observable<any> {
    return this.http.delete(`${this.apiClub}/${id}`);
  }
}
