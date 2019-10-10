import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { UtilityService } from "src/app/core/services/utility.service";
import { FileManageService } from "src/app/core/services/file-manage.service";
import { Store } from "@ngrx/store";
import { State } from "src/app/store/reducers";
import { loadDocumentsConfigurations } from "../../store/actions";
import { Observable } from "rxjs";
import { getDocumentsConfigurations } from "../../store/selectors";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";

declare var $;

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  hasPriviledge = false;
  documents: any[] = [];
  resourceName: string;
  resourceType: string;
  url: string;
  searchParameter: string;

  loadingFiles = true;
  updatingView = false;

  pageEvent: any = {
    previousPageIndex: -1,
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  pages: any[] = [];
  pageSize = 10;
  numberOfItems = 0;

  resourcesList$: Observable<any>;
  documentGroupId: string;
  departmentId: string;
  animal: string;
  isModalSet: boolean = false;
  resourceListConfigsFromStore: any;
  loadedDocIds: Array<string> = [];

  constructor(
    private utility: UtilityService,
    private service: FileManageService,
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: NgxDhis2HttpClientService
  ) {
    if (this.router.url.indexOf("procedures") > -1) {
      this.documentGroupId = "procedures";
      this.store.dispatch(loadDocumentsConfigurations({ url: "procedures" }));
    } else {
      this.documentGroupId = "forms";
      this.store.dispatch(loadDocumentsConfigurations({ url: "forms" }));
    }
    this.resourcesList$ = store.select(getDocumentsConfigurations);
  }

  ngOnInit() {
    this.loadingFiles = true;
    this.route.params.forEach((params: Params) => {
      this.departmentId = params["id"];
      this.service.getAllDocuments().subscribe(allDocuments => {
        if (allDocuments) {
          _.map(allDocuments["documents"], document => {
            this.loadedDocIds.push(document.id);
          });
        }
      });
      this.service.checkIfAllAccessLevel().subscribe(
        hasPriviledge => {
          this.hasPriviledge = hasPriviledge;
          this.resourcesList$.subscribe(resourcesConfigs => {
            if (resourcesConfigs) {
              this.resourceListConfigsFromStore = resourcesConfigs;
              _.map(resourcesConfigs, resource => {
                if (resource.id == this.departmentId) {
                  let docIds = [];
                  _.map(resource["documents"], document => {
                    docIds.push(document.id);
                  });
                  this.getResources(docIds);
                }
              });
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  cancelModal(e) {
    this.isModalSet = false;
  }

  fileUploaded(resource) {
    this.updatingView = false;
    if (resource.resourceName && resource.resourceType) {
      this.resourceName = resource.resourceName;
      this.resourceType = resource.resourceType;
      this.url = resource.url;

      if (
        resource.hasFile &&
        resource.file === undefined &&
        resource.resourceType === "document"
      ) {
        $("#fileSelector").trigger("click");
      } else {
        this.updatingView = true;
        const formData = {
          name: resource.resourceName,
          external: resource.resourceType === "document" ? false : true,
          attachment: true,
          url: resource.url,
          upload: resource.file
        };
        const resourceItem = this.service._refineResource(formData);
        this.httpClient
          .post("../../../dhis-web-reporting/saveDocument.action", resourceItem)
          .subscribe(
            response => {
              console.log("resp", response);
            },
            error => {
              console.log("error", error);
              this.service.getAllDocuments().subscribe(documents => {
                if (documents) {
                  if (
                    this.loadedDocIds.indexOf(documents["documents"][0].id) ==
                    -1
                  ) {
                    _.map(this.resourceListConfigsFromStore, resourceList => {
                      if (resourceList.id == this.departmentId) {
                        let newObject = {
                          description: resourceList.description,
                          documents: [],
                          id: resourceList.id,
                          name: resourceList.name
                        };
                        resourceList.documents.forEach(doc => {
                          newObject.documents.push(doc);
                        });
                        newObject.documents.push({
                          id: documents["documents"][0].id,
                          name: documents["documents"][0].name
                        });
                        let newResourceData = [];
                        _.map(this.resourceListConfigsFromStore, resource => {
                          if (resource.id == newObject.id) {
                            newResourceData.push(newObject);
                            let docIds = [];
                            _.map(newObject["documents"], document => {
                              docIds.push(document.id);
                            });
                            this.getResources(docIds);
                          } else {
                            newResourceData.push(resource);
                          }
                        });
                        console.log(
                          "resourceListConfigsFromStore",
                          this.resourceListConfigsFromStore
                        );
                        console.log("newResourceData", newResourceData);
                        this.httpClient
                          .put(
                            "dataStore/documents/" + this.documentGroupId,
                            newResourceData
                          )
                          .subscribe(response => {
                            console.log(response);
                          });
                      }
                    });
                  }
                }
              });
            }
          );
      }
    }
    this.isModalSet = false;
  }

  setModal(action) {
    if (action == "open") {
      this.isModalSet = true;
    } else {
      this.isModalSet = false;
    }
  }

  searchingItem(searchParameter) {
    const docs = _.filter(this.documents, document => {
      return (
        document.name.toLowerCase().indexOf(searchParameter.toLowerCase()) >= 0
      );
    });
    this.numberOfItems = docs.length;
    this.pages =
      searchParameter !== ""
        ? this.preparePages(docs, this.pageSize)
        : this.preparePages(this.documents, this.pageSize);
    this.pageEvent = {
      previousPageIndex: -1,
      pageIndex: 0,
      pageSize: 10,
      length: 10
    };
    // console.log(docs);
  }

  onFilesChange(fileList: FileList) {
    // do stuff here
    this.fileSelection(true, fileList[0]);
  }

  openResource(document) {
    if (document.external) {
      window.open(document.url, "_blank");
    } else {
      window.open("../../../api/documents/" + document.id + "/data", "_blank");
    }
  }

  deleteDocument(document) {
    this.updatingView = true;
    this.service.deleteResource(document.id).subscribe(
      response => {
        this.updatingView = false;
        this.resourcesList$.subscribe(resourcesConfigs => {
          if (resourcesConfigs) {
            _.map(resourcesConfigs, resource => {
              if (resource.id == this.departmentId) {
                let docIds = [];
                _.map(resource["documents"], document => {
                  docIds.push(document.id);
                });
                this.getResources(docIds);
              }
            });
          }
        });
      },
      error => {}
    );
  }

  fileSelection(hasFile, file) {
    hasFile ? (this.resourceType = "document") : (this.resourceType = "link");
    return {
      name: "",
      resourceType: this.resourceType,
      hasFile: hasFile,
      file: file,
      url: ""
    };
  }

  fileSelector(event) {
    this.utility.sendData({
      resourceName: this.resourceName,
      resourceType: this.resourceType,
      hasFile: true,
      file: event.target.files[0],
      url: this.url
    });
  }

  getResources(ids) {
    this.service.getResources(ids).subscribe(
      response => {
        this.documents = response.documents.map(document => {
          this.resourcesList$.subscribe(list => {});
          document.name = this.refineName(document.name);
          return document;
        });
        this.numberOfItems = this.documents.length;
        this.pages = this.preparePages(this.documents, this.pageEvent.pageSize);
        this.loadingFiles = false;
      },
      error => {
        this.loadingFiles = false;
      }
    );
  }

  refineName(name) {
    const nameArray = name.split("_");
    return nameArray.length > 1 ? nameArray[1] : nameArray[0];
  }

  preparePages(documents, pageSize) {
    return _.chunk(documents, pageSize);
  }
}
