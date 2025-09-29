import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {

  private apiURL = 'http://localhost:8000/api/milestones';

  constructor(private http: HttpClient) { }

  getMilestones(){
    return this.http.get(this.apiURL);
  }
}
