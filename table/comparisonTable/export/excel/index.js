import { Dropdown } from "react-bootstrap";
import writeXlsxFile from "write-excel-file";

export const Excel = ({
  data,
  footerData,
  columns,
  fileName = "data.xlsx",
}) => {
  const downloadExcel = async () => {
    const headColumns = columns.reduce(
      (acc, { header, parentHeader = null, columns }) => {
        const span = columns.length;
        return [
          ...acc,
          {
            value: parentHeader ? parentHeader : header,
            fontWeight: "bold",
            align: "center",
            span,
          },
          ...new Array(span - 1).fill(null),
        ];
      },
      []
    );

    const subheadColumns = columns.reduce((acc, { columns }) => {
      return [
        ...acc,
        ...columns.map(({ title: value, key }) => ({
          key,
          value,
          fontWeight: "bold",
        })),
      ];
    }, []);

    const [_data, _childData] = data.reduce(
      (acc, { childRows = [], ...datum }) => {
        return [
          [...acc[0], datum],
          [...acc[1], ...childRows],
        ];
      },
      [[], []]
    );

    const parentData = [..._data, ...footerData].reduce((acc, curr) => {
      const datum = subheadColumns.reduce((_datum, { key }) => {
        return [..._datum, { value: curr[key] }];
      }, []);
      return [...acc, datum];
    }, []);

    let sheetData = [[headColumns, subheadColumns, ...parentData]];
    let sheets = ["sheet1"];

    if (_childData.length) {
      const childHeadColumns = columns.reduce(
        (acc, { header, childHeader = null, columns }) => {
          const span = columns.length;
          return [
            ...acc,
            {
              value: childHeader ? childHeader : header,
              fontWeight: "bold",
              align: "center",
              span,
            },
            ...new Array(span - 1).fill(null),
          ];
        },
        []
      );
      sheets = [...sheets, "sheet2"];

      const childData = [..._childData, ...footerData].reduce((acc, curr) => {
        const datum = subheadColumns.reduce((_datum, { key }) => {
          return [..._datum, { value: curr[key] }];
        }, []);
        return [...acc, datum];
      }, []);
      sheetData = [
        ...sheetData,
        [childHeadColumns, subheadColumns, ...childData],
      ];
    }

    await writeXlsxFile(sheetData, { sheets, fileName });
  };

  return (
    <Dropdown.Item eventKey={"Excel"} onClick={downloadExcel}>
      Download Excel
    </Dropdown.Item>
  );
};
