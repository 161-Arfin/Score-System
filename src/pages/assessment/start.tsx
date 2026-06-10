import type { NextPage } from "next";
import AssessmentStartPage from "@/views/containers/pages/AssessmentStart";
import Footer from "@/views/containers/templates/Footer";
import Navbar from "@/views/containers/templates/Navbar";

type PublicAssessmentPage = NextPage & {
  publicLayout?: boolean;
};

const AssessmentStartRoute: PublicAssessmentPage = () => {
    const handleOpenMobileSidebar = () => {};
    
    return (
    <div
      id="assessment-scroll-root"
      className="fixed inset-0 z-[100] min-h-screen overflow-y-auto bg-slate-50"
    >
        <Navbar onOpenMobileSidebar={handleOpenMobileSidebar} />
        <AssessmentStartPage />
        <Footer />
      </div>
    );
};

AssessmentStartRoute.publicLayout = true;

export default AssessmentStartRoute;
