import { lookup as zipCodeLookup } from "zipcodes";

export default function Home({ params }) {
  return (
    <main>
      <h1>Home</h1>
      {JSON.stringify({ params, code: zipCodeLookup(90210) }, null, 2)}
    </main>
  );
}

export const dynamic = `force-dynamic`;
