import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Maidenhead Spice uses cookies on this website, and how you can refuse them.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="By using this website and agreeing to this policy, you consent to Maidenhead Spice’s use of cookies in accordance with the terms set out below."
    >
      <h2>About cookies</h2>
      <p>
        Cookies are files sent by web servers to web browsers, and stored by
        the web browsers. The information is then sent back to the server each
        time the browser requests a page from the server. This enables a web
        server to identify and track web browsers.
      </p>
      <p>
        There are two main kinds of cookies: session cookies and persistent
        cookies. Session cookies are deleted from your computer when you close
        your browser, whereas persistent cookies remain stored on your
        computer until deleted, or until they reach their expiry date.
      </p>

      <h2>Cookies on our website</h2>
      <p>
        We use a cookie to recognise your computer when you visit our website,
        in order to populate the login box and record whether you are logged
        in or not. We only do this if you have explicitly registered with us.
      </p>
      <p>
        We also use a cookie to tell us that you have agreed to this Cookie
        Policy, if you have chosen to do so.
      </p>
      <p>
        A cookie in no way gives us access to your computer or any information
        about you. We are committed to ensuring that your information is
        secure, and we have put in place suitable physical, electronic and
        managerial procedures to safeguard and secure the information we
        collect online.
      </p>

      <h2>Google cookies</h2>
      <p>
        Maidenhead Spice uses Google Analytics to analyse the use of this
        website. Google Analytics generates statistical and other information
        about website use by means of cookies, which are stored on users’
        computers. The information generated relating to our website is used
        to create reports about the use of the website. Google will store and
        use this information. Google’s privacy policy is available at{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          policies.google.com/privacy
        </a>
        .
      </p>

      <h2>Refusing cookies</h2>
      <p>Most browsers allow you to refuse or accept cookies.</p>
      <ul>
        <li>
          In <strong>Chrome</strong>, go to Settings → Privacy and security →
          Cookies and other site data.
        </li>
        <li>
          In <strong>Firefox</strong>, go to Settings → Privacy & Security →
          Cookies and Site Data.
        </li>
        <li>
          In <strong>Safari</strong>, go to Preferences → Privacy → Manage
          Website Data.
        </li>
      </ul>
      <p>
        Blocking cookies will have a negative impact on the usability of some
        websites, including parts of this one.
      </p>
    </LegalPage>
  );
}
