import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { GenerateCert, Button } from "../../../components";
import { useParams } from "react-router-dom";
import { ClientRequest } from "../../../requests";
import { URL } from "../../../utils/constants";

type CertData = {
  id: string | number;
  slug: string;
  recipient_name: string;
  course: string;
  publication_title: string;
  publication_name: string;
  doi: string;
  verification_url?: string;
  preview_image_url?: string;
  pdf_url?: string;
};

const CertView: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        if (slug) {
          const res: any = await ClientRequest.getCertificateBySlug(slug);
          const root = res?.data ?? res; // backend returns { certificate, owner_public_profile }
          const data = root?.certificate ?? root; // prefer explicit key
          // Always use frontend public route for verification, not backend API JSON URL
          const verification_url = `${window.location.origin}${URL.CERTIFICATE_PUBLIC.replace(":slug", data?.slug)}`;
          if (mounted) setCert({ ...data, verification_url });
        } else if (id) {
          const res: any = await ClientRequest.getCertificateById(id);
          const data = res?.data ?? res; // plain object
          const verification_url = `${window.location.origin}${URL.CERTIFICATE_PUBLIC.replace(":slug", data?.slug)}`;
          if (mounted) setCert({ ...data, verification_url });
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [id, slug]);

  // Remove server-driven download for now; component will use client-side PDF generation

  if (loading || !cert) return (
    <Layout>
      <div className="w-[90%] sm:w-3/5 mx-auto py-10">Loading...</div>
    </Layout>
  );

  return (
    <Layout>
      {cert.preview_image_url ? (
        <div className="w-[90%] sm:w-3/5 mx-auto py-4">
          <img
            src={cert.preview_image_url}
            alt="Certificate preview"
            className="w-full max-h-64 object-contain rounded border"
          />
        </div>
      ) : null}
      <GenerateCert
        publicationName={cert.publication_name}
        publicationTitle={cert.publication_title}
        course={cert.course}
        doi={cert.doi}
        recipientName={cert.recipient_name}
        verificationUrl={cert.verification_url || `${window.location.origin}${URL.CERTIFICATE_PUBLIC.replace(":slug", cert.slug)}`}
      />
      <div className="w-[90%] sm:w-3/5 mx-auto py-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            readOnly
            value={cert.verification_url || `${window.location.origin}${URL.CERTIFICATE_PUBLIC.replace(":slug", cert.slug)}`}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <Button
            label="Copy link"
            onclick={async () => {
              const link = cert.verification_url || `${window.location.origin}${URL.CERTIFICATE_PUBLIC.replace(":slug", cert.slug)}`;
              try {
                await navigator.clipboard.writeText(link);
              } catch (e) {
                // Fallback: select input for manual copy
              }
            }}
            className="px-4 py-2 bg-[#4F174E] text-white rounded hover:bg-[#4f174e62]"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CertView;
