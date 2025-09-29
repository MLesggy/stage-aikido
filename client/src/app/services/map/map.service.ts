import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config/config.service';
import { Observable, catchError, throwError, map } from 'rxjs';

// Définition correcte du type Coordinates
type Coordinates = [number, number]; // Tuple [longitude, latitude]

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private configService: ConfigService, private http: HttpClient) { }

  /**
   * Géolocalise une adresse sur la carte en utilisant Geoapify
   * @param address L'adresse à géocoder
   * @param city La ville (utilisée comme fallback)
   * @param checkCity Indique s'il faut chercher par ville ou par adresse
   * @returns Observable avec les coordonnées [longitude, latitude] ou undefined
   */
  public geocodeAddress(address: string, city: string, checkCity: boolean = false): Observable<Coordinates | undefined> {
    const apiKey = this.configService.getGeoapifyKey();
    const searchText = checkCity ? city : address;
    
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchText)}&apiKey=${apiKey}`;

    return this.http.get(url).pipe(
      map((response: any) => {
        // Vérification des données reçues
        if (response?.features?.length > 0 && 
            response.features[0].geometry?.coordinates) {
          
          // Extraction de longitude et latitude (API retourne [lon, lat])
          const coordinates = response.features[0].geometry.coordinates;
          return [coordinates[0], coordinates[1]] as Coordinates;
        } 
        
        // Si on a cherché par adresse et rien trouvé, on essaie par ville
        if (!checkCity) {
          // Ici, on devrait faire un appel récursif, mais on ne peut pas le faire directement
          // car nous sommes dans un Observable
          throw new Error('ADDRESS_NOT_FOUND');
        }
        
        return undefined;
      }),
      catchError((error) => {
        // Si c'est notre erreur personnalisée, on essaie avec la ville
        if (error.message === 'ADDRESS_NOT_FOUND' && !checkCity) {
          return this.geocodeAddress(address, city, true);
        }
        
        console.error('Erreur lors de l\'appel API:', error);
        return throwError(() => new Error('Erreur lors du géocodage'));
      })
    );
  }
}