import { Roles } from './blocks';
import { PermissionsCheck } from '../permissions-check';
const AccountRolesContent = () => {
  return (
   <div className="grid gap-5 lg:gap-7.5">
      <Roles />

      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5">
       <PermissionsCheck />
      </div>

    </div>
  
);
}

export { AccountRolesContent };
