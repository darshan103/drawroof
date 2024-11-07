import { RouterModule, Routes } from '@angular/router';
import { DrawroofComponent } from './drawroof/drawroof.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

const routes: Routes = [
    { path: '', component: DrawroofComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }