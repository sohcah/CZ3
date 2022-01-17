import Head from "next/head";
import MigrateMaxData from "../components/migrate";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CuppaZee Terms of Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-stretch w-full p-4">
        <h2 className="font-display text-4xl">Privacy Policy</h2>
        <p className="mt-2">
          Sam Hindess built the CuppaZee app as an Open Source app. This SERVICE is provided by Sam
          Hindess at no cost and is intended for use as is.
        </p>
        <p className="mt-2">
          This page is used to inform visitors regarding my policies with the collection, use, and
          disclosure of Personal Information if anyone decided to use my Service.
        </p>
        <p className="mt-2">
          If you choose to use my Service, then you agree to the collection and use of information
          in relation to this policy. The Personal Information that I collect is used for providing
          and improving the Service. I will not use or share your information with anyone except as
          described in this Privacy Policy.
        </p>
        <p className="mt-2">
          The terms used in this Privacy Policy have the same meanings as in our Terms and
          Conditions, which is accessible at CuppaZee unless otherwise defined in this Privacy
          Policy.
        </p>
        <h3 className="text-xl font-bold mt-4">Information Collection and Use</h3>
        <p className="mt-2">
          For a better experience, while using our Service, I may require you to provide us with
          certain personally identifiable information, including but not limited to your Munzee
          Username, Email Address, Munzee Account Data and Geolocation information. The information
          that I request will be used only for the operation of our Service.
        </p>
        <div>
          <p className="mt-2">
            The app does use third party services that may collect information used to identify you.
          </p>
          <p className="mt-2">
            Link to privacy policy of third party service providers used by the app
          </p>
          <ul className="list-disc ml-8">
            <li>
              <a
                className="text-blue-500"
                href="https://www.google.com/policies/privacy/"
                target="_blank"
                rel="noopener noreferrer">
                Google Play Services
              </a>
            </li>
            <li>
              <a
                className="text-blue-500"
                href="https://firebase.google.com/policies/analytics"
                target="_blank"
                rel="noopener noreferrer">
                Google Analytics for Firebase
              </a>
            </li>

            <li>
              <a
                className="text-blue-500"
                href="https://expo.io/privacy"
                target="_blank"
                rel="noopener noreferrer">
                Expo
              </a>
            </li>
            <li>
              <a
                className="text-blue-500"
                href="https://sentry.io/privacy/"
                target="_blank"
                rel="noopener noreferrer">
                Sentry
              </a>
            </li>

            <li>
              <a
                className="text-blue-500"
                href="https://www.mapbox.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer">
                Mapbox
              </a>
            </li>

            <li>
              <a
                className="text-blue-500"
                href="https://docs.rollbar.com/docs/privacy-policy"
                target="_blank"
                rel="noopener noreferrer">
                Rollbar
              </a>
            </li>
          </ul>
        </div>
        <h3 className="text-xl font-bold mt-4">Log Data</h3>
        <p className="mt-2">
          I want to inform you that whenever you use my Service, in a case of an error in the app I
          collect data and information (through third party products) on your phone called Log Data.
          This Log Data may include information such as your device Internet Protocol (“IP”)
          address, device name, operating system version, the configuration of the app when
          utilizing my Service, the time and date of your use of the Service, and other statistics.
        </p>
        <h3 className="text-xl font-bold mt-4">Geolocation Data</h3>
        <p className="mt-2">
          CuppaZee stores your Live Geolocation data only as long as is required for the Live
          Location function of the CuppaZee Bouncer Alert Service. If you do not use the CuppaZee
          Bouncer Alert Service with its Live Location Function, CuppaZee will not store your Live
          Geolocation data in its database or process this data on its servers.
        </p>
        <h3 className="text-xl font-bold mt-4">Cookies</h3>
        <p className="mt-2">
          Cookies are files with a small amount of data that are commonly used as anonymous unique
          identifiers. These are sent to your browser from the websites that you visit and are
          stored on your device's internal memory.
        </p>
        <p className="mt-2">
          This Service does not use these “cookies” explicitly. However, the app may use third party
          code and libraries that use “cookies” to collect information and improve their services.
          You have the option to either accept or refuse these cookies and know when a cookie is
          being sent to your device. If you choose to refuse our cookies, you may not be able to use
          some portions of this Service.
        </p>
        <h3 className="text-xl font-bold mt-4">Service Providers</h3>
        <p className="mt-2">
          I may employ third-party companies and individuals due to the following reasons:
        </p>
        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p className="mt-2">
          I want to inform users of this Service that these third parties have access to your
          Personal Information. The reason is to perform the tasks assigned to them on our behalf.
          However, they are obligated not to disclose or use the information for any other purpose.
        </p>
        <h3 className="text-xl font-bold mt-4">Security</h3>
        <p className="mt-2">
          I value your trust in providing us your Personal Information, thus we are striving to use
          commercially acceptable means of protecting it. But remember that no method of
          transmission over the internet, or method of electronic storage is 100% secure and
          reliable, and I cannot guarantee its absolute security.
        </p>
        <h3 className="text-xl font-bold mt-4">Links to Other Sites</h3>
        <p className="mt-2">
          This Service may contain links to other sites. If you click on a third-party link, you
          will be directed to that site. Note that these external sites are not operated by me.
          Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no
          control over and assume no responsibility for the content, privacy policies, or practices
          of any third-party sites or services.
        </p>
        <h3 className="text-xl font-bold mt-4">Children's Privacy</h3>
        <p className="mt-2">
          These Services do not address anyone under the age of 13. I do not knowingly collect
          personally identifiable information from children under 13. In the case I discover that a
          child under 13 has provided me with personal information, I immediately delete this from
          our servers. If you are a parent or guardian and you are aware that your child has
          provided us with personal information, please contact me so that I will be able to do
          necessary actions.
        </p>
        <h3 className="text-xl font-bold mt-4">Changes to This Privacy Policy</h3>
        <p className="mt-2">
          I may update our Privacy Policy from time to time. Thus, you are advised to review this
          page periodically for any changes. I will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>
        <p className="mt-2">
          This policy is effective as of <b>2022-01-17</b>.
        </p>
        <h3 className="text-xl font-bold mt-4">Contact Us</h3>
        <p className="mt-2">
          If you have any questions or suggestions about my Privacy Policy, do not hesitate to
          contact me at support@cuppazee.app
        </p>
        <p className="mt-2">
          This privacy policy page was created at{" "}
          <a href="https://privacypolicytemplate.net" target="_blank" rel="noopener noreferrer">
            privacypolicytemplate.net{" "}
          </a>
          and modified/generated by{" "}
          <a
            href="https://app-privacy-policy-generator.nisrulz.com/"
            target="_blank"
            rel="noopener noreferrer">
            App Privacy Policy Generator
          </a>
        </p>
      </main>

      <footer className="bg-black text-white flex flex-row justify-center w-full h-24">
        <a
          className="flex flex-grow items-center justify-center"
          href="https://sohcah.dev"
          target="_blank"
          rel="noopener noreferrer">
          Developed by Sam Hindess
        </a>
      </footer>
    </div>
  );
}
