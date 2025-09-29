import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkForm } from '../../models/work-forms/work-forms.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkFormsService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/workForms';

  constructor(private http : HttpClient){}

  getWorkForms(){
    return this.http.get(this.apiURL);
  }

  getWorkForm(id: number): Observable<WorkForm>{
    return this.http.get<WorkForm>(`${this.apiURL}/${id}`);
  }

  addWorkForm(workForm: WorkForm): Observable<WorkForm> {
    return this.http.post<WorkForm>(this.apiURL, workForm);
  }
 
  updateWorkForm(workForm: WorkForm): Observable<WorkForm> {
    return this.http.put<WorkForm>(`${this.apiURL}/${workForm.work_form_id}`, {workForm});
  }

  deleteWorkForm(id: number){
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
