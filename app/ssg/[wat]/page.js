import { faker } from "@faker-js/faker";

const PAGES_NUM = 10; //+process.env.PAGES_NUM || 10;

export async function generateStaticParams() {
  return new Array(PAGES_NUM).fill(0).map((_, i) => {
    return { wat: i.toString() };
  });
}

export default function Home({ params }) {
  throw new Error("no prerender");

  const paragraphs = faker.lorem
    .paragraphs({ min: 500, max: 1000 })
    .split(`\n`);

  return (
    <main>
      <h1>Home</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      {paragraphs.map((p, i) => (
        <p>{p}</p>
      ))}
    </main>
  );
}

export const revalidate = 15;
