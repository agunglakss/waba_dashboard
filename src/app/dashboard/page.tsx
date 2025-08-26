import { Suspense } from "react";
import Table  from "../components/Table";
import Navbar from "../components/Navbar";
import FilterForm from "../components/Filter";

function DashboardContent() {
  return (
    <>
      <Navbar />
      <FilterForm />
      <Table data={[]} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}