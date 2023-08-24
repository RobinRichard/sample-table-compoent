import React from "react";

import { faSortDesc, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./sorterIcon.module.scss";

export const SorterIcon = ({ direction, className }) => {
  return (
    <span
      className={`fa-layers ${styles.sorterIcon} ${
        styles[direction?.toLowerCase()] || ""
      } ${className}`}>
      <FontAwesomeIcon icon={faSortUp} className={styles.up} />
      <FontAwesomeIcon icon={faSortDesc} className={styles.down} />
    </span>
  );
};
