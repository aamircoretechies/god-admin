import { Fragment, useState } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { UserActivityDetailContent } from './UserActivityDetailContent';
import { useNavigate } from "react-router-dom";
import { blockUser, suspendUser } from "@/services/activityLogsApi";
import { toast } from "sonner";
import { useParams } from "react-router-dom";




const UserActivityDetail = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const { id } = useParams();
  const currentUserId = id ?? "";

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState("");



  const handleBlockUser = async () => {
    try {
      console.log(" BLOCK USER API TRIGGERED");
      console.log(" User ID:", currentUserId);
      console.log(" Reason:", reason);
      console.log(" Duration:", duration);

      const res = await blockUser(currentUserId, reason, duration);

      console.log("BLOCK USER API RESPONSE:", res);

      if (res.status === 1) {
        toast.success("User blocked successfully!");
        setShowBlockModal(false);
      } else {
        console.log(" BACKEND ERROR RESPONSE:", res);
        toast.error(res.message || "Failed to block user");
      }
    } catch (err: any) {
      console.log(" BLOCK USER API ERROR:", err);
      console.log(" ERROR RESPONSE:", err?.response?.data);
      toast.error(err?.response?.data?.message || "Error blocking user");
    }
  };


  const handleSuspendUser = async () => {
    try {
      console.log(" SUSPEND USER API TRIGGERED");
      console.log("User ID:", currentUserId);
      console.log(" Reason:", suspendReason);
      console.log(" Duration:", suspendDuration);

      const res = await suspendUser(currentUserId, suspendReason, suspendDuration);

      console.log(" SUSPEND USER API RESPONSE:", res);

      if (res.status === 1) {
        toast.success("User suspended successfully!");
        setShowSuspendModal(false);
      } else {
        console.log(" BACKEND ERROR RESPONSE:", res);
        toast.error(res.message || "Failed to suspend user");
      }
    } catch (err: any) {
      console.log(" SUSPEND USER API ERROR:", err);
      console.log(" ERROR RESPONSE:", err?.response?.data);

      toast.error(err?.response?.data?.message || "Error suspending user");
    }
  };






  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>View complete activity history for a specific user.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              {/* <a href="#" className="btn btn-sm btn-light">
                Back to Logs
              </a> */}
              <button
                onClick={() => navigate('/system-log')}
                className="btn btn-sm btn-light"
              >
                Back to Logs
              </button>

              {/* <a href="#" className="btn btn-sm btn-warning">
                Suspend User
              </a> */}

              <button
                onClick={() => setShowSuspendModal(true)}
                className="btn btn-sm btn-warning"
              >
                Suspend User
              </button>

              {/* <a href="#" className="btn btn-sm btn-danger">
                Block User
              </a> */}

              <button
                onClick={() => setShowBlockModal(true)}
                className="btn btn-sm btn-danger"
              >
                Block User
              </button>

            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Block User</h2>

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Duration (e.g., 1 day)"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowBlockModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={handleBlockUser}
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}


      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Suspend User</h2>

            <input
              type="text"
              placeholder="Reason"
              value={suspendReason}
              onChange={e => setSuspendReason(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Duration (e.g., 7 days)"
              value={suspendDuration}
              onChange={e => setSuspendDuration(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowSuspendModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-warning"
                onClick={handleSuspendUser}
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}



      <Container>
        <UserActivityDetailContent />
      </Container>
    </Fragment>
  );
};

export default UserActivityDetail;
