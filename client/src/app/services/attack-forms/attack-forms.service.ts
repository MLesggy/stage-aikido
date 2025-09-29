import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttackForm } from '../../models/attack-forms/attack-forms.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttackFormsService {
  private apiURL = 'http://localhost:8000/api/attackForms';

  constructor(private http : HttpClient){}

  getAttackForms(){
    return this.http.get(this.apiURL);
  }

  getAttackForm(id: number): Observable<AttackForm>{
    return this.http.get<AttackForm>(`${this.apiURL}/${id}`);
  }

  addAttackForm(attackForm: AttackForm): Observable<AttackForm> {
    return this.http.post<AttackForm>(this.apiURL, attackForm);
  }
 
  updateAttackForm(attackForm: AttackForm): Observable<AttackForm> {
    return this.http.put<AttackForm>(`${this.apiURL}/${attackForm.attack_form_id}`, attackForm);
  }

  deleteAttackForm(id: number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
