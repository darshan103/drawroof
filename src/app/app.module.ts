import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { DrawroofModule } from "./drawroof/drawroof.module";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

@NgModule({
    declarations: [
        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DrawroofModule
    ],
    providers : [
        provideHttpClient(),
    ]
 })
export class AppModule { }