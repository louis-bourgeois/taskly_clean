"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { NotificationsContext } from "../../../../context/NotificationsContext";

export default function NotificationWrapper({ children }) {
  const { deleteNotification } = useContext(NotificationsContext);
  const parentRef = useRef(null);

  const checkIfTopExceeded = useCallback(() => {
    const parentDiv = parentRef.current;
    if (!parentDiv) return;

    const parentRect = parentDiv.getBoundingClientRect();
    let firstChild = parentDiv.firstChild;

    while (firstChild) {
      const firstChildRect = firstChild.getBoundingClientRect();
      if (firstChildRect.top < parentRect.top) {
        const dataId = firstChild.getAttribute("data-id");
        if (dataId) {
          firstChild.classList.add("fade-out");
          setTimeout(() => {
            deleteNotification(dataId);
            requestAnimationFrame(checkIfTopExceeded); // Continuation instantanée après suppression
          }, 2000);
          break;
        }
      }
      firstChild = firstChild.nextSibling;
    }
  }, [deleteNotification]);

  useEffect(() => {
    const parentDiv = parentRef.current;
    if (!parentDiv) return;

    const handleResize = () => {
      checkIfTopExceeded();
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          parentDiv.scrollTop = parentDiv.scrollHeight;
          checkIfTopExceeded();
        }
      }
    });

    checkIfTopExceeded();
    parentDiv.scrollTop = parentDiv.scrollHeight;

    observer.observe(parentDiv, { childList: true });
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [checkIfTopExceeded]);

  return (
    <div
      ref={parentRef}
      className="scroll-hide z-[70] fixed bottom-5 right-0 max-w-[25vw] max-h-[50vh] flex flex-col items-center gap-[10px] overflow-auto"
    >
      {children}
    </div>
  );
}
