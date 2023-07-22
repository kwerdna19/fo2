import Head from "next/head";
import { MobTable } from "~/components/MobTable";
import { Footer } from "~/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>FO2 DB</title>
        <meta name="description" content="Fantasy Online 2 Database" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <main className="flex flex-col items-center p-5 mx-auto max-w-screen-2xl">
        <MobTable />
      </main>
      <footer className="flex flex-col items-center p-5 mx-auto max-w-screen-2xl mb-4">
        <Footer />
      </footer>
    </>
  );
}
