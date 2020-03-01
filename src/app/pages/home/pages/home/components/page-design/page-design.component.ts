import { Component, OnInit } from "@angular/core";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";
import { ActivatedRoute } from "@angular/router";
declare var tinymce: any;
declare var tinyMCE: any;
@Component({
  selector: "app-page-design",
  templateUrl: "./page-design.component.html",
  styleUrls: ["./page-design.component.css"]
})
export class PageDesignComponent implements OnInit {
  currentDesignPageId: string;
  html: any = `<h5 style="text-alin: center">Your editor</h5>`;
  tinmceConfigs: any = {
    height: "600px",
    id: "tinymce-contents",
    // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
    plugins:
      "print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern",
    toolbar:
      "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat",
    image_advtab: true,
    imagetools_toolbar:
      "rotateleft rotateright | flipv fliph | editimage imageoptions"
  };
  editorOptions = { theme: "vs-dark", language: "javascript" };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  constructor(
    private httpClient: NgxDhis2HttpClientService,
    private route: ActivatedRoute
  ) {
    this.currentDesignPageId = this.route.snapshot.params["id"];
    this.httpClient
      .get("dataStore/pages-design/" + this.route.snapshot.params["id"])
      .subscribe(design => {
        if (design) {
          this.html = design["pageHtmlCodes"];
        }
      });
  }

  ngOnInit() {}

  save() {
    console.log("htmlcodes", this.html);
    const data = {
      id: this.route.snapshot.params["id"],
      pageHtmlCodes: this.html
    };
    this.httpClient
      .put("dataStore/pages-design/" + this.route.snapshot.params["id"], data)
      .subscribe(response => {
        console.log(response);
      });
  }

  getDesign(id) {
    this.currentDesignPageId = id;
    this.httpClient.get("dataStore/pages-design/" + id).subscribe(design => {
      if (design) {
        this.html = design["pageHtmlCodes"];
      }
    });
  }
}
