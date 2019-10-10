import { BaseState, initialBaseState } from "src/app/store/states/base.state";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

export interface DocumentsState extends BaseState, EntityState<any> {
  configurations: any;
}

export const documentsAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialDocumentsState = documentsAdapter.getInitialState({
  ...initialBaseState,
  configurations: null
});
