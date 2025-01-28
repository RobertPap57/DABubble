import { Component } from '@angular/core';
import { ImprintComponent } from "../imprint/imprint.component";
import { PrivacyPolicyComponent } from "../privacy-policy/privacy-policy.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ImprintComponent, PrivacyPolicyComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
