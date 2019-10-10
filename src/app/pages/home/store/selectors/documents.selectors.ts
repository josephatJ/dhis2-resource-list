import {
  createFeatureSelector,
  MemoizedSelector,
  createSelector
} from "@ngrx/store";
import { DocumentsState, documentsAdapter } from "../states/documents.states";

export const getDocumentsState: MemoizedSelector<
  object,
  DocumentsState
> = createFeatureSelector<DocumentsState>("documents");

export const {
  selectEntities: getDocumentsEntities,
  selectAll: getDocuments
} = documentsAdapter.getSelectors(getDocumentsState);

export const getDocumentsConfigurations = createSelector(
  getDocumentsState,
  (state: DocumentsState) => state.configurations
);
