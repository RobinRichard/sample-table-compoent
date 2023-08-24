import PropTypes from "prop-types";
import BSTable from "react-bootstrap/Table";

import styles from "./table.module.scss";

const Cell = ({
  children,
  className,
  collapsible = false,
  indent = false,
  cellType = "td",
  ...rest
}) => {
  const CellType = cellType || "td";

  let _className = className;

  if (indent) _className = `${_className} ${styles.indent}`;

  return (
    <CellType className={_className} {...rest}>
      <span className={collapsible ? styles.collapsible : ""}>{children}</span>
    </CellType>
  );
};

const TitleCell = ({ children, ...rest }) => (
  <Cell cellType="th" {...rest}>
    {children}
  </Cell>
);

const EmptyCell = ({ split }) => (
  <td className={styles.empty}>{split && <span className={styles.split} />}</td>
);

const HeadRow = ({ children }) => {
  return <tr className={styles.headRow}>{children}</tr>;
};

const SubheadRow = ({ children }) => {
  return <tr className={styles.subheadRow}>{children}</tr>;
};

const Row = ({ children, active = false, highlight = false, ...rest }) => {
  return (
    <tr
      className={`${styles.row} ${active && styles.active} ${
        highlight && styles.highlight
      }`}
      {...rest}>
      {children}
    </tr>
  );
};

const InfoTable = ({ children, rightAligned, ...rest }) => {
  return (
    <BSTable
      responsive
      striped
      className={`${styles.table} ${rightAligned && styles.rightAligned}`}
      {...rest}>
      {children}
    </BSTable>
  );
};

InfoTable.HeadRow = HeadRow;
InfoTable.SubheadRow = SubheadRow;
InfoTable.Row = Row;

const Thead = PropTypes.elementType;

InfoTable.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOfType([HeadRow, SubheadRow, Row, Thead]),
    })
  ),
  rightAligned: PropTypes.bool,
};

export { InfoTable, Cell, TitleCell, EmptyCell };
