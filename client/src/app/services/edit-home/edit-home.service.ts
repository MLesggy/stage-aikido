import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HomeContent } from "../../models/home-contents/home-contents.models";

@Injectable({
  providedIn: 'root'
})

export class EditHomeService {

  private apiURL = 'https://stage-aikido-production.up.railway.app/api/homeData';

  constructor(private http: HttpClient) { }

  getContent() {
    return this.http.get(this.apiURL);
  }

  updateContent(content: HomeContent) {
    return this.http.put<HomeContent>(`${this.apiURL}`, {
      home_data_id: content.home_data_id,
      home_data_subtitle: content.home_data_subtitle,
      home_data_title: content.home_data_title,
      home_data_video_url: content.home_data_video_url,
      image_id: content.image_id
    })
  }
}

