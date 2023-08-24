import { render, screen } from "@testing-library/react";

import { Table } from "./index";

describe("<Table />", () => {
  const headerRow = ["test", "second test", "third test"];
  const subHeadRow = ["one", "two"];
  const tableRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
  ];

  it("should renders normal table", () => {
    render(
      <Table
        headRow={headerRow}
        subHeadRow={subHeadRow}
        tableRows={tableRows}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();

    const [tableHead, tableBody] = screen.getAllByRole("rowgroup");

    expect(tableHead.getElementsByTagName("tr")).toHaveLength(1);
    expect(tableHead.getElementsByTagName("td")).toHaveLength(2);

    expect(tableBody.getElementsByTagName("tr")).toHaveLength(3);
    expect(tableBody.getElementsByTagName("td")).toHaveLength(4);
  });
});
