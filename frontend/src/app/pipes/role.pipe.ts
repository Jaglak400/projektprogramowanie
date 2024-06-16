import { Pipe, PipeTransform } from '@angular/core';
import { RoleResponse } from '../model/role.response';

@Pipe({
  name: 'formatRole'
})
export class RolePipe implements PipeTransform {

  // Transformacja roli na odpowiednią postać tekstową
  transform(role: RoleResponse): string {
    let roleStr = role.name; // Pobranie nazwy roli z obiektu RoleResponse
    return roleStr.split('_')[1]; // Zwrócenie drugiej części nazwy roli (po podziale na podkreślenie)
  }

}
