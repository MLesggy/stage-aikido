import { Component, OnInit } from '@angular/core';
import { Seminar } from '../../models/seminars/seminars.models';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { AutoScrollDirective } from '../../directives/auto-scroll.directive';
import { RouterModule } from '@angular/router';
import { AddressService } from '../../services/address/adress.service';

@Component({
  selector: 'app-seminars',
  imports: [MatGridListModule, CommonModule, AutoScrollDirective, RouterModule],
  templateUrl: './seminars.component.html',
  styleUrl: './seminars.component.css',
})
export class SeminarsComponent implements OnInit {
  seminars!: Seminar[];
  currentMonth: number = new Date().getMonth(); //What's the month ?
  currentYear: number = new Date().getFullYear(); //What's the year ?

  ngOnInit(): void {
    this.hydratation();
  }

  constructor(public seminarsService: SeminarsService, public addressService: AddressService) {}

  hydratation() {
    this.seminarsService.getSeminarsWithoutImages().subscribe((seminarsData: any) => {
      if (Array.isArray(seminarsData)) {
        // all Objects
        this.seminars = seminarsData.map((seminarData: any) => {
          return Object.assign(new Seminar(), seminarData);
        });
      } else {
        //single object
        this.seminars = [Object.assign(new Seminar(), seminarsData)];
      }
    });
  }
}
