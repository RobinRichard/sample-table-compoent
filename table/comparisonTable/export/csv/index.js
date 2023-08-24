import Dropdown from "react-bootstrap/Dropdown";
import { CSVLink } from "react-csv";

export const CSV = ({ columns, data, filename = "data.csv" }) => {
  const headers = columns.reduce((acc, { header, columns }) => {
    return [
      ...acc,
      ...columns.map(({ key, title }) => ({
        label: `${header}${header ? " " : ""}${title}`,
        key,
      })),
    ];
  }, []);

  const exportData = data.reduce((acc, curr) => {
    const { childRows = [], ...rest } = curr;
    return [...acc, rest, ...childRows];
  }, []);

  return (
    <Dropdown.Item
      as={CSVLink}
      eventKey={"CSV"}
      filename={filename}
      data={exportData}
      headers={headers}>
      Download CSV
    </Dropdown.Item>
  );
};
