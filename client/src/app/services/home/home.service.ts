import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  private apiURL = 'https://stage-aikido-production.up.railway.app/api/homeData';

  constructor(private http: HttpClient) { }

  getContent() {
    return this.http.get(this.apiURL);
  }
}
