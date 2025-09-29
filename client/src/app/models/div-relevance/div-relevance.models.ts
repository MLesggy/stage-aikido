import { Image } from "../images/images.models";
import { Milestone } from "../milestones/milestones.models";
import { Story } from "../stories/stories.models";

export class DivRelevance {
    div_relevance_id: number = -1;
    div_relevance_image_id?: number = -1;
    div_relevance_story_id: number = -1;
    div_relevance_milestone_id: number = -1;
    div_relevance_image!: Image[];
    div_relevance_story: Story = new Story();
    div_relevance_milestone: Milestone = new Milestone();
}