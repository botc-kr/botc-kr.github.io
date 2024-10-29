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
  // 모바일 체크
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
      <button
        onClick={() => onDownloadJson(script.json, script.id)}
        className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700"
      >
        <Download size={16} className="shrink-0" />
        <span className="whitespace-nowrap">JSON</span>
      </button>

      {/* 모바일이 아닐 때만 복사 버튼 표시 */}
      {!isMobile && (
        <button
          onClick={() => onCopyJson(script.json, script.id)}
          className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded hover:bg-green-700"
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
        className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-red-600 text-white text-sm sm:text-base rounded hover:bg-red-700 disabled:bg-red-400"
      >
        {downloadingId === script.id ? (
          <span className="whitespace-nowrap">다운로드 중...</span>
        ) : (
          <>
            <Download size={16} className="shrink-0" />
            <span className="whitespace-nowrap">PDF</span>
          </>
        )}
      </button>
    </>
  );
};

export default ActionButtons;
