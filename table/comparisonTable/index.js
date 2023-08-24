import { Fragment, useState } from "react";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { HeaderContainer } from "shared/layout/containers";
import { useTracking } from "shared/store/trackingContext";

import { InfoTable, Cell, TitleCell, EmptyCell } from "../infoTable";

import { useExportOptions } from "./export";
import { SorterIcon } from "./sorterIcon";
import { useSort } from "./useSort";

const VOID = () => {};

const DataCell = ({
  datum,
  value,
  prefix = "",
  suffix = "",
  className = "",
  isTitle = false,
  defaultValue = null,
  formatter = ({ value }) => value,
  onClick = () => {},
  collapsible = false,
  extraContent = "",
}) => {
  const CellElement = isTitle ? TitleCell : Cell;
  const checkValueIn = ["", undefined, null];

  if (checkValueIn.includes(value))
    return <CellElement>{defaultValue}</CellElement>;

  let valueSign = "";
  if (typeof value === "number" && value < 0) {
    valueSign = "-";
    value = Math.abs(value);
  }

  return (
    <CellElement
      key={value}
      className={className}
      onClick={onClick}
      collapsible={collapsible}
      indent={datum.indent}>
      {valueSign}
      {prefix}
      {formatter({ value, datum })}
      {suffix}
      {extraContent}
    </CellElement>
  );
};

const Columns = ({
  columns,
  handleClick,
  show,
  datum,
  isChild,
  ...colProps
}) => {
  return (
    <>
      {columns.map(({ key, collapsible, ...rest }, idx) => (
        <DataCell
          key={`cell-${idx}-${datum[key]}`}
          collapsible={collapsible}
          onClick={!isChild && collapsible ? handleClick : () => {}}
          value={datum[key]}
          datum={datum}
          extraContent={
            !isChild && collapsible ? (
              <FontAwesomeIcon
                className="ms-2"
                icon={show ? faChevronUp : faChevronDown}
              />
            ) : (
              ""
            )
          }
          {...rest}
          {...colProps}
        />
      ))}
      <EmptyCell />
    </>
  );
};

const TRow = ({
  columns,
  datum,
  onMouseEnter = VOID,
  onMouseLeave = VOID,
  onClick = VOID,
}) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <>
      <InfoTable.Row
        active={!!datum.active}
        highlight={!!datum.highlight}
        onMouseEnter={() => onMouseEnter({ data: datum })}
        onMouseLeave={() => onMouseLeave({ data: datum })}
        onClick={() => onClick({ data: datum })}>
        {columns.map(({ ...colPops }, cIdx) => (
          <Columns
            key={`columns-${cIdx}`}
            {...colPops}
            datum={datum}
            handleClick={handleClick}
            show={show}
          />
        ))}
      </InfoTable.Row>
      <>
        {show &&
          datum.childRows &&
          datum.childRows.length > 0 &&
          datum.childRows.map((cDatum, crIdx) => (
            <InfoTable.Row
              key={crIdx}
              active={!!datum.active}
              highlight={!!datum.highlight}>
              {columns.map((colPops, cIdx) => (
                <Columns
                  key={`columns-${cIdx}`}
                  {...colPops}
                  isChild={true}
                  datum={cDatum}
                />
              ))}
            </InfoTable.Row>
          ))}
      </>
    </>
  );
};

const Tbody = ({ columns, data, rowActions = {}, children }) => {
  return (
    <tbody>
      {data.map((datum, rIdx) => {
        return (
          <Fragment key={`row-${rIdx}-${datum.code || datum.year || "key"}`}>
            <TRow {...rowActions} datum={datum} columns={columns} />
            {datum.hasGap ? (
              <TRow {...rowActions} datum={{}} columns={columns} />
            ) : (
              ""
            )}
          </Fragment>
        );
      })}
      {children}
    </tbody>
  );
};

const TFoot = ({ columns, data }) => {
  return (
    <>
      {data.map((datum, rIdx) => {
        return (
          <InfoTable.Row
            key={`footer-row-${rIdx}-${datum.code || datum.year || "key"}`}
            active={!!datum.active}
            highlight={!!datum.highlight}>
            {columns.map((colPops, cIdx) => (
              <Columns
                key={`-footer-columns-${cIdx}`}
                {...colPops}
                datum={datum}
                isChild={true}
              />
            ))}
          </InfoTable.Row>
        );
      })}
    </>
  );
};

const Thead = ({ headColumns, sortConfig, handleSorting }) => {
  const getSortClass = key => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? sortConfig.direction : "default";
  };

  const _style = headColumns.some(c => c.split) ? "text-center" : "";

  return (
    <thead>
      <InfoTable.HeadRow>
        {headColumns.map(
          ({ header, columns, isTitle = false, split = false }, idx) => {
            const CellElement = isTitle ? TitleCell : Cell;
            return (
              <Fragment key={`head-${idx}`}>
                <CellElement colSpan={columns.length} className={_style}>
                  {header}
                </CellElement>
                <EmptyCell split={split} />
              </Fragment>
            );
          }
        )}
      </InfoTable.HeadRow>

      <InfoTable.SubheadRow>
        {headColumns.map(({ columns }, idx) => {
          return (
            <Fragment key={`subhead-${idx}`}>
              {columns.map(
                ({ key, title, isTitle, sortable, wrap = false }) => {
                  const CellElement = isTitle ? TitleCell : Cell;
                  return (
                    <CellElement
                      onClick={sortable ? () => handleSorting(key) : null}
                      key={key}
                      className={`${
                        sortable ? "cursor-pointer" : ""
                      } align-bottom text-nowrap`}>
                      <div
                        className={`d-flex ${
                          isTitle ? "" : "justify-content-end"
                        } align-items-center`}>
                        <span
                          className={
                            wrap ? "text-wrap min-width-60" : "text-nowrap"
                          }>
                          {title}
                        </span>
                        {sortable && (
                          <SorterIcon
                            direction={getSortClass(key)}
                            className={"ms-1"}
                          />
                        )}
                      </div>
                    </CellElement>
                  );
                }
              )}
              <EmptyCell />
            </Fragment>
          );
        })}
      </InfoTable.SubheadRow>
    </thead>
  );
};

export const ComparisonTable = ({
  data,
  heading,
  columns,
  subheading,
  showDownload,
  footerData,
  sortBy = null,
  rowActions = {},
}) => {
  const { tableData, requestSort, sortConfig } = useSort(data, sortBy);
  const logs = useTracking();

  const { options } = useExportOptions({
    heading,
    columns,
    showDownload,
    data: tableData,
    footerData: footerData && footerData.length ? footerData : [],
  });
  const handleDownload = eventKey => {
    if (logs && eventKey) {
      logs.logDataDownload({
        category: `Table ${eventKey} export`,
        label: heading || "table data",
      });
    }
  };

  return (
    <>
      <HeaderContainer
        heading={heading}
        subheading={subheading}
        options={options}
        onDownload={handleDownload}
      />
      <InfoTable rightAligned>
        <Thead
          headColumns={columns}
          handleSorting={requestSort}
          sortConfig={sortConfig}
        />
        <Tbody columns={columns} data={tableData} rowActions={rowActions}>
          {footerData && footerData.length > 0 ? (
            <TFoot columns={columns} data={footerData} />
          ) : null}
        </Tbody>
      </InfoTable>
    </>
  );
};

const valueType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.node,
]);

ComparisonTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: valueType,
      isTitle: PropTypes.bool,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          formatter: PropTypes.func,
          defaultValue: valueType,
          title: valueType,
          suffix: valueType,
          prefix: valueType,
        })
      ),
    })
  ),
  showDownload: PropTypes.bool,
  rowActions: PropTypes.object,
};
