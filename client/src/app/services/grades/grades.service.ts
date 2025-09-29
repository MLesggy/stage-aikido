import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiURL = 'http://localhost:8000/api/grades';

  constructor(private http : HttpClient){}

  getGrades(){
    return this.http.get(this.apiURL);
  }
}
