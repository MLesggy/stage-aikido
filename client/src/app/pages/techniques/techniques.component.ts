import { Component, OnInit } from '@angular/core';
import { TechniquesService } from '../../services/techniques/techniques.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technique } from '../../models/techniques/techniques.models';
import { GradesService } from '../../services/grades/grades.service';
import { Grade } from '../../models/grades/grades.models';
import { WorkForm } from '../../models/work-forms/work-forms.models';
import { AttackForm } from '../../models/attack-forms/attack-forms.models';
import { WorkFormsService } from '../../services/work-forms/work-forms.service';
import { AttackFormsService } from '../../services/attack-forms/attack-forms.service';


@Component({
  selector: 'app-techniques',
  imports: [MatGridListModule, CommonModule, FormsModule],
  templateUrl: './techniques.component.html',
  styleUrl: './techniques.component.css'
})
export class TechniquesComponent implements OnInit {
  grades!: Grade[]; //kuy list
  techniques!: Technique[]; //technique list
  attackForms!: AttackForm[]; //attackForm list
  workForms!: WorkForm[]; //workForm list
  showOfficialHighlight: boolean = false;
  danGradeIndex: boolean[] = [false, false, false, false, false]

  constructor(private techniquesService: TechniquesService, private gradesService: GradesService, private workFormsService: WorkFormsService, private attackFormsService: AttackFormsService){};

  ngOnInit(): void {
    this.getTechniques();
    this.getGrades();
  }

  getTechniques(){
    this.techniquesService.getTechniques().subscribe((techniquesData: any) => {
      if (Array.isArray(techniquesData)) {
        // all Objects
        this.techniques = techniquesData.map((singleTechniqueData: any) => {
          return Object.assign(new Technique(), singleTechniqueData);
        });
      } else {
        //single object
        this.techniques = [Object.assign(new Technique(), techniquesData)];
      }
      this.techniques = this.techniquesService.getWonderfullNameForTechnique(this.techniques);
      //console.log(this.techniques);
    });
  }

  getGrades(){
    this.gradesService.getGrades().subscribe((gradesData: any) => {
      if (Array.isArray(gradesData)) {
        // all Objects
        this.grades = gradesData.map((singleGradeData: any) => {
          return Object.assign(new Grade(), singleGradeData);
        });
      } else {
        //single object
        this.grades = [Object.assign(new Grade(), gradesData)];
      }
      //console.log(this.grades);
    });
  }

  getAttackForms(){
    this.attackFormsService.getAttackForms().subscribe((attackFormsData: any) => {
      if (Array.isArray(attackFormsData)) {
        // all Objects
        this.attackForms = attackFormsData.map((singleAttackFormsData: any) => {
          return Object.assign(new AttackForm(), singleAttackFormsData);
        });
      } else {
        //single object
        this.attackForms = [Object.assign(new AttackForm(), attackFormsData)];
      }
      //console.log(this.attackForms);
    });
  }

  getWorkForms(){
    this.workFormsService.getWorkForms().subscribe((workFormsData: any) => {
      if (Array.isArray(workFormsData)) {
        // all Objects
        this.workForms = workFormsData.map((singleworkFormsData: any) => {
          return Object.assign(new WorkForm(), singleworkFormsData);
        });
      } else {
        //single object
        this.workForms = [Object.assign(new WorkForm(), workFormsData)];
      }
      //console.log(this.workForms);
    });
  }

  // Retourne les NOMS UNIQUES des formes de travail pour le kyuId (triés)
  getWorkFormsForKuy(kuyId: number): string[] {
    const workForms = new Set<string>();
    this.techniques.forEach(t => {
      if (t.grade_id === kuyId && t.work_form_name) {
        workForms.add(t.work_form_name.trim());
      }
    });
    return Array.from(workForms).sort((a, b) => a.localeCompare(b));
  }

  // Retourne les NOMS UNIQUES des formes d'attaque pour le kuyId (triés)
  getAttackFormsForKuy(kuyId: number, workForm: string): string[] {
    const attackForms = new Set<string>();
    
    this.techniques.forEach(t => {
      if (t.grade_id === kuyId && 
          t.work_form_name?.trim().toLowerCase() === workForm.trim().toLowerCase() && 
          t.attack_form_name) {
        attackForms.add(t.attack_form_name.trim());
      }
    });
    return Array.from(attackForms).sort((a, b) => a.localeCompare(b));
  }

  // Retourne TOUTES les techniques correspondantes (triées)
  getMovesForKuy(kuyId: number, workForm: string, attackForm: string): Technique[] {
    return this.techniques
      .filter(t => 
        t.grade_id === kuyId &&
        t.work_form_name?.trim().toLowerCase() === workForm.trim().toLowerCase() &&
        t.attack_form_name?.trim().toLowerCase() === attackForm.trim().toLowerCase()
      )
      .sort((a, b) => a.technique_move.localeCompare(b.technique_move));
  }
  
  getTotalRowsForWorkForm(kuyId: number, workForm: string): number {
    return this.getAttackFormsForKuy(kuyId, workForm)
      .reduce((total, attackForm) => {
        return total + this.getMovesForKuy(kuyId, workForm, attackForm).length || 1;
      }, 0);
  }

  // Permet de deplier le tableau pour l'afficher en entier après le clic
  toggleTable(id: number, kuyName: string) {
    const table = document.getElementById(`kuy-container-${id}`);
    const button = document.getElementById(`toggle-button-${id}`);
    if (table && button) {
      if (table.style.display === 'none') {
        table.style.display = '';
        button.textContent = `Masquer le ${kuyName} ▼`;
      } else {
        table.style.display = 'none';
        button.textContent = `Afficher le ${kuyName} ▶`;
      }
    }
  }

  // Cette fonction vérifie si une technique est officielle 
  isOfficial(technique: Technique): boolean {
    return technique?.technique_official === true && this.showOfficialHighlight;
  }

  //show this Grade in table
  setDanGrade(i: number) {
    this.danGradeIndex[i] = !this.danGradeIndex[i];
  }

}
