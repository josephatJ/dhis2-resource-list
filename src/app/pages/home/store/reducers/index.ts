import { StoreModule } from "@ngrx/store";
import { documentReducer } from "./procedures.reducer";

export const reducers: any[] = [
  StoreModule.forFeature("documents", documentReducer)
];
