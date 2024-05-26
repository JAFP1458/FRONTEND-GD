import React, { useState } from "react";
import plusIcon from "../../../assets/img/notes/plus.png";
import "./Sidebar.css";

function Sidebar(props) {
  const colors = ["#fe9b72", "#fec971", "#00d4fe", "#b693fd", "#e4ee91"];

  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="parent-container"> {/* Contenedor padre */}
      <div className="sidebar">
        <img src={plusIcon} alt="Add" onClick={() => setListOpen(!listOpen)} />
        <ul className={`sidebar_list ${listOpen ? "sidebar_list_active" : ""}`}>
          {colors.map((item, index) => (
            <li
              key={index}
              className="sidebar_list_item"
              style={{ backgroundColor: item }}
              onClick={() => props.addNote(item)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
