import { Address } from "../address/address.models";
import { Image } from "../images/images.models";

export class Seminar {
    seminar_id: number = -1;
    seminar_title: string = "";
    seminar_start_time: Date = new Date();
    seminar_end_time: Date = new Date();
    seminar_description: string = "";
    seminar_price: number = -1;
    seminar_professor: string = "";
    seminar_email: string = "";
    seminar_phone: string = "";
    address_id: number = -1;
    seminar_address!: Address;
    seminar_image!: Image[];
}