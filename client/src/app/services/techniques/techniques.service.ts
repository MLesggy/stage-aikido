import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Technique } from '../../models/techniques/techniques.models';
import { Observable } from 'rxjs';
import { AttackFormsService } from '../attack-forms/attack-forms.service';
import { WorkFormsService } from '../work-forms/work-forms.service';

@Injectable({
  providedIn: 'root'
})

export class TechniquesService {
  private apiURL = 'http://localhost:8000/api/techniques';

  constructor(private http : HttpClient, private attackFormsService: AttackFormsService, private workFormsService: WorkFormsService){}

  getTechniques(){
    return this.http.get(this.apiURL);
  }

  addTechnique(technique: Technique): Observable<Technique> {
    return this.http.post<Technique>(this.apiURL, technique);
  }
 
  updateTechnique(technique: Technique): Observable<Technique> {
    return this.http.put<Technique>(`${this.apiURL}/${technique.technique_id}`, {technique});
  }

  deleteTechnique(id: number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  public getKuyByNumber(number: number){
    switch (number) {
      case 1:
        return '5eme Kuy';
      case 2:
        return '4eme Kuy';
      case 3:
        return '3eme Kuy';
      case 4:
        return '2eme Kuy';
      case 5:
        return '1eme Kuy';
      case 6:
        return 'Buki Waza';
      default:
        return 'Erreur';
    }
  }

  getWonderfullNameForTechnique(techniques: Technique[]): Technique[] {
    return techniques
      .map(technique => ({...technique, technique_wonderfull_name: `${this.getKuyByNumber(technique.grade_id)}, FA: ${technique.attack_form_name}, FT: ${technique.work_form_name}, ${technique.technique_move}`}))
      .sort((a, b) => a.technique_wonderfull_name.localeCompare(b.technique_wonderfull_name));
  }
}
