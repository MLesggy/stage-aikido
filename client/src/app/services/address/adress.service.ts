import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../../models/address/address.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiURL = 'https://stage-aikido-production.up.railway.app/api/address';

  constructor(private http: HttpClient) {}

  getAddress() {
    return this.http.get(this.apiURL);
  }

  getSingleAddress(id: number) {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiURL, address);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiURL}/${address.address_id}`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  // Give an address object containing street, complement?, postalCode, city and country.
  // Return the perfectly formated address <3
  getFormatedAddress(address: Address): string{
    let part = [
      address.address_street,
      address.address_complement,
      address.address_postal_code,
      address.address_city,
      address.address_country,
      ];

    return part.filter(part => part && part.trim()).join(', ');
  }
}
