import { Component, OnInit } from '@angular/core';
import { LinksService } from '../../services/links/links.service';
import { Link } from '../../models/links/links.models';

@Component({
  selector: 'app-links',
  imports: [],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css'
})

export class LinksComponent implements OnInit {
  links!: Link[];

  ngOnInit(): void {
    this.hydratation();
  }

  constructor(private linksService: LinksService){}

  hydratation(){
    this.linksService.getLinks().subscribe((linksData: any) => {
    this.links = linksData.map((linksData: any)=> {
      const link = new Link();
      Object.assign(link, linksData);

      return link;
    });
    
    //console.log(this.links);
    })
  }

  //Fonction qui permet de filtrer les liens de recommandation par ID (avec itération dans le tableau de liens)
  getLinksByRecommendationId(recommendationId: number): any[] {
    if (!this.links) return [];
    return this.links.filter(item => item.recommendation_id === recommendationId);
  }

}
