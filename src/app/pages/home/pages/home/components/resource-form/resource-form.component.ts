import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { UtilityService } from "src/app/core/services/utility.service";
import { FileManageService } from "src/app/core/services/file-manage.service";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";

export interface DialogData {
  animal: string;
  resourceType: string;
  hasFile: boolean;
  file: File;
}

@Component({
  selector: "app-resource-form",
  templateUrl: "resource-form.component.html"
})
export class ResourceFormComponent {
  @Output() cancelModal: EventEmitter<any> = new EventEmitter();
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter();
  resourceName: string;
  resourceType: string;
  hasFile = false;
  file: File;
  url?: string;
  data: any;

  nameisEmpty = false;

  constructor(
    private utility: UtilityService,
    private service: FileManageService,
    private httpClient: NgxDhis2HttpClientService
  ) {}

  fileSelection(event) {
    this.utility.sendData({
      resourceName: this.resourceName,
      resourceType: this.resourceType,
      hasFile: this.hasFile,
      file: event.target.files[0],
      url: this.url
    });

    this.fileUploaded.emit({
      resourceName: this.resourceName,
      resourceType: this.resourceType,
      hasFile: this.hasFile,
      file: event.target.files[0],
      url: this.url
    });
  }

  cancelTheModal() {
    this.cancelModal.emit();
  }

  onNoClick(): void {
    if (this.resourceName) {
      this.nameisEmpty = false;
      if (this.resourceType === "document") {
        const element: HTMLElement = document.getElementById(
          "fileSelector"
        ) as HTMLElement;
        element.click();
      } else {
        this.utility.sendData({
          resourceName: this.resourceName,
          resourceType: this.resourceType,
          hasFile: this.hasFile,
          file: this.file,
          url: this.url
        });
      }
    } else {
      this.nameisEmpty = true;
    }
  }

  openFileDialog() {
    console.log(this.data);
  }

  cancel(): void {}
}
