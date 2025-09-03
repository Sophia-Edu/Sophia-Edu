import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "..";
import { SophiaIcon } from "../../assets";

type Props = {
  publicationName: string;
  publicationTitle: string;
  course: string;
  doi: string;
  recipientName: string;
  verificationUrl: string;
  onDownload?: () => Promise<void> | void;
};

const CertificateComponent: React.FC<Props> = ({
  publicationName,
  publicationTitle,
  course,
  doi,
  recipientName,
  verificationUrl,
  onDownload,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    if (certificateRef.current) {
      // Use device pixel ratio for higher resolution
      const scale = window.devicePixelRatio || 1;
      const canvas = await html2canvas(certificateRef.current, {
        scale: scale,
        useCORS: true, // Ensure cross-origin images are handled
        logging: true, // Log progress to the console
        scrollX: 0, // Prevent capturing the scrollbars
        scrollY: 0,
        width: certificateRef.current.scrollWidth, // Capture full width
        height: certificateRef.current.scrollHeight, // Capture full height
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("certificate.pdf");
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (onDownload) {
      try {
        setLoading(true);
        await onDownload();
      } finally {
        setLoading(false);
      }
      return;
    }
    await generatePDF();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div
        ref={certificateRef}
        className="w-full max-w-[297mm] h-auto p-4 md:p-16 bg-white flex flex-col items-center justify-center text-center"
      >
        <div className="border-[28px] w-full h-full p-4 md:p-8 bg-white border-[#581A57]">
          <div className="border-4 w-full h-full bg-white p-8  border-[#008FE4]">
            <h1 className="text-xl md:text-3xl mb-5 text-[#4F174E] font-medium">
              CERTIFICATE OF ACHIEVEMENT
            </h1>
            <p className="text-base md:text-xl mb-2">AWARDED TO</p>
            <h2 className="text-2xl md:text-3xl mb-5 font-extrabold text-[#4F174E]">
              {recipientName}
            </h2>
            <p className="text-sm md:text-base mb-2">FOR THE COURSE</p>
            <h3 className="text-lg md:text-xl mb-5 text-[#4F174E]">{course}</h3>
            <p className="text-sm md:text-base mb-2">WITH A PUBLICATION IN</p>
            <p className="text-lg md:text-xl mb-2 text-[#008FE4] font-medium">
              {publicationTitle}
            </p>
            <p className="text-sm md:text-base mb-2">IN THE</p>
            <p className="text-lg md:text-xl mb-2 text-[#4F174E] font-medium">
              {publicationName}
            </p>
            <p className="text-xs md:text-sm mb-2 text-[#666666]">
              (DOI: {doi})
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm md:text-base mb-2 text-[#000] text-center md:text-left">
                Authenticity of this certificate can be verified at
                <a href={verificationUrl}>
                  {" "}
                  {verificationUrl}
                </a>{" "}
                Sophia is a non-degree initiative.
              </p>
              <SophiaIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">Copy Certificate link below</div>
      <Button
        label="Download Certificate"
        onclick={handleDownload}
        loading={loading}
        className="mt-5 px-4 py-2 bg-[#4F174E] text-white rounded hover:bg-[#4f174e62]"
      />
    </div>
  );
};

export default CertificateComponent;
