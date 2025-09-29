export class Image{
    image_id: number = -1;
    image_name: string = "";
    image_size: number = 0;
    image_type: string = "";
    image_description: string = "";
    image_blob: Blob | ArrayBuffer | { data: number[] } = new Blob();
    club_id: number | null = null;
    seminar_id: number | null = null;
}