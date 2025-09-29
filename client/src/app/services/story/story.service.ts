import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../../models/stories/stories.models';
import { DivRelevance } from '../../models/div-relevance/div-relevance.models';


@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiURL = 'http://localhost:8000/api/stories';

  constructor(private http: HttpClient) { }

  getStories() {
    return this.http.get(this.apiURL);
  }
  getStoriesByDivRelevanceId(id: number) {
    return this.http.get(this.apiURL);
  }

  addStory(story: Story): Observable<Story> {
    return this.http.post<Story>(this.apiURL, story);
  }
  addDivRelevance(divRelevance: DivRelevance) {
    return this.http.post<DivRelevance>(this.apiURL, divRelevance);
  }
  updateStory(story: Story): Observable<Story> {
    return this.http.put<Story>(`${this.apiURL}/${story.story_id}`, story);
  }

  deleteStory(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

}
