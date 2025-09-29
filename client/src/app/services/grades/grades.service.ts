import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/grades';

  constructor(private http : HttpClient){}

  getGrades(){
    return this.http.get(this.apiURL);
  }
}
