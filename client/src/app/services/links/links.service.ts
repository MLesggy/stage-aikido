import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Link } from '../../models/links/links.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private apiURL = 'https://stage-aikido-production.up.railway.app/api/links';
  private apiURL2 = 'https://stage-aikido-production.up.railway.app/api/recommendations';

  constructor(private http: HttpClient) {}

  getLinks() {
    return this.http.get(this.apiURL);
  }

  getRecommendations() {
    return this.http.get(this.apiURL2);
  }

  addLink(link: Link): Observable<Link> {
    return this.http.post<Link>(this.apiURL, link);
  }

  updateLink(link: Link): Observable<Link> {
    return this.http.put<Link>(`${this.apiURL}/${link.link_id}`, link);
  }

  deleteLink(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

}
