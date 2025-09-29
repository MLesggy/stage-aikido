import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Seminar } from '../../models/seminars/seminars.models';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { AddressService } from '../../services/address/adress.service';
import { AuthService } from '../../services/auth-service/authentication';
import { Address } from '../../models/address/address.models';
import { Image } from '../../models/images/images.models';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../services/modal/modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagesService } from '../../services/images/images.service';

@Component({
  selector: 'app-edit-seminars',
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './edit-seminars.component.html',
  styleUrl: './edit-seminars.component.css'
})
export class EditSeminarsComponent {
  currentRoute: string = '';
  seminars!: Seminar[];
  address!: Address[];
  images!: Image[];
  currentMonth: number = new Date().getMonth();

  constructor(public seminarsService: SeminarsService, public addressService: AddressService, public authService: AuthService, public modalService : ModalService, private formBuilder: FormBuilder, private imagesService: ImagesService){}
  
  ngOnInit(): void {
    this.getSeminars();
    this.getAddress();
  }

  reloadData(){
    this.getSeminars();
    this.getAddress();   
  }

  getSeminars() {
    this.seminarsService.getSeminars().subscribe((seminarsData: any) => {
      if (Array.isArray(seminarsData)) {
        // all Objects
        this.seminars = seminarsData.map((seminarData: any) => {
          return Object.assign(new Seminar(), seminarData);
        });
      } else {
        //single object
        this.seminars = [Object.assign(new Seminar(), seminarsData)];
      }
      this.imagesService.processEntitiesImages(this.seminars, (seminar: Seminar) => seminar.seminar_image);
      //console.log(this.seminars);
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
      //console.log(this.address);
    });
  }

  // Ref of the template
  @ViewChild('seminarFormTemplate') seminarFormTemplate!: TemplateRef<any>;
  seminarForm! : FormGroup; //the formControl
  currentSeminar: Seminar = new Seminar(); //currentSeminar we will use send to database
  areWeCreatingSeminar: boolean = false; //boolean to check if we are creating a seminar
  areWeEditingSeminar: boolean = false; //boolean to check if we are editing a seminar

  //Initialize the SeminarForm
  initSeminarForm(): void {
    this.seminarForm = this.formBuilder.group({
      seminar_id: [{value: -1, disabled: true}],
      seminar_title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      seminar_start_time: ['', Validators.required],
      seminar_end_time: ['', Validators.required],
      seminar_description: ['', Validators.required],
      seminar_price: ['', Validators.required],
      seminar_professor: ['', Validators.required],
      seminar_email: ['', Validators.required],
      seminar_phone: ['', Validators.required],
      address_id: ['', Validators.required]
    });
  }

  // Open the form, mod: 1 creating a seminar, mod: 2 updating a seminar
  openSeminarModal(mod: number) {
    this.areWeCreatingSeminar = false;
    this.areWeEditingSeminar = false;

    switch(mod) {
      case 1:
        //creating the seminar THEN give user img form
        this.initSeminarForm(); //reseting the form
        this.areWeCreatingSeminar = true;
        this.modalService.open('Ajouter un seminaire', this.seminarFormTemplate);
        break;
      case 2:
        this.areWeEditingSeminar = true;
        this.modalService.open('Editer un seminaire', this.seminarFormTemplate);
        break;
    }
  }

  // Open the modal with given seminar
  editSeminar(seminar: Seminar) {
    this.areWeEditingSeminar = true;
    this.initSeminarForm(); //if we havnt creating a seminar before, we must initialize it
    this.currentSeminar = seminar;

    this.seminarForm.patchValue({
      seminar_id: seminar.seminar_id,
      seminar_title: seminar.seminar_title,
      seminar_description: seminar.seminar_description,
      seminar_price: seminar.seminar_price,
      seminar_professor: seminar.seminar_professor,
      seminar_email: seminar.seminar_email,
      seminar_phone: seminar.seminar_phone,
      address_id: seminar.address_id,
      seminar_start_time: new Date(seminar.seminar_start_time).toISOString().slice(0, 16),
      seminar_end_time: new Date(seminar.seminar_end_time).toISOString().slice(0, 16)
  });
      
    this.openSeminarModal(2);
  }

  // Helper function to format dates for datetime-local input
  formatDateForInput(dateValue: Date): string {
    return dateValue.toISOString().slice(0, 16);
  }

  // Checking if are updating a seminar or if we are creating a new seminar
  onSeminarSubmit() {
    if (this.seminarForm.invalid){
      alert('Formulaire invalide');
      return;
    }

    // Convert string dates from form to Date objects
    const formValues = {...this.seminarForm.getRawValue()}; // shallow copy of input values.
    formValues.seminar_start_time = new Date(formValues.seminar_start_time);
    formValues.seminar_end_time = new Date(formValues.seminar_end_time);

    this.currentSeminar.seminar_title = formValues.seminar_title;
    this.currentSeminar.seminar_description = formValues.seminar_description;
    this.currentSeminar.seminar_price = formValues.seminar_price;
    this.currentSeminar.seminar_professor = formValues.seminar_professor;
    this.currentSeminar.seminar_email = formValues.seminar_email;
    this.currentSeminar.seminar_phone = formValues.seminar_phone;
    this.currentSeminar.address_id = formValues.address_id;
    this.currentSeminar.seminar_start_time = formValues.seminar_start_time;
    this.currentSeminar.seminar_end_time = formValues.seminar_end_time;

    if (this.areWeEditingSeminar) {
      this.updateSeminar();
    } else {
      this.addSeminar();
    }
  }

  // This method is called onSubmit by onSubmit() if we are creating a seminar
  addSeminar() {
    this.seminarsService.addSeminar(this.currentSeminar).subscribe({
      next: (newSeminar) => {
        //we succesfully added the seminar to the bdd
        //now opening image modal
        this.modalService.closeAll(); //closing seminar modal
        this.currentSeminar = newSeminar; //updating to integrate seminar_id
        this.openImageModal();
      },
      error: () => {
        alert("Erreur lors de l'ajout du seminaire");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a seminar
  updateSeminar() {
    this.seminarsService.updateSeminar(this.currentSeminar).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert('Erreur lors de la mise à jour du seminaire');
      },
    });
  }

  deleteSeminar(seminar: Seminar) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce seminaire ?')) {
      this.seminarsService.deleteSeminar(seminar.seminar_id!).subscribe({
        next: () => {
          this.reloadData();
          this.modalService.closeAll();
        },
        error: () => {
          alert('Erreur lors de la suppression du seminaire');
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
    this.modalService.close(); //closing selecting modal
    this.areWeEditingAddress = true;

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
    if (this.addressForm.invalid){
      alert('Formulaire invalide');
      return;
    }

    this.currentAddress = {...this.addressForm.getRawValue()};;

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
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout d'une adresse");
      },
    });
  }

  // This method is called onSubmit by onSubmit() if we are modifying a seminar
  updateAddress() {
    this.addressService.updateAddress(this.currentAddress).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
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
          this.reloadData();
          this.modalService.closeAll();
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
      seminar_id: [{value: this.currentSeminar.seminar_id ?? -1, disabled: true}],
      image_description: [''],
      image_blob: ['', Validators.required],
    });
  }

  // Open the image form with given seminarId or -1 if we dont provide anything
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
        this.currentImage.seminar_id = this.currentSeminar.seminar_id; //seminarId ou ClubId au besoin
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
      alert('Formulaire invalide');
    } else {
      this.addImage(); //adding image to db
    }
  }

  addImage() {
    this.imagesService.addImage(this.currentImage).subscribe({
      next: () => {
        this.reloadData();
        this.modalService.closeAll();
      },
      error: () => {
        alert("Erreur lors de l'ajout de l'image");
      },
    });
  }

}
