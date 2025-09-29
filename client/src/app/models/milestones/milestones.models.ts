export enum MilestoneStyle {
    QUINCONCE = 'quinconce',
    NORMAL = 'normal'
}

export class Milestone {
    milestone_id: number = -1;
    milestone_title: string = "";
    milestone_style: MilestoneStyle = MilestoneStyle.NORMAL;
}