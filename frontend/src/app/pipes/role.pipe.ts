import { Pipe, PipeTransform } from '@angular/core';
import { RoleResponse } from '../model/role.response';

@Pipe({
  name: 'formatRole'
})
export class RolePipe implements PipeTransform {

  transform(role: RoleResponse): string {
    let roleStr = role.name;
    return roleStr.split('_')[1];
  }

}
