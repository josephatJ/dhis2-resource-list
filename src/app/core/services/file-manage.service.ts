import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NgxDhis2HttpClientService } from "@iapps/ngx-dhis2-http-client";

@Injectable({
  providedIn: "root"
})
export class FileManageService {
  constructor(private httpClient: NgxDhis2HttpClientService) {}

  checkIfAllAccessLevel(): Observable<any> {
    return Observable.create(observer => {
      this.httpClient
        .get(
          "me.json?fields=id,name,userCredentials[userRoles[*]]&paging=false"
        )
        .subscribe(
          response => {
            observer.next(this.userAthorityCheck(response));
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
          }
        );
    });
  }

  userAthorityCheck(user) {
    let hasAccess = false;
    user.userCredentials.userRoles.forEach(role => {
      role.authorities.forEach(authority => {
        if (authority === "ALL") {
          hasAccess = true;
        }
      });
    });
    return hasAccess;
  }

  /**
   * Getting the list of applicants/applicantions from api endpoint
   */
  getResources(docIds): Observable<any> {
    return Observable.create(observer => {
      this.httpClient
        .get(
          "documents.json?fields=*&paging=false&filter=id:in:[" +
            docIds.join(",") +
            "]"
        )
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
          }
        );
    });
  }

  getAllDocuments(): Observable<any> {
    return this.httpClient.get(
      "documents.json?fields=*&paging=false&order=created:desc"
    );
  }

  deleteResource(itemId) {
    return Observable.create(observer => {
      this.getDocumentId(itemId).subscribe(
        response => {
          const formData = new FormData();
          formData.append("id", response);
          this.httpClient
            .post(
              "../../../../dhis-web-reporting/removeDocument.action",
              formData
            )
            .subscribe(
              deleteResponse => {
                observer.next(deleteResponse);
                observer.complete();
              },
              error => {
                observer.error(error);
                observer.complete();
              }
            );
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  getDocumentId(uid) {
    // '/api/sqlViews/U1hefeaue73/data.json?var=uid:' + uid;
    return Observable.create(observer => {
      this.httpClient
        .get("sqlViews/U1hefeaue73/data.json?var=uid:" + uid)
        .subscribe(
          (response: any) => {
            let id = null;
            try {
              id = response.rows[0][0];
            } catch (e) {
              id = null;
            }
            observer.next(id);
            observer.complete();
          },
          error => {
            observer.error(error);
            observer.complete();
          }
        );
    });
  }

  _refineResource(resource) {
    const newResource = {};
    if (resource.external === true) {
      newResource["url"] = resource.url;
      newResource["external"] = resource.external;
      newResource["name"] = resource.name;
    } else {
      newResource["upload"] = resource.upload;
      newResource["external"] = "false";
      newResource["attachment"] = resource.attachment;
      newResource["name"] = resource.name;
    }

    const formData = new FormData();
    for (const property in newResource) {
      if (newResource[property]) {
        formData.append(property, newResource[property]);
      }
    }
    return formData;
  }
}
