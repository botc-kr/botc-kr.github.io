import React from "react";
import { BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ScriptImage from "./ScriptImage";
import ActionButtons from "./ActionButtons";

const ScriptCard = ({
  script,
  onCopyJson,
  onDownloadJson,
  onDownloadPdf,
  copiedId,
  downloadingId,
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <ScriptImage src={script.logo} alt={script.name} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold">{script.name}</h2>
              {script.teensyville && (
                <span className="inline-flex w-fit shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  틴시빌
                </span>
              )}
              {script.author && (
                <span className="text-gray-600 text-sm sm:text-base">
                  by {script.author}
                </span>
              )}
            </div>
            {script.note && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="sm:ml-auto">
                      <div className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-help">
                        <BookOpen size={16} />
                        <span className="whitespace-nowrap">번역 노트</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[280px] sm:max-w-sm p-4 text-sm"
                    sideOffset={5}
                  >
                    <p className="whitespace-pre-line">{script.note}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line mb-4">
            {script.synopsis ||
              "이 스크립트에 대한 설명이 곧 추가될 예정입니다."}
          </p>

          <div className="flex justify-center sm:justify-start gap-2">
            <ActionButtons
              script={script}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadPdf={onDownloadPdf}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ScriptCard;
