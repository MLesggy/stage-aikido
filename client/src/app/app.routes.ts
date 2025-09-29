import { Routes } from '@angular/router';
import { TechniquesComponent } from './pages/techniques/techniques.component';
import { HomeComponent } from './pages/home/home.component';
import { LinksComponent } from './pages/links/links.component';
import { MilestonesComponent } from './pages/milestones/milestones.component';
import { SeminarsComponent } from './pages/seminars/seminars.component';
import { SeminarViewComponent } from './pages/seminar-view/seminar-view.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { EditClubsComponent } from './pages/edit-clubs/edit-clubs.component';
import { EditHomeComponent } from './pages/edit-home/edit-home.component';
import { EditLinksComponent } from './pages/edit-links/edit-links.component';
import { EditMilestonesComponent } from './pages/edit-milestones/edit-milestones.component';
import { EditSeminarsComponent } from './pages/edit-seminars/edit-seminars.component';
import { EditTechniquesComponent } from './pages/edit-techniques/edit-techniques.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';

export const routes: Routes = [
    // Routes avec header et footer
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'clubs', component: ClubsComponent},
    {path: 'links', component: LinksComponent},
    {path: 'milestones', component: MilestonesComponent},
    {path: 'seminar-view/:id', component: SeminarViewComponent},
    {path: 'reset-password', component: PasswordRecoveryComponent},
    {path: 'seminars', component: SeminarsComponent},
    {path: 'techniques', component: TechniquesComponent},
    {path: 'login', component: LoginComponent},
    
    // Routes utilisant le layout dashboard
    {
        path: 'dashboard',
        component: MainLayoutComponent, 
        children: [
            {path: 'home', component: DashboardHomeComponent},
            {path: 'edit-clubs', component: EditClubsComponent},
            {path: 'edit-home', component: EditHomeComponent},
            {path: 'edit-links', component: EditLinksComponent},
            {path: 'edit-milestones', component: EditMilestonesComponent},   
            {path: 'edit-seminars', component: EditSeminarsComponent},
            {path: 'edit-techniques', component: EditTechniquesComponent},
            {path: '**', redirectTo: 'home', pathMatch: 'full'},
        ]
    },
    
    // Routes sans header ni footer
    {path: 'change-email', component: ChangeEmailComponent},
    {path: 'change-password', component: ChangePasswordComponent},
    
    {path: '**', component: HomeComponent}
];