import { MiscFaq, MiscHelp2 } from '@/partials/misc';
import { Users } from './blocks/users';

interface NetworkSaasUsersContentProps {
  hideRowsPerPage?: boolean;
}

const NetworkSaasUsersContent = ({ hideRowsPerPage = false }: NetworkSaasUsersContentProps) => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Users hideRowsPerPage={hideRowsPerPage} />
    </div>
  );
};

export { NetworkSaasUsersContent };
