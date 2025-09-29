import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { CommonModule } from '@angular/common';
import { Milestone } from '../../models/milestones/milestones.models';
import { MilestonesService } from '../../services/milestones/milestones.service';
import { DivRelevance } from '../../models/div-relevance/div-relevance.models';
import { DivRelevanceService } from '../../services/div-relevance/div-relevance.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { Story } from '../../models/stories/stories.models';
import { ModalService } from '../../services/modal/modal.service';
import { FormGroup, Validators, FormBuilder, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { StoryService } from '../../services/story/story.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "../../components/modal/modal.component";
import { AuthService } from '../../services/auth-service/authentication';
import { ImagesService } from '../../services/images/images.service';
import { Image } from '../../models/images/images.models';

@Component({
  selector: 'app-edit-milestones',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './edit-milestones.component.html',
  styleUrl: './edit-milestones.component.css',
})
export class EditMilestonesComponent {
  milestones!: Milestone[];
  divRelevances: DivRelevance[] = [];
  stories: Story[] = [];
  filteredStoriesByDivRelevanceId!: Story[];
  addedImageId!: number;
  selectedMilestone!: number;
  currentStory: Story = new Story();
  areWeUpdatingStory: boolean = false;
  addedStoryId: number = -1;
  areWeUpdatingDiv: boolean = false;

  constructor(
    public seminarsService: SeminarsService,
    private milestonesService: MilestonesService,
    private divRelevanceService: DivRelevanceService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private storyservice: StoryService,
    public authService: AuthService,
    public imagesService: ImagesService

  ) { }

  ngOnInit(): void {
    this.hydratation();
  }

  hydratation() {
    forkJoin({
      divRelevances: this.divRelevanceService.getDivRelevance(),
      milestones: this.milestonesService.getMilestones(),
      stories: this.storyservice.getStoriesByDivRelevanceId(-1)
    }).subscribe((results: any) => {
      this.divRelevances = results.divRelevances.map((data: any) => Object.assign(new DivRelevance(), data));
      this.milestones = results.milestones.map((data: any) => Object.assign(new Milestone(), data));
      this.stories = results.stories.map((data: any) => Object.assign(new Story(), data));

      //creation des liens pour les images dans divRelevance
      this.imagesService.processEntitiesImages(
        this.divRelevances,
        (divRelevance: DivRelevance) => divRelevance.div_relevance_image
      );

      this.initForm();
      this.initFormDiv();
      this.initImageForm();
    });
  }

  getDivRelevanceById(divRelevanceId: number): any[] {
    if (!this.divRelevances) return [];
    return this.divRelevances.filter(
      (item) => item.div_relevance_id === divRelevanceId
    );
  }

  // Ref of the template
  @ViewChild('StoryFormTemplate') StoryFormTemplate!: TemplateRef<any>;
  @ViewChild('AddStoryFormTemplate') AddStoryFormTemplate!: TemplateRef<any>;

  // Formulaire pour changer les stories des MilesStone
  StoryForm!: FormGroup;
  DivForm!: FormGroup;

  initForm(): void {
    this.StoryForm = this.formBuilder.group({
      story_id: [null],
      story_text: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]],
    });
  }

  // Open the form for given recommendation_id
  openModal(StoryId: number) {
    this.initForm(); //reseting the form
    this.areWeUpdatingStory = false;
    this.StoryForm.patchValue({ story_id: StoryId });
    this.modalService.open('Ajouter une story', this.StoryFormTemplate);
  }
  // Close the form
  closeModal() {
    this.modalService.close();
  }

  editStory(story: Story) {
    this.initForm(); //reseting the form
    this.areWeUpdatingStory = true;
    this.StoryForm.patchValue(story);
    this.modalService.open('Editer une story', this.StoryFormTemplate);
  }

  onSubmit() {
    if (this.StoryForm.invalid) {
      alert('Error formulaire story');
      return;
    }

    this.currentStory = { ...this.StoryForm.getRawValue() }; // shallow copy of input values.

    if (this.areWeUpdatingStory) {
      this.updateStory();
    } else {
      this.addStory();
    }
    this.closeModal();
  }

  //  CRUD pour les stories 
  // This method is called onSubmit by onSubmit() if we are creating a story

  async addStory() {
    if (!this.currentStory) {
      alert('Error formulaire story');
      return;
    }

    try {
      const newStory = await firstValueFrom(this.storyservice.addStory(this.currentStory));

      // adding story to local copy
      this.stories.push(newStory);
      this.addedStoryId = newStory.story_id;
      this.modalService.close();
    } catch (error) {
      alert("Erreur lors de l'ajout de la story");
    }
  }

  updateStory() {
    this.storyservice.updateStory(this.currentStory).subscribe({
      next: (updatedStory) => {
        //Updating the local copy
        const index = this.stories.findIndex(
          (story) => story.story_id === updatedStory.story_id
        );
        if (index !== -1) {
          this.stories[index] = updatedStory;
        }
        this.currentStory = { ...updatedStory };
        this.modalService.close();
      },
      error: () => {
        alert('Erreur lors de la mise à jour du lien');
      },
    });
  }

  deleteStory(story: Story) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette story ?')) {
      this.storyservice.deleteStory(story.story_id!).subscribe({
        next: () => {
          this.stories = this.stories.filter(item => item != story);
        },
        error: () => {
          alert('Erreur lors de la suppression du lien');
        },
      });
    }
  }


  // CRUD pour les divRelevances 
  currentDivRelevance: DivRelevance = new DivRelevance();

  addDivRelevance() {

    this.divRelevanceService.addDivRelevance(this.currentDivRelevance).subscribe({
      next: (divRelevance) => {
        this.divRelevances.push(divRelevance);
        this.modalService.close();
      },
      error: () => {
        alert("Erreur lors de l'ajout de la divRelevance");
      }
    })
  }

  // Modal pour les divRelevance
  initFormDiv(): void {
    this.DivForm = this.formBuilder.group({
      story_text: ['', [Validators.minLength(3), Validators.maxLength(300)]],
      image: [''],
      div_relevance_milestone_id: ['', Validators.required]
    }, { 
      validators: this.atLeastOneRequiredValidator(['story_text', 'image']) 
    });
  }

  // Ajoutez cette méthode dans la même classe
  private atLeastOneRequiredValidator(fields: string[]) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      return fields.some(field => {
        const control = formGroup.get(field);
        return control && control.value && control.value.toString().trim() !== '';
      }) 
        ? null 
        : { atLeastOneRequired: true };
    };
  }

  openModal2() {
    this.initFormDiv(); //reseting the form
    this.areWeUpdatingDiv = false;
    this.DivForm.patchValue({ divRelevance_id: -1 });
    this.modalService.open('Ajouter une milestone', this.AddStoryFormTemplate);
  }

  closeModal2() {
    this.modalService.close();
  }

  async onSubmit2() {

    if (this.DivForm.invalid) {
      alert("Formulaire invalide");
      return;
    }

    this.currentStory.story_text = this.DivForm.getRawValue().story_text;
    this.selectedMilestone = parseInt(this.DivForm.getRawValue().div_relevance_milestone_id);

    //if we provided a story
    if (this.currentStory) {
      await this.addStory();
      this.currentDivRelevance.div_relevance_story_id = this.addedStoryId;
    }

    this.currentDivRelevance.div_relevance_milestone_id = this.selectedMilestone;
    this.currentDivRelevance.div_relevance_image_id = this.addedImageId
    this.createDivRelevance();
    this.closeModal();
  }

  createDivRelevance() {
    this.divRelevanceService.addDivRelevance(this.currentDivRelevance).subscribe({
      next: () => {
        this.modalService.close();
      }
    });
  }


  //PARTIE IMAGE
  // Ref of the template
  @ViewChild('imageFormTemplate') imageFormTemplate!: TemplateRef<any>;
  imageForm!: FormGroup;
  currentImage: Image = new Image();
  selectedFileName: string = '';

  initImageForm(): void {
    this.imageForm = this.formBuilder.group({
      image_id: [{ value: -1, disabled: true }],
      image_description: [''],
      image_blob: ['', Validators.required],
    });
  }

  // Open the image form with given clubId or -1 if we dont provide anything
  openImageModal() {
    this.initImageForm(); //reseting the form
    this.modalService.open('Ajouter une image', this.imageFormTemplate);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      // Lire le fichier et le convertir en base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1]; // Enlever le préfixe pour n'avoir que le base64

        // Mettre à jour les autres champs du formulaire
        this.imageForm.patchValue({
          image_name: file.name,
          image_blob: base64String // Stocker la chaîne en base64
        });

        // Définir currentImage à partir du fichier
        this.currentImage = new Image();
        this.currentImage.club_id = null;
        this.currentImage.seminar_id = null;
        this.currentImage.image_id = this.addedImageId;
        this.currentImage.image_name = file.name;
        this.currentImage.image_size = file.size;
        this.currentImage.image_type = file.type;
        this.currentImage.image_blob = base64String; // Stocker la chaîne en base64
        this.currentImage.image_description = this.imageForm.value.image_description;
      };

      // Lancer la lecture du fichier en tant que Data URL (base64)
      reader.readAsDataURL(file);
    }
  }

  // Checking if are updating an image or if we are creating a new image
  onImageSubmit() {
    if (this.imageForm.invalid) {
      alert('Erreur formulaire image');
      return; //invalid data in input
    } else {
      this.addImage(); //adding image to db
    }
  }


  addImage() {
    this.imagesService.addImage(this.currentImage).subscribe({
      next: (image) => {
        // this.reloadData();
        this.addedImageId = image.image_id;
        this.DivForm.get('image')?.setValue('true');
        this.currentImage = image;
        this.modalService.close();
      },
      error: (error) => {
        alert("Erreur lors de l'ajout de l'image");
      },
    });
  }
}