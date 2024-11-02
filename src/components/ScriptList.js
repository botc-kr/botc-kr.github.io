import React, { useState, useEffect } from "react";
import ScriptCategory from "./ScriptCategory";
import {
  fetchScripts,
  handleCopyJson,
  handleDownloadJson,
  handleDownloadPdf,
} from "../utils/ScriptUtils";
import { Header, Footer } from "./HeaderFooter";

const ScriptList = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchScripts(setScripts, setLoading);
  }, []);

  // 해시 변경을 감지하고 스크롤하는 효과
  useEffect(() => {
    const scrollToScript = () => {
      const hash = window.location.hash.slice(1); // '#' 제거
      if (!hash) return;

      // 스크립트 로딩이 완료된 후에만 스크롤 실행
      if (!loading && scripts.length > 0) {
        const element = document.getElementById(hash);
        if (element) {
          // smooth scroll with offset for header
          const headerOffset = 80; // 헤더 높이에 맞게 조정하세요
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    scrollToScript();
    window.addEventListener("hashchange", scrollToScript);

    return () => window.removeEventListener("hashchange", scrollToScript);
  }, [loading, scripts]); // scripts와 loading이 변경될 때마다 실행

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

  const onDownloadSheet = async (pdfUrl, scriptId) => {
    await handleDownloadPdf(pdfUrl, scriptId, setDownloadingId);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {officialScripts.length > 0 && (
          <div id="official">
            <ScriptCategory
              title="공식 스크립트"
              scripts={officialScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}

        {communityScripts.length > 0 && (
          <div id="community">
            <ScriptCategory
              title="커스텀 스크립트"
              scripts={communityScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}

        {teensyvilleScripts.length > 0 && (
          <div id="teensyville">
            <ScriptCategory
              title="틴시빌 스크립트"
              scripts={teensyvilleScripts}
              onCopyJson={onCopyJson}
              onDownloadJson={onDownloadJson}
              onDownloadSheet={onDownloadSheet}
              copiedId={copiedId}
              downloadingId={downloadingId}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ScriptList;
