import ComputersCards from "@/components/computers-cards";

export default function Home() {
  return (
    <section className="mt-4 sm:mt-0 sm:ps-8 px-2 sm:pr-4 pb-1 overflow-auto">
      <h1 className="mb-4 text-2xl font-bold">Home</h1>
      <ComputersCards />
    </section>
  );
}
