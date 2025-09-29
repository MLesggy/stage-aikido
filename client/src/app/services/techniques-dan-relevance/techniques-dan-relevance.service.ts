import { Injectable } from '@angular/core';
import { TechniqueDanRelevance } from '../../models/techniques-dan-relevance/techniques-dan-relevance.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TechniquesDanRelevanceService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/techniquesDanRelevance';

  constructor(private http : HttpClient){}

  getTechniquesDanRelevance(){
    return this.http.get(this.apiURL);
  }

  addTechniqueDanRelevance(techniqueDanRelevance: TechniqueDanRelevance): Observable<TechniqueDanRelevance> {
    return this.http.post<TechniqueDanRelevance>(this.apiURL, techniqueDanRelevance);
  }
 
  updateTechniqueDanRelevance(techniqueId: number, danGradeIds: number[]): Observable<TechniqueDanRelevance> {
    return this.http.put<TechniqueDanRelevance>(`${this.apiURL}/${techniqueId}`, {techniqueId, danGradeIds});
  }

  deleteTechniqueDanRelevance(id: number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
