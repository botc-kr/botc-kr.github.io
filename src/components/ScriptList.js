import React, { useState, useEffect } from "react";
import { Download, Copy, Check, BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const DEFAULT_IMAGE =
  "https://raw.githubusercontent.com/wonhyo-e/botc-translations/refs/heads/main/assets/images/blood_on_the_clocktower.png";

const ScriptImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
    />
  );
};

const ScriptCategory = ({
  title,
  scripts,
  onCopyJson,
  onDownloadJson,
  onDownloadPdf,
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
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <ScriptImage
                src={script.logo}
                alt={script.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 items-center">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {script.name}
                  </h2>
                  {script.teensyville && (
                    <span className="inline-flex w-fit shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      틴시빌
                    </span>
                  )}
                  {script.author && (
                    <span className="text-gray-600 text-sm sm:text-base sm:ml-2">
                      by {script.author}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line mb-4">
                  {script.synopsis ||
                    "이 스크립트에 대한 설명이 곧 추가될 예정입니다."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative">
                  <button
                    onClick={() => onDownloadJson(script.json, script.id)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700"
                  >
                    <Download size={18} />
                    <span className="whitespace-nowrap">JSON 다운로드</span>
                  </button>
                  <button
                    onClick={() => onCopyJson(script.json, script.id)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded hover:bg-green-700"
                  >
                    {copiedId === script.id ? (
                      <React.Fragment>
                        <Check size={18} />
                        <span className="whitespace-nowrap">복사됨</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Copy size={18} />
                        <span className="whitespace-nowrap">JSON 복사</span>
                      </React.Fragment>
                    )}
                  </button>
                  <button
                    onClick={() => onDownloadPdf(script.pdf, script.id)}
                    disabled={downloadingId === script.id}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm sm:text-base rounded hover:bg-red-700 disabled:bg-red-400"
                  >
                    {downloadingId === script.id ? (
                      <span className="whitespace-nowrap">다운로드 중...</span>
                    ) : (
                      <>
                        <Download size={18} />
                        <span className="whitespace-nowrap">PDF 다운로드</span>
                      </>
                    )}
                  </button>

                  {script.note && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute bottom-0 right-0 sm:static sm:self-end">
                            <div className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-help">
                              <BookOpen size={16} />
                              <span className="whitespace-nowrap">
                                번역 노트
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-sm p-4 text-sm"
                        >
                          <p className="whitespace-pre-line">{script.note}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ScriptList = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetch("/scripts.json")
      .then((response) => response.json())
      .then((data) => {
        setScripts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading scripts:", error);
        setLoading(false);
      });
  }, []);

  const handleCopyJson = async (jsonUrl, scriptId) => {
    try {
      const response = await fetch(jsonUrl);
      const json = await response.json();
      await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
      setCopiedId(scriptId);
      setTimeout(() => {
        setCopiedId(null);
      }, 1000);
    } catch (error) {
      console.error("Error copying JSON:", error);
      alert("JSON 복사 중 오류가 발생했습니다.");
    }
  };

  const handleDownloadJson = async (jsonUrl, fileName) => {
    try {
      const response = await fetch(jsonUrl);
      const json = await response.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading JSON:", error);
      alert("JSON 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleDownloadPdf = async (pdfUrl, scriptId) => {
    try {
      setDownloadingId(scriptId);
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${scriptId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const officialScripts = scripts.filter((script) => script.official);
  const teensyvilleScripts = scripts.filter(
    (script) => !script.official && script.teensyville
  );
  const communityScripts = scripts.filter(
    (script) => !script.official && !script.teensyville
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Blood on the Clocktower 비공식 한글화
      </h1>

      {officialScripts.length > 0 && (
        <ScriptCategory
          title="공식 스크립트"
          scripts={officialScripts}
          onCopyJson={handleCopyJson}
          onDownloadJson={handleDownloadJson}
          onDownloadPdf={handleDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}

      {communityScripts.length > 0 && (
        <ScriptCategory
          title="커뮤니티 스크립트"
          scripts={communityScripts}
          onCopyJson={handleCopyJson}
          onDownloadJson={handleDownloadJson}
          onDownloadPdf={handleDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}

      {teensyvilleScripts.length > 0 && (
        <ScriptCategory
          title="틴시빌 스크립트"
          scripts={teensyvilleScripts}
          onCopyJson={handleCopyJson}
          onDownloadJson={handleDownloadJson}
          onDownloadPdf={handleDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}
    </div>
  );
};

export default ScriptList;
