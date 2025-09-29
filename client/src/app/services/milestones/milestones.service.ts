import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {

  private apiURL = 'https://stage-aikido-production.up.railway.app/api/milestones';

  constructor(private http: HttpClient) { }

  getMilestones(){
    return this.http.get(this.apiURL);
  }
}
