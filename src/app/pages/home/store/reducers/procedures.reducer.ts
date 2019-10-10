import { createReducer, on } from "@ngrx/store";
import {
  initialDocumentsState,
  documentsAdapter,
  DocumentsState
} from "../states/documents.states";
import {
  loadDocumentsConfigurations,
  addLoadedDocumentsConfigurations,
  loadingDocumentsConfigurationsFail,
  loadDocuments,
  addLoadedDocuments
} from "../actions";
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState
} from "src/app/store/states/base.state";

export const reducer = createReducer(
  initialDocumentsState,
  on(loadDocumentsConfigurations, state => ({
    ...state,
    ...loadingBaseState
  })),
  on(addLoadedDocumentsConfigurations, (state, { DocumentsConfigs }) => ({
    ...state,
    configurations: DocumentsConfigs
  })),
  on(loadingDocumentsConfigurationsFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error
  })),
  on(loadDocuments, state => ({
    ...state
  })),
  on(addLoadedDocuments, (state, { documentsInfo }) =>
    documentsAdapter.addOne(documentsInfo, { ...state })
  )
);

export function documentReducer(state, action): DocumentsState {
  return reducer(state, action);
}
