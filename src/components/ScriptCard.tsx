import { Script } from "@/types/types";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  LucideIcon,
} from "lucide-react";
import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import ScriptImage from "./ScriptImage";

interface ScriptCardProps {
  script: Script;
  onCopyJson: (json: string, id: string) => void;
  onDownloadJson: (json: string, id: string) => void;
  onDownloadSheet: (pdf: string, id: string) => void;
  copiedId: string | null;
  downloadingId: string | null;
}

interface ExpandableSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  title: string;
  content: string;
  defaultExpanded?: boolean;
}

const ScriptCard: React.FC<ScriptCardProps> = ({
  script,
  onCopyJson,
  onDownloadJson,
  onDownloadSheet,
  copiedId,
  downloadingId,
}) => {
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState<boolean>(false);

  const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    isExpanded,
    onToggle,
    icon: Icon,
    title,
    content,
    defaultExpanded = false,
  }) => (
    <div className={`w-full ${defaultExpanded ? "sm:hidden" : ""}`}>
      <button
        onClick={onToggle}
        className="w-full mt-2 p-2 bg-gray-50 rounded-md flex items-center justify-between text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span className="text-sm">{title}</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isExpanded && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <div className="whitespace-pre-line text-sm text-gray-600">
            {content}
          </div>
        </div>
      )}
    </div>
  );

  const DesktopSynopsis: React.FC = () => (
    <div className="hidden sm:block text-gray-600 text-sm sm:text-base whitespace-pre-line">
      {script.synopsis || "이 스크립트에 대한 설명이 곧 추가될 예정입니다."}
    </div>
  );

  return (
    <div
      id={script.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
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
            </div>

            <DesktopSynopsis />

            <div className="flex flex-col gap-2">
              <ExpandableSection
                isExpanded={isSynopsisExpanded}
                onToggle={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                icon={FileText}
                title="개요"
                content={
                  script.synopsis ||
                  "이 스크립트에 대한 설명이 곧 추가될 예정입니다."
                }
                defaultExpanded={true}
              />

              {script.note && (
                <ExpandableSection
                  isExpanded={isNoteExpanded}
                  onToggle={() => setIsNoteExpanded(!isNoteExpanded)}
                  icon={BookOpen}
                  title="번역 노트"
                  content={script.note}
                />
              )}
            </div>

            <div className="flex justify-center sm:justify-start gap-2 mt-4">
              <ActionButtons
                script={script}
                onCopyJson={onCopyJson}
                onDownloadJson={onDownloadJson}
                onDownloadSheet={onDownloadSheet}
                copiedId={copiedId}
                downloadingId={downloadingId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
