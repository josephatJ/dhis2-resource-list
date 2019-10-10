import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UtilityService {
  @Output() fireEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  sendData(data) {
    this.fireEvent.emit(data);
  }
}
