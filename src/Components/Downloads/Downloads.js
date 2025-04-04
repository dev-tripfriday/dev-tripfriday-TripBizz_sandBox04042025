import React, { useState } from "react";
import main from "../Home/assets/main.jpeg";

// Simple spinner component
const Spinner = () => (
  <div className="inline-block w-4 h-4 border-2 border-t-2 border-gray-900 rounded-full animate-spin"></div>
);

const Downloads = () => {
  const [loadingApk, setLoadingApk] = useState(false);
  const [loadingManual, setLoadingManual] = useState(false);

  const handleDownload = async () => {
    const url =
      "https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/user_manual%2FTripbizz%20user%20manual%20-%20Main%20(1).pdf?alt=media&token=4c25750c-ef4a-4f50-8814-5d61c5faf5b3";

    setLoadingManual(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Tripbizz_user_manual.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoadingManual(false);
    }
  };

  const handleDownloadApk = async () => {
    const url =
      "https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/android_app%2Fapp-release%20(2).apk?alt=media&token=3d40f8ce-2ede-416f-b8eb-72f86bc6881d";

    setLoadingApk(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Tripbizz_Android_App.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoadingApk(false);
    }
  };

  return (
    <div>
      <div className="md:pt-[100px] pt-[50px] max-w-full">
        <div className="w-[90%] overflow-hidden m-auto pt-10 flex flex-col lg:flex-row items-center justify-evenly">
          <div className="max-w-[520px] w-full pt-[25px] mb-8 lg:mb-0">
            <h1 className="text-black text-[1.5rem] sm:text-[25px] text-center lg:!text-left md:[2.5rem] lg:text-[30px] xl:text-[40px] xl:leading-[52px] font-bold md:leading-[52px]">
              Download Our Latest Android App
            </h1>

            <div className="gap-2">
              <button
                className="block mx-auto rounded-sm shadow-sm lg:!mx-0 border border-black p-2 px-4 mt-4 focus:outline-none flex items-center justify-center gap-2"
                onClick={handleDownloadApk}
                disabled={loadingApk}
              >
                {loadingApk ? (
                  <>
                    <Spinner /> Downloading APK...
                  </>
                ) : (
                  "Download Mobile APK"
                )}
              </button>

              <button
                className="block mx-auto rounded-sm shadow-sm lg:!mx-0 border border-black p-2 px-4 mt-4 focus:outline-none flex items-center justify-center gap-2"
                onClick={handleDownload}
                disabled={loadingManual}
              >
                {loadingManual ? (
                  <>
                    <Spinner /> Downloading Manual...
                  </>
                ) : (
                  "Download User Manual for Tripbizz"
                )}
              </button>
            </div>
          </div>
          <img
            src={main}
            alt="hero"
            className="w-[300px] md:w-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Downloads;
