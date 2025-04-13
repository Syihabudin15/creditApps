"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { NotificationItems } from "../IInterfaces";

const notifContext = createContext<NotificationItems>({
  akad: 0,
  antrian: 0,
  cair: 0,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notif, setNotif] = useState<NotificationItems>({
    akad: 0,
    antrian: 0,
    cair: 0,
  });

  useEffect(() => {
    (async () => {
      await fetch("/api/notification")
        .then((res) => res.json())
        .then((res) => setNotif(res.data))
        .catch((err) => console.log(err));
      setInterval(async () => {
        await fetch("/api/notification")
          .then((res) => res.json())
          .then((res) => setNotif(res.data))
          .catch((err) => console.log(err));
      }, 1000);
    })();
  }, []);
  return (
    <notifContext.Provider value={notif}>{children}</notifContext.Provider>
  );
};

export const useNotif = () => useContext(notifContext);
