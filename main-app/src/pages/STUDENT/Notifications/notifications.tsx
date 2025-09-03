import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { IndicatorIcon, MarkIcon } from "../../../assets";
import clientRequests from "../../../requests/client.request";
import { message as antdMessage, Button } from "antd";
import { getAvatar } from "../../../utils/helperFunction";

interface NotiItem {
  id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Notification: React.FC<any> = () => {
  const [items, setItems] = useState<NotiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await clientRequests.listNotifications();
      setItems(Array.isArray(res) ? res : []);
    } catch (e: any) {
      antdMessage.error(e?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAll = async () => {
    try {
      await clientRequests.markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      antdMessage.success("All notifications marked as read");
    } catch (e: any) {
      antdMessage.error(e?.message || "Failed to mark as read");
    }
  };

  const markOne = async (id: number) => {
    try {
      await clientRequests.markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e: any) {
      antdMessage.error(e?.message || "Failed to mark as read");
    }
  };

  const removeOne = async (id: number) => {
    try {
      await clientRequests.deleteNotification(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      antdMessage.success("Deleted");
    } catch (e: any) {
      antdMessage.error(e?.message || "Failed to delete");
    }
  };

  useEffect(() => {
    load();
    // also load current user to get profile image for avatar
    (async () => {
      try {
        const profile = await clientRequests.getMe();
        setMe(profile);
      } catch (e) {
        // ignore avatar fetch errors
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="w-[90%] sm:w-4/5 mx-auto notifications">
        <div className="flex justify-between">
          <h1 className="text-[20px] font-semibold font-inter leading-[32px]">
            Notifications
          </h1>
          <button
            onClick={markAll}
            className="flex gap-2 items-center text-[#581A57] text-[14px] font-inter sm:text-[16px]"
          >
            <MarkIcon />
            <span>{loading ? "Please wait..." : "Mark all as read"}</span>
          </button>
        </div>

        {/* Today Notification */}

        <div className="sm:w-4/5 mx-auto">
          <h2 className="text-[16px] font-medium my-[30px] font-inter">
            Today
          </h2>
          {items.length === 0 && !loading && (
            <div className="text-sm text-[#808080]">No notifications</div>
          )}
          {items.map((n) => (
            <div key={n.id} className="bg-white p-3 rounded-md my-2">
              <div className="flex justify-between items-start sm:items-start">
                <div className=" flex-1 flex gap-2 items-start sm:items-center">
                  {!n.is_read && <IndicatorIcon className="mt-[13px] sm:mt-0" />}
                  <img
                    src={getAvatar(me?.profile_image)}
                    alt=".."
                    className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
                  />
                  <div>
                    <p className="sm:p-[16px] text-[14px] sm:pb-1 font-inter">
                      {n.content}
                    </p>
                    <div className="sm:px-[16px] flex gap-3">
                      {!n.is_read && (
                        <Button
                          size="small"
                          type="link"
                          className="!text-[#581A57] !p-0"
                          onClick={() => markOne(n.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button
                        size="small"
                        type="link"
                        danger
                        className="!p-0"
                        onClick={() => removeOne(n.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-right gap-0 sm:gap-3 font-[300] text-[#808080] text-[12px]">
                  <p>{new Date(n.created_at).toLocaleDateString()}</p>
                  <p>{new Date(n.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Notifictaions */}

        <div className="sm:w-4/5 mx-auto mb-[200px] sm:mb-0">
          <h2 className="text-[16px] font-medium my-[30px]">Recent</h2>
          {items.slice(0, Math.max(0, items.length - 0)).map((n) => (
            <div key={`r-${n.id}`} className="bg-white p-3 rounded-md my-2">
              <div className="flex justify-between items-start sm:items-start">
                <div className=" flex-1 flex gap-2 items-start sm:items-center">
                  {!n.is_read && <IndicatorIcon className="mt-[13px] sm:mt-0" />}
                  <img src={getAvatar(me?.profile_image)} alt=".." className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full object-cover" />
                  <div>
                    <p className="sm:p-[16px] text-[14px] sm:pb-1 ">{n.content}</p>
                  </div>
                </div>
                <div className="flex flex-col text-right gap-1 sm:gap-3 text-[#808080] text-[12px]">
                  <p>{new Date(n.created_at).toLocaleDateString()}</p>
                  <p>{new Date(n.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Notification;
