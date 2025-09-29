import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { CommonModule } from '@angular/common';
import { Link } from '../../models/links/links.models';
import { LinksService } from '../../services/links/links.service';
import { Recommendation } from '../../models/recommendations/recommendations.models';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal/modal.service';
import { AuthService } from '../../services/auth-service/authentication';

@Component({
  selector: 'app-edit-links',
  imports: [CommonModule, ModalComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-links.component.html',
  styleUrl: './edit-links.component.css',
})

export class EditLinksComponent {
  links!: Link[];
  recommendations!: Recommendation[];

  constructor(
    public seminarsService: SeminarsService,
    private linksService: LinksService,
    private modalService: ModalService,
    private formBuilder: FormBuilder, public authService: AuthService) {}

  ngOnInit(): void {
    this.getLinks();
    this.getRecommendations();
    this.initForm();
  }

  getLinks() {
    this.linksService.getLinks().subscribe((linksData: any) => {
      this.links = linksData.map((linksData: any) => {
        const link = new Link();
        Object.assign(link, linksData);

        return link;
      });
      //console.log(this.links);
    });
  }

  getRecommendations() {
    this.linksService
      .getRecommendations()
      .subscribe((recommendationsData: any) => {
        this.recommendations = recommendationsData.map((linkData: any) => {
          const recommendation = new Recommendation();
          Object.assign(recommendation, linkData);

          return recommendation;
        });
        //console.log(this.recommendations);
      });
  }

  //Fonction qui permet de filtrer les liens de recommandation par ID (avec itération dans le tableau de liens)
  getLinksByRecommendationId(recommendationId: number): any[] {
    if (!this.links) return [];
    return this.links.filter(
      (item) => item.recommendation_id === recommendationId
    );
  }

  // Ref of the template
  @ViewChild('linkFormTemplate') linkFormTemplate!: TemplateRef<any>;

  // FormGroup with FormControl to check inputs && Initialisation called in OnInit()
  linkForm! : FormGroup;

  initForm(): void {
    this.linkForm = this.formBuilder.group({
      link_id: [{value: -1, disabled: true}],
      link_text: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      link_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      recommendation_id: [{value: -1, disabled: true}, Validators.required]
    });
  }

  // CurrentLink that we use with add or modify function and a boolean to check if we are adding or modifying a link
  currentLink: Link = new Link();
  areWeUpdatingLink: boolean = false;

  // Open the form for given recommendation_id
  openModal(recommendationId: number) {
    this.initForm(); //reseting the form
    this.areWeUpdatingLink = false;
    this.linkForm.patchValue({recommendation_id: recommendationId});
    this.modalService.open('Ajouter un lien', this.linkFormTemplate);
  }

  // Close the form
  closeModal() {
    this.modalService.close();
  }

  // Open the modal with given link
  editLink(link: Link) {
    this.initForm(); //reseting the form
    this.areWeUpdatingLink = true;
    this.linkForm.patchValue(link);
    this.modalService.open('Editer un lien', this.linkFormTemplate);
  }

  // Checking if are updating a link or if we are creating a new link
  onSubmit() {
    if (this.linkForm.invalid){
      alert("Formulaire invalide");
      return;
    }

    this.currentLink = {...this.linkForm.getRawValue()}; // shallow copy of input values.
    if (this.areWeUpdatingLink) {
      this.updateLink();
    } else {
      this.addLink();
    }
    this.closeModal();
  }

  // This method is called onSubmit by onSubmit() if we are creating a link
  addLink() {
    this.linksService.addLink(this.currentLink).subscribe({
      next: (newLink) => {
        // adding link to local copy
        this.links.push(newLink);
        this.modalService.close();
      },
      error: () => {
        alert("Erreur lors de l'ajout du lien");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a link
  updateLink() {
    this.linksService.updateLink(this.currentLink).subscribe({
      next: (updatedLink) => {
        //Updating the local copy
        const index = this.links.findIndex(link => link.link_id === updatedLink.link_id);
        if (index !== -1) {
          this.links[index] = updatedLink;
        }
        this.modalService.close();
      },
      error: () => {
        alert('Erreur lors de la mise à jour du lien');
      },
    });
  }

  deleteLink(link: Link) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lien ?')) {
      this.linksService.deleteLink(link.link_id!).subscribe({
        next: () => {
          this.links = this.links.filter(item => item != link);
        },
        error: () => {
          alert('Erreur lors de la suppression du lien');
        },
      });
    }
  }
}
