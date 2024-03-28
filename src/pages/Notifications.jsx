import React, { useContext, useEffect, useState } from "react";

//middleware
import axios from "axios";

//context
import { UserContext } from "../App";

//assets
import { FilterPagination } from "../assets/FilterPagination";
import AnimationWrapper from "../assets/PageAnimation";

//components
import Loader from "../components/Loader";
import NotificationCard from "../components/NotificationCard.jsx";
import NoDataMessage from "../components/NoDataMessage";
import { LoadMoreDataButton } from "../components/LoadMoreDataButton.jsx";

const Notifications = () => {
  let {
    userAuth,
    userAuth: { access_token, new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  const [filter, setfilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  let filters = ["all", "like", "comment", "reply"];

  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/notifications",
        { page, filter, deletedDocCount },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {
        if (new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false });
        }

        let formatedData = await FilterPagination({
          state: notifications,
          data,
          page,
          countRoute: "/all-notifications-count",
          dataToSend: { filter },
          user: access_token,
        });

        setNotifications(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 });
    }
  }, [access_token, filter]);

  const handleFilter = (e) => {
    let btn = e.target;
    setfilter(btn.innerHTML);
    setNotifications(null);
  };

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter == filterName ? "btn-dark" : "btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      <div>
        {notifications == null ? (
          <Loader />
        ) : (
          <>
            {notifications.results.length ? (
              notifications.results.map((notification, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                    <NotificationCard
                      data={notification}
                      index={i}
                      notificationState={{ notifications, setNotifications }}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No notifications available" />
            )}

            <LoadMoreDataButton
              state={notifications}
              fetchData={fetchNotifications}
              additionalParam={{
                deletedDocCount: notifications.deletedDocCount,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
