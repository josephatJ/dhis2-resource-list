import { createAction, props } from "@ngrx/store";

export enum DocumentsActionsTypes {
  LoadDocumentsConfigurations = "[Documents] load Documents configurations",
  AddLoadedDocumentsConfigurations = "[Documents] add loaded Documents configurations",
  LoadingDocumentsConfigurationsFail = "[Documents] loading Documents configurations fail",
  LoadDocuments = "[Documents] load documents",
  AddLoadedDocuments = "[Documents] add loaded Documents",
  LoadingDocumentsFail = "[Documents] loading documents failed"
}

export const loadDocumentsConfigurations = createAction(
  "[Documents] load Documents configurations",
  props<{ url: string }>()
);

export const addLoadedDocumentsConfigurations = createAction(
  "[Documents] add loaded Documents configurations",
  props<{ DocumentsConfigs: any }>()
);

export const loadingDocumentsConfigurationsFail = createAction(
  "[Documents] loading Documents configurations fail",
  props<{ error: any }>()
);

export const loadDocuments = createAction(
  "[Documents] load documents",
  props<{ documents: any }>()
);

export const addLoadedDocuments = createAction(
  "[Documents] add loaded Documents",
  props<{ documentsInfo: any }>()
);

export const loadingDocumentsFail = createAction(
  "[Documents] loading documents failed",
  props<{ error: any }>()
);
