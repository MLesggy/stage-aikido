import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DivRelevance } from '../../models/div-relevance/div-relevance.models';


@Injectable({
  providedIn: 'root'
})

export class DivRelevanceService {

  private apiURL = 'http://localhost:8000/api/divRelevance?include=stories,images,milestones';
  private apiURL2 = 'http://localhost:8000/api/divRelevance';

  constructor(private http: HttpClient) { }

  addDivRelevance(divRelevance: DivRelevance) {
    const payload = Object.fromEntries(
      Object.entries({
        div_relevance_image_id: divRelevance.div_relevance_image_id,
        div_relevance_story_id: divRelevance.div_relevance_story_id,
        div_relevance_milestone_id: divRelevance.div_relevance_milestone_id
      }).filter(([_, value]) => value !== -1)
    );

    return this.http.post<DivRelevance>(this.apiURL2, payload);
  }

  getDivRelevance() {
    return this.http.get(this.apiURL);
  }

  deleteDivRelevanceStory(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  updateDivRelevanceStory(divRelevance: DivRelevance): Observable<DivRelevance> {
    return this.http.put<DivRelevance>(`${this.apiURL}/${divRelevance.div_relevance_id}`, divRelevance, {
    });
  }
}
