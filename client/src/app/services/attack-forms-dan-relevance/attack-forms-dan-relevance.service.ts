import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttackFormDanRelevance } from '../../models/attack-forms-dan-relevance/attack-forms-dan-relevance.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttackFormsDanRelevanceService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/attackFormsDanRelevance';

  constructor(private http : HttpClient){}

  getAttackFormsDanRelevance(){
    return this.http.get(this.apiURL);
  }

  addAttackFormDanRelevance(attackFormDanRelevance: AttackFormDanRelevance): Observable<AttackFormDanRelevance> {
    return this.http.post<AttackFormDanRelevance>(this.apiURL, attackFormDanRelevance);
  }
 
  updateAttackFormDanRelevance(attackFormId: number, danGradeIds: number[]): Observable<AttackFormDanRelevance> {
    return this.http.put<AttackFormDanRelevance>(`${this.apiURL}/${attackFormId}`, {attackFormId, danGradeIds});
  }

  deleteAttackFormDanRelevance(id: number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
