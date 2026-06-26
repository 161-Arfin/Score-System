import type { NextPage } from "next";
import AssessmentStart from "@/views/containers/organisms/AssessmentStart";
import Footer from "@/views/containers/templates/Footer";
import Navbar from "@/views/containers/templates/Navbar";

type PublicAssessmentPage = NextPage & {
  publicLayout?: boolean;
};

const AssessmentStartRoute: PublicAssessmentPage = () => {
  return (
    <div
      id="assessment-scroll-root"
      className="fixed inset-0 z-100 min-h-screen overflow-y-auto bg-slate-50"
    >
      <Navbar
        constrained
        showMobileMenu={false}
        showProfileMenu={false}
        title="Sakinah Score Assessment"
      />
      <AssessmentStart />
      <Footer />
    </div>
  );
};

AssessmentStartRoute.publicLayout = true;

export default AssessmentStartRoute;
