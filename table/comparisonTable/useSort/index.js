import { useMemo, useState } from "react";

import { isNill } from "shared/utils";

const DIRECTIONS = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
};

const compare = (baseValue, compareToValue, direction) => {
  if (isNill(baseValue)) return 1;
  if (isNill(compareToValue)) return -1;
  if (isNill(baseValue) && isNill(compareToValue)) return 0;

  const delta =
    typeof baseValue === "number"
      ? baseValue - compareToValue
      : baseValue.toString().localeCompare(compareToValue.toString(), "en", {
          numeric: true,
        });

  return delta * (direction === DIRECTIONS.ASCENDING ? 1 : -1);
};

export const useSort = (data, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        return compare(
          a[sortConfig.key],
          b[sortConfig.key],
          sortConfig.direction
        );
      });

      sortableData = sortableData.reduce((acc, curr) => {
        if (curr.childRows && curr.childRows.length) {
          const _childRows = [...curr.childRows];
          _childRows.sort((a, b) => {
            return compare(
              a[sortConfig.key],
              b[sortConfig.key],
              sortConfig.direction
            );
          });
          curr.childRows = _childRows;
        }
        return [...acc, curr];
      }, []);
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = key => {
    let direction = DIRECTIONS.ASCENDING;
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === DIRECTIONS.ASCENDING
    ) {
      direction = DIRECTIONS.DESCENDING;
    }

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === DIRECTIONS.DESCENDING
    ) {
      setSortConfig(null);
      return;
    }

    setSortConfig({ key, direction });
  };

  return { tableData: sortedData, requestSort, sortConfig };
};
