import PropTypes from "prop-types";

import { capitaliseFirstOfString } from "shared/utils/string";

import { InfoTable } from "./infoTable";

/**
 * Table generates a table UI.
 * Table takes three arrays:
 * - HeadRow
 * - subHeadRow (optional)
 * - tableRows
 * Each array is, itself, an array of values which will be placed in the columns.
 * You can pass react components as column items, or plain values.
 */

const Table = props => {
  const { headRow, subHeadRow, tableRows, columnHeads, ...rest } = props;
  return (
    <InfoTable {...rest}>
      <thead>
        <InfoTable.HeadRow>
          {headRow.slice(0, columnHeads).map(r => (
            <th key={`${r}`}>{r}</th>
          ))}

          {headRow.slice(columnHeads).map((col, i) => (
            <td key={`${i}`}>{col}</td>
          ))}
        </InfoTable.HeadRow>
      </thead>

      <tbody>
        {subHeadRow && subHeadRow.length > 0 && (
          <InfoTable.SubheadRow>
            {subHeadRow.map((r, idx) => (
              <th key={`subHeaderRow-${r}-${idx}`}>{r}</th>
            ))}
          </InfoTable.SubheadRow>
        )}
        {tableRows.map((r, i) => (
          <InfoTable.Row key={`${i}`}>
            {/* head column */}
            {r.slice(0, columnHeads).map((headCol, i) => (
              <th scope="row" key={`col-head-${i}`}>
                {capitaliseFirstOfString(headCol)}
              </th>
            ))}
            {r.slice(columnHeads).map((col, i) => (
              <td key={`${i}`}>{col}</td>
            ))}
          </InfoTable.Row>
        ))}
      </tbody>
    </InfoTable>
  );
};

Table.protoTypes = {
  headRow: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
  ).isRequired,
  subHeadRow: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
  ),
  tableRows: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
  ).isRequired,
  columnHeads: PropTypes.number,
};

Table.defaultProps = {
  subHeadRow: [],
  columnHeads: 1,
};

export { Table, InfoTable };
