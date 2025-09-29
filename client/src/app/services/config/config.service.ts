import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly apiKeys = {
    geoapify: '0ae89aecb6254c6b98133e20d6096502'
  };

  getGeoapifyKey(): string {
    return this.apiKeys.geoapify;
  }
}