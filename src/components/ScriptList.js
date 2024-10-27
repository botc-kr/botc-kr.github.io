import React, { useState, useEffect } from "react";
import { Download, Copy, Check } from "lucide-react";

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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        Blood on the Clocktower 비공식 한글화
      </h1>

      <div className="grid gap-6 sm:gap-8">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <img
                  src={script.logo}
                  alt={script.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    {script.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line mb-4">
                    {script.synopsis}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => handleDownloadJson(script.json, script.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700"
                    >
                      <Download size={18} />
                      <span className="whitespace-nowrap">JSON 다운로드</span>
                    </button>
                    <button
                      onClick={() => handleCopyJson(script.json, script.id)}
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
                      onClick={() => handleDownloadPdf(script.pdf, script.id)}
                      disabled={downloadingId === script.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm sm:text-base rounded hover:bg-red-700 disabled:bg-red-400"
                    >
                      {downloadingId === script.id ? (
                        <span className="whitespace-nowrap">
                          다운로드 중...
                        </span>
                      ) : (
                        <>
                          <Download size={18} />
                          <span className="whitespace-nowrap">
                            PDF 다운로드
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptList;
