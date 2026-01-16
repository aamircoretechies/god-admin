import { KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';

interface IBasicSettingsProps {
  title: string;
}

const BasicSettings = ({ title }: IBasicSettingsProps) => {
  const { currentUser } = useAuthContext();
  const userEmail = currentUser?.email || '';
  
  // These would come from user data in a real implementation
  const emailVerified = true; // Placeholder - would come from user data
  const phoneVerified = currentUser?.phone ? true : false; // Placeholder - would come from user data

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-36 text-gray-600 font-normal">Email</td>
              <td className="py-2 min-w-60">
                {userEmail ? (
                  <a
                    href={`mailto:${userEmail}`}
                    className="text-gray-800 font-normal text-sm hover:text-primary-active"
                  >
                    {userEmail}
                  </a>
                ) : (
                  <span className="text-gray-800 font-normal text-sm">-</span>
                )}
              </td>
              <td className="py-2 max-w-16 text-end"></td>
            </tr>

            <tr>
              <td className="py-2 text-gray-600 font-normal">Email Status</td>
              <td className="py-2 text-gray-800 font-normal">
                <span
                  className={`badge badge-sm badge-outline ${
                    emailVerified ? 'badge-success' : 'badge-danger'
                  }`}
                >
                  {emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </td>
              <td className="py-2 text-end"></td>
            </tr>

            {/* <tr>
              <td className="py-2 text-gray-600 font-normal">Phone Status</td>
              <td className="py-2 text-gray-800 font-normal">
                <span
                  className={`badge badge-sm badge-outline ${
                    phoneVerified ? 'badge-success' : 'badge-danger'
                  }`}
                >
                  {phoneVerified ? 'Verified' : 'Not Verified'}
                </span>
              </td>
              <td className="py-2 text-end"></td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { BasicSettings, type IBasicSettingsProps };
