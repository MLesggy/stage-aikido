import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  private apiURL = 'http://localhost:8000/api/homeData';

  constructor(private http: HttpClient) { }

  getContent() {
    return this.http.get(this.apiURL);
  }
}
