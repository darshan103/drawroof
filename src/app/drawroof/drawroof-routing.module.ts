import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DrawroofComponent } from "./drawroof.component";

const routes: Routes = [
    {
        path: "",
        component: DrawroofComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DrawroofRoutingModule { }