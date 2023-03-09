import React, { useState, useEffect } from "react";
import { FaRegWindowClose, FaTimes } from "react-icons/fa";
import { useGlobalContext } from "./context";

var places = [];
export default function Sidebar({ apiKey }) {
  const { isSideBarOpen, closeSideBar } = useGlobalContext();

  const [data, setData] = useState([]);

  //getting the location names
  const reverseGeoCoding = async (long, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${apiKey}`
      );
      const data = await response.json();
      const result = data.features;
      places.push(result[0].place_name);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("./api");
      const data = await response.json();

      setData(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDetails = () => {
      data.forEach((item) => {
        const { lat, long } = item;
        reverseGeoCoding(long, lat);
      });
    };
    fetchDetails();
  }, [data]);

  const deleteItem = async (dttime24) => {
    const response = await fetch(`./api/deleteitem?id=${dttime24}`, {
      method: "DELETE",
    });
    const data = await response.json();
  };
  return (
    <aside className={`${isSideBarOpen ? "sidebar show-sidebar" : "sidebar"} `}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">Recent Accident Zones</h1>
        <button className="sidebar-close-btn" onClick={closeSideBar}>
          <FaTimes className="close-btn-icon" />
        </button>
      </div>

      <div className="recent">
        {data.map((item, index) => {
          const { dttm } = item;
          console.log("dttm", dttm);
          let temp = new Date(dttm).getTime();
          console.log("temp", temp);
          //+5:30 GMT
          let dttime24 = String(new Date(temp + 19800000)).replace(
            "GMT+0530 (India Standard Time)",
            ""
          );
          console.log("dttime24", dttime24);
          //to local time
          let dttime12 = new Date(dttime24).toLocaleTimeString("en-US", {
            timeZone: "IST",
            hour12: true,
            month: "numeric",
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });
          console.log(dttime12);
          let place = places[index];

          //changing the date time according to database format
          let dbTime = new Date(dttime24).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: false,
            month: "numeric",
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          console.log("dbTime", dbTime);
          let tempdbTime = new Date(dbTime);

          console.log("tempdbTime", tempdbTime);
          let tempdbMonth =
            (tempdbTime.getMonth() + 1).toString().length === 1
              ? `0${(tempdbTime.getMonth() + 1).toString()}`
              : tempdbTime.getMonth() + 1;
          let tempdbDate =
            tempdbTime.getDate().toString().length === 1
              ? `0${tempdbTime.getDate().toString()}`
              : tempdbTime.getDate();
          let tempdbHours =
            tempdbTime.getHours().toString().length === 1
              ? `0${tempdbTime.getHours().toString()}`
              : tempdbTime.getHours();
          let tempdbMinutes =
            tempdbTime.getMinutes().toString().length === 1
              ? `0${tempdbTime.getMinutes().toString()}`
              : tempdbTime.getMinutes();
          let tempdbSeconds =
            tempdbTime.getSeconds().toString().length === 1
              ? `0${tempdbTime.getSeconds().toString()}`
              : tempdbTime.getSeconds();

          let dbFormat = `${tempdbTime.getFullYear()}-${tempdbMonth}-${tempdbDate} ${tempdbHours}:${tempdbMinutes}:${tempdbSeconds}`;
          console.log("dbFormat", dbFormat);

          return (
            <div className="recent-item" key={temp}>
              <p className="date">{dttime12}</p>
              <p className="place">{place}</p>

              <span className="remove-item">
                <button
                  onClick={() => {
                    deleteItem(dttime24);
                    window.location.reload();
                  }}
                >
                  <FaRegWindowClose />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
