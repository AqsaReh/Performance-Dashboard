import EmpDetailPageView from "./page-view";

interface PageProps {
  params: {
    empCode: string;
    lang: string;
  };
}

export default function EmpDetailPage({ params }: PageProps) {
  return <EmpDetailPageView empCode={params.empCode} />;
}
