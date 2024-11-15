import { useEffect, useState } from "react";
import { Footer } from "./components/HeaderFooter";
import SavantProposition from "./components/SavantProposition";
import ScriptList from "./components/ScriptList";

function App() {
  const [currentPage, setCurrentPage] = useState<"scripts" | "savant">(() => {
    // URL 해시에 따라 초기 페이지 설정
    return window.location.hash === "#savant-generator" ? "savant" : "scripts";
  });

  const handlePageChange = (page: "scripts" | "savant") => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    // URL 해시 업데이트
    window.location.hash = page === "savant" ? "savant-generator" : "";
  };

  // URL 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const page =
        window.location.hash === "#savant-generator" ? "savant" : "scripts";
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === "scripts" ? (
        <ScriptList currentPage={currentPage} onPageChange={handlePageChange} />
      ) : (
        <>
          <SavantProposition
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
