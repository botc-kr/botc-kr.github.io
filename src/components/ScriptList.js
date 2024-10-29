import React, { useState, useEffect } from "react";
import ScriptCategory from "./ScriptCategory";
import {
  fetchScripts,
  handleCopyJson,
  handleDownloadJson,
  handleDownloadPdf,
} from "../utils/ScriptUtils";

const ScriptList = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchScripts(setScripts, setLoading);
  }, []);

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

  const onCopyJson = async (jsonUrl, scriptId) => {
    await handleCopyJson(jsonUrl, scriptId, setCopiedId);
  };

  const onDownloadJson = async (jsonUrl, scriptId) => {
    await handleDownloadJson(jsonUrl, scriptId);
  };

  const onDownloadPdf = async (pdfUrl, scriptId) => {
    await handleDownloadPdf(pdfUrl, scriptId, setDownloadingId);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Blood on the Clocktower 비공식 한글화
      </h1>

      {officialScripts.length > 0 && (
        <ScriptCategory
          title="공식 스크립트"
          scripts={officialScripts}
          onCopyJson={onCopyJson}
          onDownloadJson={onDownloadJson}
          onDownloadPdf={onDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}

      {communityScripts.length > 0 && (
        <ScriptCategory
          title="커뮤니티 스크립트"
          scripts={communityScripts}
          onCopyJson={onCopyJson}
          onDownloadJson={onDownloadJson}
          onDownloadPdf={onDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}

      {teensyvilleScripts.length > 0 && (
        <ScriptCategory
          title="틴시빌 스크립트"
          scripts={teensyvilleScripts}
          onCopyJson={onCopyJson}
          onDownloadJson={onDownloadJson}
          onDownloadPdf={onDownloadPdf}
          copiedId={copiedId}
          downloadingId={downloadingId}
        />
      )}
    </div>
  );
};

export default ScriptList;
