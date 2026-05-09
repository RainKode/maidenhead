import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Service Disclaimer",
  description:
    "Terms governing use of Maidenhead Spice’s website and interactive services.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Service Disclaimer"
      intro="Maidenhead Spice maintains the interactive portion(s) of this Web site as a service free of charge. By using any interactive services provided herein, you are agreeing to comply with and be bound by the terms, conditions and notices relating to its use."
    >
      <ol>
        <li>
          As a condition of your use of this Web site and the interactive
          services contained therein, you represent and warrant to Maidenhead
          Spice that you will not use this Web site for any purpose that is
          unlawful or prohibited by these terms, conditions, and notices.
        </li>
        <li>
          Maidenhead Spice reserves the right at all times to disclose any
          information deemed by Maidenhead Spice necessary to satisfy any
          applicable law, regulation, legal process or governmental request,
          or to edit, refuse to post or to remove any information or
          materials, in whole or in part.
        </li>
        <li>
          The information, products, and services included on this Web site
          may include inaccuracies or typographical errors. Changes are
          periodically added to the information herein. Maidenhead Spice may
          make improvements and/or changes in this Web site at any time.
          Advice received via this Web site should not be relied upon for
          personal, legal or financial decisions and you should consult an
          appropriate professional for specific advice tailored to your
          situation.
        </li>
        <li>
          Maidenhead Spice makes no representations about the suitability,
          reliability, timeliness, and accuracy of the information, products,
          and services contained on this web site for any purpose. All such
          information, products, and services are provided “as is” without
          warranty of any kind.
        </li>
        <li>
          Maidenhead Spice hereby disclaims all warranties and conditions with
          regard to the information, products, and services contained on this
          web site, including all implied warranties and conditions of
          merchantability, fitness for a particular purpose, title and
          non-infringement.
        </li>
        <li>
          In no event shall Maidenhead Spice be liable for any direct,
          indirect, punitive, incidental, special, consequential damages or
          any damages whatsoever including, without limitation, damages for
          loss of use, data or profits, arising out of or in any way connected
          with the use or performance of this web site, with the delay or
          inability to use this web site, with the provision of or failure to
          provide services, or for any information, software, products,
          services and related graphics obtained through this web site, or
          otherwise arising out of the use of this web site, whether based on
          contract, tort, strict liability or otherwise, even if Maidenhead
          Spice has been advised of the possibility of damages.
        </li>
        <li>
          Due to the fact that certain jurisdictions do not permit or
          recognise an exclusion or limitation of liability for consequential
          or incidental damages, the above limitation may not apply to you. If
          you are dissatisfied with any portion of this web site, or with any
          of these terms of use, your sole and exclusive remedy is to
          discontinue using this web site.
        </li>
        <li>
          Maidenhead Spice reserves the right in its sole discretion to deny
          any user access to this Web site, any interactive service herein,
          or any portion of this Web site without notice, and the right to
          change the terms, conditions, and notices under which this Web site
          is offered.
        </li>
        <li>
          This Agreement contains the entire agreement between the parties
          relating to the subject matter hereof and supersedes any and all
          prior agreements or understandings, written or oral, between the
          parties related to the subject matter hereof. No modification of
          this Agreement shall be valid unless made in writing and signed by
          both of the parties hereto.
        </li>
        <li>
          This Agreement shall be governed by and construed in accordance with
          the laws of the United Kingdom.
        </li>
      </ol>

      <h2>Binding effect</h2>
      <p>
        This Agreement shall be binding upon all who use Maidenhead Spice
        services, property, and other assets mentioned in this agreement with
        respect to this Web site and associated content, and it supersedes all
        prior or contemporaneous communications and proposals, whether
        electronic, oral or written with respect to this Web site. A printed
        version of this agreement and of any notice given in electronic form
        shall be admissible in judicial or administrative proceedings based
        upon or relating to this agreement to the same extent and subject to
        the same conditions as other business documents and records originally
        generated and maintained in printed form. Fictitious names of
        companies, products, people, characters and/or data mentioned herein
        are not intended to represent any real individual, company, product or
        event. Any rights not expressly granted herein are reserved.
      </p>
    </LegalPage>
  );
}
