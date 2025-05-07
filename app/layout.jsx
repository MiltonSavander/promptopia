import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { Suspense } from "react";

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <link
        rel="icon"
        href="assets/images/favicon-32x32.png"
        type="image/png"
      />
    </head>
    <body>
      <Provider>
        <div className="main">
          <div className="gradient" />
        </div>

        <main className="app">
          <Nav />
          <Suspense>{children}</Suspense>
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
