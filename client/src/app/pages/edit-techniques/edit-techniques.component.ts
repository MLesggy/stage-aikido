import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth-service/authentication';
import { TechniquesService } from '../../services/techniques/techniques.service';
import { Technique } from '../../models/techniques/techniques.models';
import { Grade } from '../../models/grades/grades.models';
import { GradesService } from '../../services/grades/grades.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal/modal.service';
import { AttackForm } from '../../models/attack-forms/attack-forms.models';
import { AttackFormsService } from '../../services/attack-forms/attack-forms.service';
import { AttackFormDanRelevance } from '../../models/attack-forms-dan-relevance/attack-forms-dan-relevance.models';
import { AttackFormsDanRelevanceService } from '../../services/attack-forms-dan-relevance/attack-forms-dan-relevance.service';
import { WorkFormsService } from '../../services/work-forms/work-forms.service';
import { WorkForm } from '../../models/work-forms/work-forms.models';
import { TechniqueDanRelevance } from '../../models/techniques-dan-relevance/techniques-dan-relevance.models';
import { TechniquesDanRelevanceService } from '../../services/techniques-dan-relevance/techniques-dan-relevance.service';

export enum ActiveForm {
  TECHNIQUE = 'technique',
  ATTACK = 'attack',
  WORK = 'work'
}


@Component({
  selector: 'app-edit-techniques',
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './edit-techniques.component.html',
  styleUrl: './edit-techniques.component.css'
})
export class EditTechniquesComponent implements OnInit {

  grades!: Grade[]; //kuy list
  techniques!: Technique[]; //technique list
  techniquesDanRelevance!: TechniqueDanRelevance[]; //techniquesDanRelevance list
  attackForms!: AttackForm[]; //attackForm list
  attackFormsDanRelevance!: AttackFormDanRelevance[]; //attackFormDanRelevance list
  workForms!: WorkForm[]; //workForm list

  //variables used for the modals
  areWeCreating: boolean = false;
  areWeUpdating: boolean = false;
  areWeDeleting: boolean = false;
  activeForm!: ActiveForm; 

  constructor(public authService: AuthService, public techniquesService: TechniquesService, public techniquesDanRelevanceService: TechniquesDanRelevanceService,public gradesService: GradesService, public attackFormsService: AttackFormsService, public attackFormsDanRelevanceService: AttackFormsDanRelevanceService, public workFormsService: WorkFormsService , public modalService: ModalService, private formBuilder: FormBuilder,){}
  
  ngOnInit(): void {
    this.getTechniques();
    this.getTechniquesDanRelevance();
    this.getGrades();
    this.getAttackForms();
    this.getAttackFormsDanRelevance();
    this.getWorkForms();
  }

  reloadData(): void {
    this.getTechniques();
    this.getTechniquesDanRelevance();
    this.getGrades();
    this.getAttackForms();
    this.getAttackFormsDanRelevance();
    this.getWorkForms();
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

  getTechniquesDanRelevance(){
    this.techniquesDanRelevanceService.getTechniquesDanRelevance().subscribe((techniquesDanRelevanceData: any) => {
      if (Array.isArray(techniquesDanRelevanceData)) {
        // all Objects
        this.techniquesDanRelevance = techniquesDanRelevanceData.map((singleTechniqueDanRelevanceData: any) => {
          return Object.assign(new TechniqueDanRelevance(), singleTechniqueDanRelevanceData);
        });
      } else {
        //single object
        this.techniquesDanRelevance = [Object.assign(new TechniqueDanRelevance(), techniquesDanRelevanceData)];
      }
      //console.log(this.techniquesDanRelevance);
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

  getAttackFormsDanRelevance(){
    this.attackFormsDanRelevanceService.getAttackFormsDanRelevance().subscribe((attackFormsDanRelevanceData: any) => {
      if (Array.isArray(attackFormsDanRelevanceData)) {
        // all Objects
        this.attackFormsDanRelevance = attackFormsDanRelevanceData.map((singleAttackFormsDanRelevanceData: any) => {
          return Object.assign(new AttackFormDanRelevance(), singleAttackFormsDanRelevanceData);
        });
      } else {
        //single object
        this.attackFormsDanRelevance = [Object.assign(new AttackFormDanRelevance(), attackFormsDanRelevanceData)];
      }
      //console.log(this.attackFormsDanRelevance);
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

  toggleTable(id: number) {
    const element = document.getElementById(`table-${id}`);
    if (element) {
      if (element.style.display === 'none') {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    }
  }

  getTechniquesForKuy(kuyId: number) {
    if (!this.techniques) return [];
      return this.techniques.filter((item) => item.grade_id === kuyId);
  }

  hasTechniqueDanRelevance(techniqueId: number, danGradeId: number): boolean {
    if (!this.techniquesDanRelevance || this.techniquesDanRelevance.length === 0) {
      return false;
    }

    return this.techniquesDanRelevance.some(relevance => relevance.technique_id === techniqueId && relevance.dan_grade_id === danGradeId);
  }

  getAttackFormsDanRelevanceForAttackForm(attackFormId: number): AttackFormDanRelevance[] {
    if (!this.attackFormsDanRelevance) {
      return [];
    }
    return this.attackFormsDanRelevance.filter(relevance => relevance.attack_form_id === attackFormId);
  }

  hasAttackFormDanRelevance(attackFormId: number, danGradeId: number): boolean {
    if (!this.attackFormsDanRelevance || this.attackFormsDanRelevance.length === 0) {
      return false;
    }
    
    return this.attackFormsDanRelevance.some(relevance => relevance.attack_form_id === attackFormId && relevance.dan_grade_id === danGradeId);
  }

  //PARTIE SELECTFORM
  // Ref of the template
  @ViewChild('selectFormTemplate') selectFormTemplate!: TemplateRef<any>;
  selectForm! : FormGroup;


  initSelectForm(): void {
    this.selectForm = this.formBuilder.group({
      action_select: ['', Validators.required],
      type_select: ['', Validators.required ],
    });
  }

  // Open the form
  openSelectModal() {
    this.initSelectForm();
    this.modalService.open('Actions', this.selectFormTemplate);
  }

  // Checking if are updating an address or if we are creating a new address
  onSelectSubmit() {
    if (this.selectForm.invalid){
      alert('Formulaire invalide');
      return;
    } else {
      //reset datas
      this.areWeCreating = false;
      this.areWeUpdating = false;
      this.areWeDeleting = false;

      //get action
      switch (this.selectForm.value.action_select) {
        case 'add':
          this.areWeCreating = true;
          break;
        case 'modify':
          this.areWeUpdating = true;
          break;
        case 'delete':
          this.areWeDeleting = true;
          break;
      }
      //get type
      switch (this.selectForm.value.type_select) {
        case 'technique':
          this.modalService.close();
          this.activeForm = ActiveForm.TECHNIQUE;
          this.initTechniqueForm();
          this.modalService.open(`${this.areWeCreating ? 'Ajout':''} ${this.areWeUpdating ? 'Modification':''} ${this.areWeDeleting ? 'Suppression':''} d'une technique`, this.techniqueFormTemplate);
          break;
        case 'work-form':
          this.modalService.close();
          this.activeForm = ActiveForm.WORK;
          this.initWorkForm();
          this.modalService.open(`${this.areWeCreating ? 'Ajout':''} ${this.areWeUpdating ? 'Modification':''} ${this.areWeDeleting ? 'Suppression':''} d'une forme de travail`, this.workFormTemplate);
          break;
        case 'attack-form':
          this.modalService.close();
          this.activeForm = ActiveForm.ATTACK;
          this.initAttackForm();
          this.modalService.open(`${this.areWeCreating ? 'Ajout':''} ${this.areWeUpdating ? 'Modification':''} ${this.areWeDeleting ? 'Suppression':''} d'une forme d'attaque`, this.attackFormTemplate);
          break;
      }  
    }
  }


  //PARTIE ATTACKFORM
  // Ref of the template
  @ViewChild('attackFormTemplate') attackFormTemplate!: TemplateRef<any>;
  attackForm! : FormGroup;
  currentAttackForm: AttackForm = new AttackForm();

  initAttackForm(): void {
    this.attackForm = this.formBuilder.group({
      attack_form_name: ['', Validators.required],
      attack_form_id: [{value: -1, disabled: true}],
      attack_select: [''],
      attack_form_dan_1: [false],
      attack_form_dan_2: [false],
      attack_form_dan_3: [false],
      attack_form_dan_4: [false]
    });
  }

  onAttackFormSubmit() {
    if (this.attackForm.invalid){
      alert('Formulaire invalide');
      return;
    }
    
    if (this.areWeCreating){
      this.currentAttackForm.attack_form_id = this.attackForm.get('attack_form_id')?.value;
      this.currentAttackForm.attack_form_name = this.attackForm.get('attack_form_name')?.value;
      this.addAttackForm();
    } else if (this.areWeUpdating){
      this.currentAttackForm.attack_form_id = this.attackForm.get('attack_select')?.value.attack_form_id;
      this.currentAttackForm.attack_form_name = this.attackForm.get('attack_form_name')?.value;
      this.updateAttackForm();
    }
  }

  updateCheckboxesAndName() {
    const selectedAttackForm = this.attackForm.get('attack_select')?.value;
    
    if (selectedAttackForm) {      
      const selectedAttackFormId = Number(selectedAttackForm.attack_form_id);
      
      // Updating every checkbox
      this.attackForm.get('attack_form_dan_1')?.setValue(
        this.hasAttackFormDanRelevance(selectedAttackFormId, 1)
      );
      
      this.attackForm.get('attack_form_dan_2')?.setValue(
        this.hasAttackFormDanRelevance(selectedAttackFormId, 2)
      );

      this.attackForm.get('attack_form_dan_3')?.setValue(
        this.hasAttackFormDanRelevance(selectedAttackFormId, 3)
      );
      
      this.attackForm.get('attack_form_dan_4')?.setValue(
        this.hasAttackFormDanRelevance(selectedAttackFormId, 4)
      );
    }
  }

  addAttackForm() {
    this.attackFormsService.addAttackForm(this.currentAttackForm).subscribe({
      next: (newAttackForm) => {
        //now we need to add attackFormDanRelevance that user picked
        if (this.attackForm.value.attack_form_dan_1){
          this.addAttackFormDanRelevance(Object.assign(new AttackFormDanRelevance(), {attack_form_id: newAttackForm.attack_form_id, dan_grade_id: 1}));
        }
        if (this.attackForm.value.attack_form_dan_2){
          this.addAttackFormDanRelevance(Object.assign(new AttackFormDanRelevance(), {attack_form_id: newAttackForm.attack_form_id, dan_grade_id: 2}));
        }
        if (this.attackForm.value.attack_form_dan_3){
          this.addAttackFormDanRelevance(Object.assign(new AttackFormDanRelevance(), {attack_form_id: newAttackForm.attack_form_id, dan_grade_id: 3}));
        }
        if (this.attackForm.value.attack_form_dan_4){
          this.addAttackFormDanRelevance(Object.assign(new AttackFormDanRelevance(), {attack_form_id: newAttackForm.attack_form_id, dan_grade_id: 4}));
        }
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout de la forme d\'attaque");
      },
    });
  }

  addAttackFormDanRelevance(attackFormDanRelevance: AttackFormDanRelevance) {
    this.attackFormsDanRelevanceService.addAttackFormDanRelevance(attackFormDanRelevance).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout des dans pour la forme d\'attaque");
      },
    });
  }

  updateAttackForm() {
    this.attackFormsService.updateAttackForm(this.currentAttackForm).subscribe({
      next: (updateAttackForm) => {
        // Préparation du tableau des danGradeIds
        const danGradeIds = [];
        
        if (this.attackForm.value.attack_form_dan_1) danGradeIds.push(1);
        if (this.attackForm.value.attack_form_dan_2) danGradeIds.push(2);
        if (this.attackForm.value.attack_form_dan_3) danGradeIds.push(3);
        if (this.attackForm.value.attack_form_dan_4) danGradeIds.push(4);

        this.updateAttackFormDanRelevance(updateAttackForm.attack_form_id, danGradeIds);
        this.reloadData();
      },
      error: () => {
        alert('Erreur lors de la mise à jour de la forme d\'attaque');
      },
    });
  }

    updateAttackFormDanRelevance(attackFormId: number, danGradeIds: number[]) {
    this.attackFormsDanRelevanceService.updateAttackFormDanRelevance(attackFormId, danGradeIds).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert('Erreur lors de la mise à jour des associations de dan');
      },
    });
  }

  deleteAttackForm(attackFormId: number){
    if (confirm('Êtes-vous sûr de vouloir supprimer cette forme d\'attaque ?')) {
      this.attackFormsService.deleteAttackForm(attackFormId).subscribe({
        next: () => {
          this.reloadData();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression de la forme d\'attaque');
        },
      });
    }
  }


  //PARTIE WORKFORM
  // Ref of the template
  @ViewChild('workFormTemplate') workFormTemplate!: TemplateRef<any>;
  workForm! : FormGroup;
  currentWorkForm: WorkForm = new WorkForm();

  initWorkForm(): void {
    this.workForm = this.formBuilder.group({
      work_form_id: [{value: -1, disabled: true}],
      work_form_name: ['', Validators.required],
      work_select: [''],
    });
  }

  onWorkFormSubmit() {
    if (this.workForm.invalid){
      alert('Formulaire invalide');
      return;
    }
    
    if (this.areWeCreating){
      this.currentWorkForm.work_form_id = this.workForm.get('work_form_id')?.value;
      this.currentWorkForm.work_form_name = this.workForm.get('work_form_name')?.value;
      this.addWorkForm();
    } else if (this.areWeUpdating){
      this.currentWorkForm.work_form_id = this.workForm.get('work_select')?.value.work_form_id;
      this.currentWorkForm.work_form_name = this.workForm.get('work_form_name')?.value;
      this.updateWorkForm();
    }
  }

  addWorkForm() {
    this.workFormsService.addWorkForm(this.currentWorkForm).subscribe({
      next: (newAttackForm) => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout de la forme de travail");
      },
    });
  }


  updateWorkForm() {
    this.workFormsService.updateWorkForm(this.currentWorkForm).subscribe({
      next: (updateAttackForm) => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert('Erreur lors de la mise à jour de la forme de travail');
      },
    });
  }


  deleteWorkForm(workFormId: number){
    if (confirm('Êtes-vous sûr de vouloir supprimer cette forme de travail ?')) {
      this.workFormsService.deleteWorkForm(workFormId).subscribe({
        next: () => {
          this.reloadData();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression de la forme de travail');
        },
      });
    }
  }

  //PARTIE Technique
  // Ref of the template
  @ViewChild('techniqueFormTemplate') techniqueFormTemplate!: TemplateRef<any>;
  techniqueForm! : FormGroup;
  currentTechnique: Technique = new Technique();

  initTechniqueForm(): void {
    this.techniqueForm = this.formBuilder.group({
      technique_select: [''],
      technique_id: [{value: -1, disabled: true}],
      technique_official: ['', Validators.required],
      technique_move: ['', Validators.required],
      technique_link: ['', Validators.required],
      grade_id: ['', Validators.required],
      work_form_id: ['', Validators.required],
      attack_form_id: ['', Validators.required],
      technique_dan_1: [false],
      technique_dan_2: [false],
      technique_dan_3: [false],
      technique_dan_4: [false]
    });
  }

  onTechniqueSubmit() {
    if (this.techniqueForm.invalid){
      alert('Formulaire invalide');
      return;
    }
    
    if (this.areWeCreating){
      this.currentTechnique.technique_id = this.techniqueForm.get('technique_id')?.value;
      this.currentTechnique.technique_official = Boolean(this.techniqueForm.get('technique_official')?.value);
      this.currentTechnique.technique_move = this.techniqueForm.get('technique_move')?.value;
      this.currentTechnique.technique_link = this.techniqueForm.get('technique_link')?.value;
      this.currentTechnique.grade_id = this.techniqueForm.get('grade_id')?.value;
      this.currentTechnique.work_form_id = this.techniqueForm.get('work_form_id')?.value;
      this.currentTechnique.attack_form_id = this.techniqueForm.get('attack_form_id')?.value;
      this.addTechnique();
    } else if (this.areWeUpdating){
      this.currentTechnique.technique_id = this.techniqueForm.get('technique_select')?.value.technique_id;
      this.currentTechnique.technique_official = Boolean(this.techniqueForm.get('technique_official')?.value);
      this.currentTechnique.technique_move = this.techniqueForm.get('technique_move')?.value;
      this.currentTechnique.technique_link = this.techniqueForm.get('technique_link')?.value;
      this.currentTechnique.grade_id = this.techniqueForm.get('grade_id')?.value;
      this.currentTechnique.work_form_id = this.techniqueForm.get('work_form_id')?.value;
      this.currentTechnique.attack_form_id = this.techniqueForm.get('attack_form_id')?.value;
      this.updateTechnique();
    }
  }

    updateCheckboxesAndNameForTechnique() {
    const selectedTechnique = this.techniqueForm.get('technique_select')?.value;

    if (selectedTechnique) {      
      const selectedTechniqueId = Number(selectedTechnique.technique_id);
      
      // Updating every checkbox
      this.techniqueForm.get('technique_dan_1')?.setValue(
        this.hasTechniqueDanRelevance(selectedTechniqueId, 1)
      );
      
      this.techniqueForm.get('technique_dan_2')?.setValue(
        this.hasTechniqueDanRelevance(selectedTechniqueId, 2)
      );

      this.techniqueForm.get('technique_dan_3')?.setValue(
        this.hasTechniqueDanRelevance(selectedTechniqueId, 3)
      );
      
      this.techniqueForm.get('technique_dan_4')?.setValue(
        this.hasTechniqueDanRelevance(selectedTechniqueId, 4)
      );
    }
  }

  addTechnique() {
    this.techniquesService.addTechnique(this.currentTechnique).subscribe({
      next: (newTechnique) => {
        //now we need to add techniqueDanRelevance that user picked
        if (this.techniqueForm.value.technique_dan_1){
          this.addTechniqueDanRelevance(Object.assign(new TechniqueDanRelevance(), {technique_id: newTechnique.technique_id, dan_grade_id: 1}));
        }
        if (this.techniqueForm.value.technique_dan_2){
          this.addTechniqueDanRelevance(Object.assign(new TechniqueDanRelevance(), {technique_id: newTechnique.technique_id, dan_grade_id: 2}));
        }
        if (this.techniqueForm.value.technique_dan_3){
          this.addTechniqueDanRelevance(Object.assign(new TechniqueDanRelevance(), {technique_id: newTechnique.technique_id, dan_grade_id: 3}));
        }
        if (this.techniqueForm.value.technique_dan_4){
          this.addTechniqueDanRelevance(Object.assign(new TechniqueDanRelevance(), {technique_id: newTechnique.technique_id, dan_grade_id: 4}));
        }
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout de la technique");
      },
    });
  }

  addTechniqueDanRelevance(TechniqueDanRelevance: TechniqueDanRelevance) {
    this.techniquesDanRelevanceService.addTechniqueDanRelevance(TechniqueDanRelevance).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout des dans pour la technique");
      },
    });
  }

  updateTechnique() {
    this.techniquesService.updateTechnique(this.currentTechnique).subscribe({
      next: (updatedTechnique) => {
        // Préparation du tableau des danGradeIds
        const danGradeIds = [];
        
        if (this.techniqueForm.value.technique_dan_1) danGradeIds.push(1);
        if (this.techniqueForm.value.technique_dan_2) danGradeIds.push(2);
        if (this.techniqueForm.value.technique_dan_3) danGradeIds.push(3);
        if (this.techniqueForm.value.technique_dan_4) danGradeIds.push(4);

        this.updateTechniqueDanRelevance(updatedTechnique.technique_id, danGradeIds);
        this.reloadData();
      },
      error: () => {
        alert('Erreur lors de la mise à jour de la technique');
      },
    });
  }

    updateTechniqueDanRelevance(techniqueId: number, danGradeIds: number[]) {
    this.techniquesDanRelevanceService.updateTechniqueDanRelevance(techniqueId, danGradeIds).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert('Erreur lors de la mise à jour des associations de dan');
      },
    });
  }

  deleteTechnique(techniqueId: number){
    if (confirm('Êtes-vous sûr de vouloir supprimer cette technique ?')) {
      this.techniquesService.deleteTechnique(techniqueId).subscribe({
        next: () => {
          this.reloadData();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression de la technique');
        },
      });
    }
  }

}
