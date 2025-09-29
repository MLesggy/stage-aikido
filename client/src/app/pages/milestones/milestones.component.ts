import { Component, OnInit } from '@angular/core';
import { DivRelevance } from '../../models/div-relevance/div-relevance.models';
import { CommonModule } from '@angular/common';
import { DivRelevanceService } from '../../services/div-relevance/div-relevance.service';
import { MilestonesService } from '../../services/milestones/milestones.service';
import { Milestone } from '../../models/milestones/milestones.models';
import { forkJoin } from 'rxjs';
import { ImagesService } from '../../services/images/images.service';

export enum MilestoneStyle {
    QUINCONCE = 'quinconce',
    NORMAL = 'normal'
}


@Component({
  selector: 'app-milestones',
  imports: [CommonModule],
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.css',
})

export class MilestonesComponent implements OnInit {

  divRelevances!: DivRelevance[];
  milestones!: Milestone[];

  ngOnInit(): void {
    this.hydratation();
  }

  constructor(private divRelevanceService: DivRelevanceService, private milestonesService: MilestonesService, public imagesService: ImagesService) {}

  hydratation() {
    forkJoin({
      divRelevances: this.divRelevanceService.getDivRelevance(),
      milestones: this.milestonesService.getMilestones()
    }).subscribe(results => {
      this.divRelevances = (results.divRelevances as any[]).map((data: any) => 
        Object.assign(new DivRelevance(), data)
      );
      
      this.milestones = (results.milestones as any[]).map((data: any) => 
        Object.assign(new Milestone(), data)
      );
      
      this.imagesService.processEntitiesImages(this.divRelevances, (divRelevances: DivRelevance) => divRelevances.div_relevance_image);
      //console.log(this.divRelevances);
      //console.log(this.milestones);
    });
  }


  getObjectsForQuinconce(){
    return this.divRelevances.filter(item => item.div_relevance_milestone.milestone_style === MilestoneStyle.QUINCONCE);
  }

  getDivRelevancesForMilestone(milestoneId: number) {
    if (!this.divRelevances) return [];
  
    return this.divRelevances.filter(item => 
      item.div_relevance_milestone_id === milestoneId
    );
  }

}
