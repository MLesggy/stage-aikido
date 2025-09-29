import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seminar } from '../../models/seminars/seminars.models';
import { Observable } from 'rxjs';

type Coordinates = [number, number]; // Tuple [longitude, latitude]

@Injectable({
  providedIn: 'root',
})
export class SeminarsService {
  private apiURLgetAll = 'http://localhost:8000/api/seminars?include=address,images';
  private apiURLgetOne = 'http://localhost:8000/api/seminars/';
  private apiURL = 'http://localhost:8000/api/seminars';

  public seminarsLocation: Map<number, Coordinates> = new Map<
    number,
    Coordinates
  >();

  monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  constructor(private http: HttpClient) {}

  getSeminars() {
    return this.http.get(this.apiURLgetAll);
  }

  getSeminarsWithoutImages() {
    return this.http.get('http://localhost:8000/api/seminars?include=address');
  }

  getSeminar(id: number) {
    const url: string = `${this.apiURLgetOne}${id}?include=address,images`;
    return this.http.get(url);
  }

  getLocationById(id: number): any {
    return this.seminarsLocation.get(id);
  }

  public getSeminarsForMonth(seminars: Seminar[], month: number): Seminar[] {
    if (!seminars) return [];
      return seminars.filter((item) => new Date(item.seminar_start_time).getMonth() === month)
      .sort((a, b) => {
        const dateA = new Date(a.seminar_start_time).getTime();
        const dateB = new Date(b.seminar_start_time).getTime();
        return dateA - dateB;
      });
  }

  public getMonthNameFromNumber(monthNumber: number): string {
    return this.monthNames[monthNumber];
  }

  addSeminar(seminar: Seminar): Observable<Seminar> {
    return this.http.post<Seminar>(this.apiURL, seminar);
  }

  updateSeminar(seminar: Seminar): Observable<Seminar> {
    return this.http.put<Seminar>(`${this.apiURL}/${seminar.seminar_id}`, {
      seminar_title: seminar.seminar_title,
      seminar_start_time: seminar.seminar_start_time,
      seminar_end_time: seminar.seminar_end_time,
      seminar_description: seminar.seminar_description,
      seminar_price: seminar.seminar_price,
      seminar_professor: seminar.seminar_professor,
      seminar_email: seminar.seminar_email,
      seminar_phone: seminar.seminar_phone,
      address_id: seminar.address_id
    });
  }

  deleteSeminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}