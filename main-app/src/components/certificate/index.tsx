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
      // Force a consistent size for the certificate container
      // Use higher resolution for better quality on mobile
      const containerWidth = 1684; // 1.5x for balanced quality (1.5x 1122)
      const containerHeight = 1190; // 1.5x for balanced quality (1.5x 793)
      
      // Set temporary styles to ensure correct capture
      const originalStyle = certificateRef.current.style.cssText;
      certificateRef.current.style.width = `${containerWidth}px`;
      certificateRef.current.style.height = `${containerHeight}px`;
      certificateRef.current.style.transform = 'scale(1)';
      certificateRef.current.style.transformOrigin = 'top left';
      certificateRef.current.style.margin = '0';
      certificateRef.current.style.padding = '8px';
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1, // We're already using a larger base size
        useCORS: true,
        logging: false,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: containerWidth,
        height: containerHeight,
        windowWidth: containerWidth,
        windowHeight: containerHeight,
        allowTaint: true,
        removeContainer: false,
      });

      // Restore original styles
      certificateRef.current.style.cssText = originalStyle;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      // A4 dimensions in mm (297 x 210)
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
    <div className="flex flex-col items-center p-2 sm:p-4">
      <div
        ref={certificateRef}
        className="w-full max-w-[297mm] bg-white flex flex-col items-center justify-center text-center transform scale-[0.85] sm:scale-100 origin-top"
        style={{ 
          aspectRatio: "1.414",
          minHeight: "380px",
          transform: window?.innerWidth < 640 ? 'scale(0.85)' : 'none'
        }}
      >
        <div className="border-[12px] md:border-[28px] w-full h-full p-1 md:p-6 bg-white border-[#581A57]">
          <div className="border-2 md:border-4 w-full h-full bg-white p-2 md:p-6 border-[#008FE4] flex flex-col justify-center">
            <div className="mt-12 sm:mt-14 md:mt-16">
              <h1 className="text-xl sm:text-2xl md:text-3xl mb-2 md:mb-4 text-[#4F174E] font-medium">
                CERTIFICATE OF ACHIEVEMENT
              </h1>
              <p className="text-sm sm:text-base md:text-xl mb-1">AWARDED TO</p>
              <h2 className="text-lg sm:text-xl md:text-3xl mb-2 md:mb-3 font-extrabold text-[#4F174E]">
                {recipientName}
              </h2>
              <p className="text-xs sm:text-sm md:text-base mb-1">FOR THE COURSE</p>
              <h3 className="text-base sm:text-lg md:text-xl mb-2 md:mb-3 text-[#4F174E]">{course}</h3>
              <p className="text-xs sm:text-sm md:text-base mb-1 md:mb-2">WITH A PUBLICATION IN</p>
              <p className="text-base sm:text-lg md:text-xl mb-1 md:mb-2 text-[#008FE4] font-medium leading-tight">
                {publicationTitle}
              </p>
              <p className="text-xs sm:text-sm md:text-base mb-1 md:mb-2">IN THE</p>
              <p className="text-base sm:text-lg md:text-xl mb-1 md:mb-2 text-[#4F174E] font-medium leading-tight">
                {publicationName}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm mb-1 md:mb-2 text-[#666666]">
                (DOI: {doi})
              </p>
              <div className="flex flex-col md:flex-row justify-between items-center mt-1 md:mt-4">
                <p className="text-[10px] sm:text-xs md:text-base mb-2 text-[#000] text-center md:text-left max-w-[90%] mx-auto md:max-w-none">
                  Authenticity of this certificate can be verified at
                  <a href={verificationUrl} className="break-all">
                    {" "}
                    {verificationUrl}
                  </a>{" "}
                  Sophia is a non-degree initiative.
                </p>
                <div className="w-12 sm:w-16 md:w-auto">
                  <SophiaIcon />
                </div>
              </div>
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
