import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import {
  loadDocumentsConfigurations,
  addLoadedDocumentsConfigurations,
  loadingDocumentsConfigurationsFail,
  loadDocuments,
  addLoadedDocuments
} from "../actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { GetResourcesService } from "../../services/get-resources.service";

@Injectable()
export class DocumentsEffect {
  constructor(
    private resourcesService: GetResourcesService,
    private actions$: Actions
  ) {}

  DocumentsConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDocumentsConfigurations),
      switchMap(action =>
        this.resourcesService.getConfigurations(action.url).pipe(
          map(DocumentsConfigs =>
            addLoadedDocumentsConfigurations({ DocumentsConfigs })
          ),
          catchError((error: any) =>
            of(loadingDocumentsConfigurationsFail({ error }))
          )
        )
      )
    )
  );

  Documents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDocuments),
      switchMap(action =>
        this.resourcesService.getDocuments(action.documents.docIds).pipe(
          map(data =>
            addLoadedDocuments({
              documentsInfo: {
                id: action.documents.id,
                documents: data.documents
              }
            })
          )
        )
      )
    )
  );
}
