import { Component, OnInit, OnDestroy } from '@angular/core';
import { Seminar } from '../../models/seminars/seminars.models';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/map/map.component';
import { MapService } from '../../services/map/map.service';
import { Subscription } from 'rxjs';
import { AddressService } from '../../services/address/adress.service';
import { ImagesService } from '../../services/images/images.service';

type Coordinates = [number, number];

@Component({
  selector: 'app-seminar-view',
  imports: [CommonModule, MapComponent],
  templateUrl: './seminar-view.component.html',
  styleUrl: './seminar-view.component.css',
})
export class SeminarViewComponent implements OnInit {
  seminar!: Seminar;
  seminarFullAdress: string = '';
  seminarLocation?: Coordinates;
  
  // Using subscriptions so 
  private subscriptions: Subscription[] = [];

  constructor(
    private seminarsService: SeminarsService,
    private addressService: AddressService,
    private mapService: MapService,
    private route: ActivatedRoute,
    private router: Router,
    public imagesService: ImagesService
  ) {}

  ngOnInit(): void {
    this.hydrateSeminarData();
  }
  

  // Hydration
  private hydrateSeminarData(): void {
    const paramSub = this.route.paramMap.subscribe((params) => {
      const seminarId = params.get('id');
      if (!seminarId) {
        this.router.navigate(['/seminars']); // No id ? wtf go back from where you come from.
        return;
      }

      const seminarSub = this.seminarsService
        .getSeminar(parseInt(seminarId))
        .subscribe({
          next: (seminarData) => {
            this.seminar = seminarData as Seminar;
            
            // If there is an image, initialise url
            if (this.hasValidImages()) {
              this.imagesService.processImage(this.seminar.seminar_image[0]); // On appelle processImage ICI
            }
            
            // Formating and geocoding the address
            this.seminarFullAdress = this.addressService.getFormatedAddress(this.seminar.seminar_address!);
            
            this.geolocateSeminar();
          },
          error: (error) => {
            alert('Error while load the seminar');
          }
        });
      //adding this subscription to the list
      this.subscriptions.push(seminarSub);
    });
    //adding this subscription to the list
    this.subscriptions.push(paramSub);
  }

  //If there is valid image for the seminar
  private hasValidImages(): boolean {
    return !!(this.seminar?.seminar_image?.[0] && 
            this.seminar.seminar_image[0].image_id !== -1);
  }

  //geolocate the seminar and add the longitude / latitude to cache, so we don't use the api for everyload
  private geolocateSeminar(): void {
    const cachedCoordinates = this.seminarsService.seminarsLocation.get(this.seminar.seminar_id);
    
    if (cachedCoordinates) {
      this.seminarLocation = cachedCoordinates;
      return;
    }

    // We never geolocate this seminar, so we call the geolcoding api
    const city = this.seminar.seminar_address!.address_city;
    const mapSub = this.mapService.geocodeAddress(this.seminarFullAdress, city).subscribe({
      next: (coordinates) => {
        if (coordinates) {
          this.seminarLocation = coordinates;
          // Adding to the cache, se we wont calculate this again
          this.seminarsService.seminarsLocation.set(this.seminar.seminar_id, coordinates);
        } else {
          //console.log('Cant geolocate this address... By default the map should stay on Paris');
        }
      },
      error: () => {
        alert('Error of geocoding');
      }
    });
    //adding this subscription to the list
    this.subscriptions.push(mapSub);
  }
}