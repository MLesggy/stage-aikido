import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AddressService } from '../../services/address/adress.service';
import { AuthService } from '../../services/auth-service/authentication';
import { Address } from '../../models/address/address.models';
import { Image } from '../../models/images/images.models';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagesService } from '../../services/images/images.service';
import { ClubService } from '../../services/clubs/clubs.service';
import { Club } from '../../models/clubs/clubs.models';
import { ClubSchedulesService } from '../../services/club-schedules/club-schedules.service';
import { ClubSchedule } from '../../models/club-schedules/club-schedules.models';
import { Link } from '../../models/links/links.models';
import { LinksService } from '../../services/links/links.service';

@Component({
  selector: 'app-edit-clubs',
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './edit-clubs.component.html',
  styleUrl: './edit-clubs.component.css'
})

export class EditClubsComponent {
  clubs!: Club[];
  address!: Address[];
  links!: Link[];

  constructor(public clubsService: ClubService, public clubSchedulesService: ClubSchedulesService, public linksService: LinksService ,public authService: AuthService, private modalService: ModalService, public addressService: AddressService, public imagesService: ImagesService, private formBuilder: FormBuilder){}
  
  ngOnInit(): void {
    this.hydratation();
  }

  hydratation(){
    this.getClubs();
    this.getAddress(); 
  }

  getClubs() {
    this.clubsService.getClubs().subscribe((clubsData: any) => {
      if (Array.isArray(clubsData)) {
        // all Objects
        this.clubs = clubsData.map((clubData: any) => {
          return Object.assign(new Club(), clubData);
        });
      } else {
        //single object
        this.clubs = [Object.assign(new Club(), clubsData)];
      }
      this.imagesService.processEntitiesImages(this.clubs, (club: Club) => club.club_images);
      // console.log("Clubs");
      // console.log(this.clubs);
    });
  }

    getAddress(){
    this.addressService.getAddress().subscribe((addressData: any) => {
      if (Array.isArray(addressData)) {
        // all Objects
        this.address = addressData.map((singleAdressData: any) => {
          return Object.assign(new Address(), singleAdressData);
        });
      } else {
        //single object
        this.address = [Object.assign(new Address(), addressData)];
      }
      // console.log("Address");
      // console.log(this.address);
    });
  }

  // Ref of the template
  @ViewChild('clubFormTemplate') clubFormTemplate!: TemplateRef<any>;
  clubForm! : FormGroup; //the formControl
  currentClub: Club = new Club(); //currentClub we will use send to database
  areWeCreatingClub: boolean = false; //boolean to check if we are creating a club
  areWeEditingClub: boolean = false; //boolean to check if we are editing a club

  // Close last opened modal (called by every modal in the component)
  closeModal() {
    this.modalService.close();
  }

  //Initialize the clubForm
  initClubForm(): void {
    this.clubForm = this.formBuilder.group({
      club_id: [{value: -1, disabled: true}],
      club_name: ['', Validators.required],
      club_contact_name: ['', Validators.required],
      club_contact_phone: ['', Validators.required],
      club_contact_email: ['', Validators.required],
      address_id: ['', Validators.required],
    });
  }

  // Open the form, mod: 1 creating a club, mod: 2 updating a club
  openClubModal(mod: number) {
    this.areWeCreatingClub = false;
    this.areWeEditingClub = false;

    switch(mod) {
      case 1:
        //creating the club THEN give user img form
        this.initClubForm(); //reseting the form
        this.areWeCreatingClub = true;
        this.modalService.open('Ajouter un club', this.clubFormTemplate);
        break;
      case 2:
        this.areWeEditingClub = true;
        this.modalService.open('Editer un club', this.clubFormTemplate);
        break;
    }
  }

  // Open the modal with given club
  editClub(club: Club) {
    this.areWeEditingClub = true;
    this.initClubForm(); //if we havnt creating a club before, we must initialize it
    this.currentClub = club;

    this.clubForm.patchValue({
      club_id: club.club_id,
      club_name: club.club_name,
      club_contact_name: club.club_contact_name,
      club_contact_phone: club.club_contact_phone,
      club_contact_email: club.club_contact_email,
      address_id: club.address_id
  });
    this.openClubModal(2);
  }

  // Checking if are updating a club or if we are creating a new club
  onClubSubmit() {
    if (this.clubForm.invalid){
      alert('Formulaire invalide');
      return;
    }

    // Convert string dates from form to Date objects
    const formValues = {...this.clubForm.getRawValue()};

    this.currentClub.club_id = formValues.club_id;
    this.currentClub.club_name = formValues.club_name;
    this.currentClub.club_contact_phone = formValues.club_contact_phone; 
    this.currentClub.club_contact_email =formValues.club_contact_email;
    this.currentClub.club_contact_name = formValues.club_contact_name; 
    this.currentClub.address_id = formValues.address_id;

    if (this.areWeEditingClub) {
      this.updateClub();
    } else {
      this.addClub();
    }
  }

  // This method is called onSubmit by onSubmit() if we are creating a club
  addClub() {
    this.clubsService.addClub(this.currentClub).subscribe({
      next: (newClub) => {
        //we succesfully added the club to the bdd
        //now opening image modal
        this.modalService.close(); //closing club modal
        this.currentClub = newClub; //updating to integrate club_id
        this.openImageModal();
      },
      error: () => {
        alert("Erreur lors de l'ajout du club");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a club
  updateClub() {
    this.clubsService.updateClub(this.currentClub).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.close();
      },
      error: () => {
        alert('Erreur lors de la mise à jour du club:');
      },
    });
  }

  deleteClub(club: Club) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce club ?')) {
      this.clubsService.deleteClub(club.club_id!).subscribe({
        next: () => {
        this.hydratation();
          this.modalService.close();
        },
        error: () => {
          alert('Erreur lors de la suppression du club');
        },
      });
    }
  }



  //PARTIE CLUBSCHEDULES
  // Ref of the template
  @ViewChild('clubSchedulesFormTemplate') clubSchedulesFormTemplate!: TemplateRef<any>;
  clubSchedulesForm! : FormGroup;
  currentClubSchedule: ClubSchedule = new ClubSchedule();
  areWeDeletingClubSchedule: boolean = false;
  areWeSelectingClubSchedule: boolean = false;
  areWeEditingClubSchedule: boolean = false;
  areWeCreatingClubSchedule: boolean = false;

  initClubSchedulesForm(): void {
    this.clubSchedulesForm = this.formBuilder.group({
      club_schedule_id: [{value: -1, disabled: true}],
      club_schedule_day_of_week: ['', Validators.required],
      club_schedule_start_time: ['', Validators.required],
      club_schedule_end_time: ['', Validators.required],
      club_schedule_notes: [''],
    });
  }

  // Open the ClubSchedules form: mod 1 = adding a new ClubSchedule, mod 2 = selecting an existing ClubSchedule, mod 3 = deleting an ClubSchedule, mod 4 = editing an ClubSchedule
  openClubSchedulesModal(mod: number) {
    this.areWeDeletingClubSchedule = false;
    this.areWeSelectingClubSchedule = false;
    this.areWeEditingClubSchedule = false;
    this.areWeCreatingClubSchedule = false;
    switch (mod) {
      case 1:
        this.areWeCreatingClubSchedule = true;
        this.initClubSchedulesForm(); //reseting the form
        this.modalService.open('Ajouter un horaire', this.clubSchedulesFormTemplate);
        break;
      case 2:
        this.areWeSelectingClubSchedule = true;
        this.initClubSchedulesForm(); //reseting the form
        this.modalService.open('Selectionner un horaire', this.clubSchedulesFormTemplate);
        break;
      case 3:
        this.areWeDeletingClubSchedule = true;
        this.initClubSchedulesForm(); //reseting the form
        this.modalService.open('Supprimer un horaire', this.clubSchedulesFormTemplate);
        break;
      case 4:
        this.areWeEditingClubSchedule= true;
        this.modalService.open('Editer un horaire', this.clubSchedulesFormTemplate);
        break;
    }
  }

  // Open the modal with given clubSchedule
  editClubSchedule(clubSchedule: ClubSchedule) {
    this.closeModal(); //closing selecting modal
    this.areWeEditingClubSchedule = true;

    this.clubSchedulesForm.patchValue({
      club_schedule_id: clubSchedule.club_schedule_id,
      club_schedule_day_of_week: clubSchedule.club_schedule_day_of_week,
      club_schedule_start_time: clubSchedule.club_schedule_start_time,
      club_schedule_end_time: clubSchedule.club_schedule_end_time,
      club_schedule_notes: clubSchedule.club_schedule_notes,
    });

    this.openClubSchedulesModal(4); //opening editing modal
  }

  // Checking if are updating a clubSchedule or if we are creating a new clubSchedule
  onClubSchedulesSubmit() {
    if (this.clubSchedulesForm.invalid){
      alert('Formulaire invalide');
      return;
    }

    this.currentClubSchedule.club_schedule_id = this.clubSchedulesForm.getRawValue().club_schedule_id;
    this.currentClubSchedule.club_schedule_day_of_week = this.clubSchedulesForm.getRawValue().club_schedule_day_of_week;
    this.currentClubSchedule.club_schedule_start_time = this.clubSchedulesService.timeStringToDate(this.clubSchedulesForm.getRawValue().club_schedule_start_time);
    this.currentClubSchedule.club_schedule_end_time = this.clubSchedulesService.timeStringToDate(this.clubSchedulesForm.getRawValue().club_schedule_end_time);
    this.currentClubSchedule.club_schedule_notes = this.clubSchedulesForm.getRawValue().club_schedule_notes;
    this.currentClubSchedule.club_id = this.currentClub.club_id;

    if (this.areWeEditingClubSchedule) {
      this.updateClubSchedule();
    } else {
      this.addClubSchedule();
    }
  }

  // This method is called onSubmit by onSubmit() if we are creating a clubSchedule
  addClubSchedule() {
    this.clubSchedulesService.addScheduleForClub(this.currentClub.club_id, this.currentClubSchedule).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout d'un horaire");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a clubSchedule
  updateClubSchedule() {
    this.clubSchedulesService.updateScheduleForClub(this.currentClub.club_id, this.currentClubSchedule).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.closeAll();
      },
      error: () => {
        alert('Erreur lors de la mise à jour de l\'horaire');
      },
    });
  }

    deleteClubSchedule(clubSchedule: ClubSchedule) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
      this.clubSchedulesService.deleteScheduleForClub(this.currentClub.club_id, clubSchedule.club_schedule_id).subscribe({
        next: () => {
        this.hydratation();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression de l\'horaire');
        },
      });
    }
  }



  //PARTIE LINKS
  // Ref of the template
  @ViewChild('linksFormTemplate') linksFormTemplate!: TemplateRef<any>;
  linksForm! : FormGroup;
  currentLink: Link = new Link();
  areWeDeletingLink: boolean = false;
  areWeSelectingLink: boolean = false;
  areWeEditingLink: boolean = false;
  areWeCreatingLink: boolean = false;

  initLinksForm(): void {
    this.linksForm = this.formBuilder.group({
      club_id: [{value: this.currentClub.club_id, disabled: true}, Validators.required],
      link_id: [{value: -1, disabled: true}, Validators.required],
      link_text: ['', Validators.required ],
      link_url: ['', Validators.required ],
    });
  }

  // Open the links form: mod 1 = adding a new link, mod 2 = selecting an existing link, mod 3 = deleting a link, mod 4 = editing a link
  openLinksModal(mod: number) {
    this.areWeDeletingLink = false;
    this.areWeSelectingLink = false;
    this.areWeEditingLink = false;
    this.areWeCreatingLink = false;
    switch (mod) {
      case 1:
        this.areWeCreatingLink = true;
        this.initLinksForm(); //reseting the form
        this.modalService.open('Ajouter un lien', this.linksFormTemplate);
        break;
      case 2:
        this.areWeSelectingLink = true;
        this.initLinksForm(); //reseting the form
        this.modalService.open('Selectionner un lien', this.linksFormTemplate);
        break;
      case 3:
        this.initLinksForm(); //reseting the form
        this.areWeDeletingLink = true;
        this.modalService.open('Supprimer un lien', this.linksFormTemplate);
        break;
      case 4:
        this.areWeEditingLink = true;
        this.modalService.open('Editer un lien', this.linksFormTemplate);
        break;
    }
  }

  // Open the modal with given link
  editLink(link: Link) {
    this.closeModal(); //closing selecting modal
    this.areWeEditingLink = true;
    this.currentLink = link;

    this.linksForm.patchValue({
      link_id: link.link_id,
      club_id: link.club_id,
      link_text: link.link_text,
      link_url: link.link_url,
    });

    this.openLinksModal(4); //opening editing modal
  }

  // Checking if are updating a link or if we are creating a new link
  onLinksSubmit() {
    if (this.linksForm.invalid){
      alert("Formulaire invalide");
      return;
    }
    this.currentLink = {...this.linksForm.getRawValue()};

    if (this.areWeEditingLink) {
      this.updateLink();
    } else {
      this.addLink();
    }
  }

  // This method is called onSubmit by onSubmit() if we are creating a link
  addLink() {
    this.linksService.addLink(this.currentLink).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.closeAll();
      },
      error: (error) => {
        alert("Erreur lors de l'ajout d'un lien");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a link
  updateLink() {
    this.linksService.updateLink(this.currentLink).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.closeAll();
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
        this.hydratation();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression du lien');
        },
      });
    }
  }



  //PARTIE ADDRESSE
  // Ref of the template
  @ViewChild('addressFormTemplate') addressFormTemplate!: TemplateRef<any>;
  addressForm! : FormGroup;
  currentAddress: Address = new Address();
  areWeDeletingAddress: boolean = false;
  areWeSelectingAddress: boolean = false;
  areWeEditingAddress: boolean = false;
  areWeCreatingAddress: boolean = false;

  initAddressForm(): void {
    this.addressForm = this.formBuilder.group({
      address_id: [{value: -1, disabled: true}],
      address_street: ['', Validators.required ],
      address_complement: [''],
      address_postal_code: ['', Validators.required],
      address_city: ['', Validators.required],
      address_country: ['', Validators.required],
    });
  }

  // Open the address form: mod 1 = adding a new address, mod 2 = selecting an existing address, mod 3 = deleting an address, mod 4 = editing an address
  openAddressModal(mod: number) {
    this.areWeDeletingAddress = false;
    this.areWeSelectingAddress = false;
    this.areWeEditingAddress = false;
    this.areWeCreatingAddress = false;
    switch (mod) {
      case 1:
        this.areWeCreatingAddress = true;
        this.initAddressForm(); //reseting the form
        this.modalService.open('Ajouter une adresse', this.addressFormTemplate);
        break;
      case 2:
        this.areWeSelectingAddress = true;
        this.initAddressForm(); //reseting the form
        this.modalService.open('Selectionner une adresse', this.addressFormTemplate);
        break;
      case 3:
        this.initAddressForm(); //reseting the form
        this.areWeDeletingAddress = true;
        this.modalService.open('Supprimer une adresse', this.addressFormTemplate);
        break;
      case 4:
        this.areWeEditingAddress = true;
        this.modalService.open('Editer une adresse', this.addressFormTemplate);
        break;
    }
  }

  // Open the modal with given address
  editAddress(address: Address) {
    this.closeModal(); //closing selecting modal
    this.areWeEditingAddress = true;
    this.currentAddress = address;

    this.addressForm.patchValue({
      address_id: address.address_id,
      address_street: address.address_street,
      address_complement: address.address_complement,
      address_postal_code: address.address_postal_code,
      address_city: address.address_city,
      address_country: address.address_country
    });

    this.openAddressModal(4); //opening editing modal
  }

  // Checking if are updating an address or if we are creating a new address
  onAddressSubmit() {
    if (this.addressForm.invalid) return; //invalid data in input

    this.currentAddress = {...this.addressForm.getRawValue()};

    if (this.areWeEditingAddress) {
      this.updateAddress();
    } else {
      this.addAddress();
    }
  }

    // This method is called onSubmit by onSubmit() if we are creating an address
  addAddress() {
    this.addressService.addAddress(this.currentAddress).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.close();
      },
      error: () => {
        alert("Erreur lors de l'ajout d'une adresse");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a club
  updateAddress() {
    this.addressService.updateAddress(this.currentAddress).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.close();
      },
      error: () => {
        alert('Erreur lors de la mise à jour de l\'adresse');
      },
    });
  }

    deleteAddress(address: Address) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      this.addressService.deleteAddress(address.address_id!).subscribe({
        next: () => {
        this.hydratation();
          this.modalService.close();
        },
        error: () => {
          alert('Erreur lors de la suppression de l\'adresse');
        },
      });
    }
  }


  //PARTIE IMAGE
  // Ref of the template
  @ViewChild('imageFormTemplate') imageFormTemplate!: TemplateRef<any>;
  imageForm! : FormGroup;
  currentImage: Image = new Image();
  selectedFileName: string = '';

  initImageForm(): void {
    this.imageForm = this.formBuilder.group({
      club_id: [{value: this.currentClub.club_id ?? -1, disabled: true}],
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
        this.currentImage.club_id = this.currentClub.club_id;
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
    if (this.imageForm.invalid){
      alert("Formulaire invalide");
    } else {
      this.addImage(); //adding image to db
    }
  }

  addImage() {
    this.imagesService.addImage(this.currentImage).subscribe({
      next: () => {
      this.hydratation();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout de l'image");
      },
    });
  }
}
