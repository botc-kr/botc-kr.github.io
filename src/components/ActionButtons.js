import React from "react";
import { Download, Copy, Check } from "lucide-react";

const ActionButtons = ({
  script,
  onCopyJson,
  onDownloadJson,
  onDownloadPdf,
  copiedId,
  downloadingId,
}) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const buttonBaseStyle =
    "inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg shadow-sm transition-all duration-200 font-medium";

  return (
    <div className="flex gap-2 sm:gap-3">
      <button
        onClick={() => onDownloadJson(script.json, script.id)}
        className={`${buttonBaseStyle} bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 hover:shadow-md active:scale-95`}
      >
        <Download size={16} className="shrink-0" />
        <span className="whitespace-nowrap">JSON</span>
      </button>

      {!isMobile && (
        <button
          onClick={() => onCopyJson(script.json, script.id)}
          className={`${buttonBaseStyle} ${
            copiedId === script.id
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-teal-500 to-emerald-500"
          } text-white hover:from-teal-600 hover:to-emerald-600 hover:shadow-md active:scale-95`}
        >
          {copiedId === script.id ? (
            <React.Fragment>
              <Check size={16} className="shrink-0" />
              <span className="whitespace-nowrap">복사됨</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Copy size={16} className="shrink-0" />
              <span className="whitespace-nowrap">복사</span>
            </React.Fragment>
          )}
        </button>
      )}

      <button
        onClick={() => onDownloadPdf(script.pdf, script.id)}
        disabled={downloadingId === script.id}
        className={`${buttonBaseStyle} bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100`}
      >
        {downloadingId === script.id ? (
          <span className="whitespace-nowrap">다운로드 중...</span>
        ) : (
          <>
            <Download size={16} className="shrink-0" />
            <span className="whitespace-nowrap">시트</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
