import { lazy, Suspense } from "react";

import { slugify } from "shared/utils/string";

import { CSV } from "./csv";

export const useExportOptions = ({
  data,
  heading,
  columns,
  footerData,
  showDownload = false,
}) => {
  if (!showDownload || !data.length) return { options: [] };

  const filename = heading ? slugify(heading) : "data";

  let options = [];
  options = [
    <CSV
      key="csv"
      columns={columns}
      filename={`${filename}.csv`}
      data={[...data, ...footerData]}
    />,
  ];

  const Excel = lazy(() =>
    import("./excel").then(module => ({ default: module["Excel"] }))
  );

  options = [
    ...options,
    <Suspense key={"excel"} fallback={null}>
      <Excel
        data={data}
        columns={columns}
        footerData={footerData}
        fileName={`${filename}.xlsx`}
      />
    </Suspense>,
  ];

  return { options };
};
