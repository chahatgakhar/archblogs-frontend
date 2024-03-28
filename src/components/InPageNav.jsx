import React, { useState, useRef, useEffect } from "react";

export let activeTab;
export let activeTabLine;

const InPageNav = ({
  routes,
  defHidden = [],
  defActiveIndex = 0,
  children,
}) => {
  activeTabLine = useRef();
  activeTab = useRef();

  let [inPageNavIndex, setInPageNavIndex] = useState(0);

  let [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
  let [width, setWidth] = useState(window.innerWidth);

  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    setInPageNavIndex(i);
  };

  useEffect(() => {
    if (width > 766 && inPageNavIndex !== defActiveIndex) {
      changePageState(activeTab.current, defActiveIndex);
    }

    if (!isResizeEventAdded) {
      window.addEventListener("resize", () => {
        if (!isResizeEventAdded) {
          setIsResizeEventAdded(true);
        }
        setWidth(window.innerWidth);
      });
    }
  }, [width]);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i == defActiveIndex ? activeTab : null}
              key={i}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex == i ? "text-black " : "text-dark-grey ") +
                (defHidden.includes(route) ? " md:hidden " : "")
              }
              onClick={(e) => {
                changePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}

        <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNav;
