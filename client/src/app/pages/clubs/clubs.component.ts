import { Component, OnInit } from '@angular/core';
import { Club } from '../../models/clubs/clubs.models';
import { ClubService } from '../../services/clubs/clubs.service';
import { AddressService } from '../../services/address/adress.service';
import { ClubSchedulesService } from '../../services/club-schedules/club-schedules.service';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../services/images/images.service';

@Component({
  selector: 'app-clubs',
  imports: [CommonModule],
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css'],
})

export class ClubsComponent implements OnInit {
  clubs!: Club[];

  //  Quand on crée l'instance on importe le service Clubservice pour recup le json
  constructor(private clubservice: ClubService, public addressService: AddressService, public clubSchedulesService: ClubSchedulesService, public imagesService: ImagesService) {}

  // Quand la page se créer, on hydrate les clubs avec le json
  ngOnInit(): void {
    this.getClubs();
  }

  // on hydrate les clubs
  getClubs() {
    this.clubservice.getClubs().subscribe((clubsData: any) => {
      this.clubs = clubsData.map((clubsData: any) => {
        // creer une nouvelle instance de club
        const club = new Club();
        Object.assign(club, clubsData);
        return club;
      });
      this.imagesService.processEntitiesImages(
        this.clubs, (club: Club) => club.club_images
      );
    });
  }

  // Fonction qui permet de filtrer les liens de recommandation par ID (avec itération dans le tableau de liens)
  getClubById(clubId: number): Club[] {
    return this.clubs.filter(item => item.club_id === clubId);
  }

  goSite(club: string){
      window.open(club, '_blank'); 
  }
}
