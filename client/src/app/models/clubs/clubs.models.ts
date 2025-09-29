import { Address } from "../address/address.models";
import { Link } from "../links/links.models";
import { Image } from "../images/images.models";
import { ClubSchedule } from "../club-schedules/club-schedules.models";

export class Club{
    club_id : number = -1; 
    club_name: string = '';
    club_contact_name: string ='';
    club_contact_phone: string ='';
    club_contact_email: string ='';
    address_id: number = -1;
    club_address!: Address;
    club_schedules! :ClubSchedule[]; 
    club_links! : Link[];
    club_images! : Image[];
}
