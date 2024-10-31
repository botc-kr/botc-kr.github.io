export const fetchScripts = async (setScripts, setLoading) => {
  try {
    const response = await fetch("/scripts.json");
    const data = await response.json();
    setScripts(data);
    setLoading(false);
  } catch (error) {
    console.error("Error loading scripts:", error);
    setLoading(false);
  }
};

export const handleCopyJson = async (jsonUrl, scriptId, setCopiedId) => {
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

export const handleDownloadJson = async (jsonUrl, fileName) => {
  try {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    downloadFile(blob, `${fileName}.json`);
  } catch (error) {
    console.error("Error downloading JSON:", error);
    alert("JSON 다운로드 중 오류가 발생했습니다.");
  }
};

export const handleDownloadPdf = async (pdfUrl, scriptId, setDownloadingId) => {
  try {
    setDownloadingId(scriptId);

    // pdfUrl에서 마지막 컴포넌트(파일명) 추출
    const fileName = pdfUrl.split("/").pop();

    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    downloadFile(blob, fileName);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("PDF 다운로드 중 오류가 발생했습니다.");
  } finally {
    setDownloadingId(null);
  }
};

const downloadFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
