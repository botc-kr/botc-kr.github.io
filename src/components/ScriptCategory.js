import React from "react";
import ScriptCard from "./ScriptCard";

const ScriptCategory = ({
  title,
  scripts,
  onCopyJson,
  onDownloadJson,
  onDownloadSheet,
  copiedId,
  downloadingId,
}) => (
  <div className="mb-12">
    <h2 className="text-xl sm:text-2xl font-bold mb-6 border-b pb-2">
      {title}
    </h2>
    <div className="grid gap-6 sm:gap-8">
      {scripts.map((script) => (
        <div
          key={script.id}
          id={script.id}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <ScriptCard
            key={script.id}
            script={script}
            onCopyJson={onCopyJson}
            onDownloadJson={onDownloadJson}
            onDownloadSheet={onDownloadSheet}
            copiedId={copiedId}
            downloadingId={downloadingId}
          />
        </div>
      ))}
    </div>
  </div>
);

export default ScriptCategory;
