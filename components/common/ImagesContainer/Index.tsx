"use client";

import { useState, useEffect } from "react";

import { TImageInfo } from "../../../types/globals";
import { extractImageDataFromURL } from "../../../utils/common/utils";

import ImageItem from "../ImageItem/Index";
import ImageModal from "../ImageModal/Index";

import styles from "./imagesContainer.module.css";

type TSearchResultsProps = {
  title: string;
  imagesData?: TImageInfo[];
  imageURLsData?: string[];
  canEdit?: boolean;
};

function ImagesContainer({ title, imagesData, imageURLsData, canEdit }: TSearchResultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageURL, setModalImageURL] = useState<string>();
  const [modalImageData, setModalImageData] = useState<TImageInfo>();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalImageURLChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget as HTMLDivElement;

    const attr = target.getAttribute("data-item-image-url");
    if (!attr) throw new Error(`No data-item-image-URL attribute found in ${target}`);

    setModalImageURL(attr);
  };

  const handleImageItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    toggleModal();
    handleModalImageURLChange(e);
  };

  useEffect(() => {
    if (modalImageURL && imagesData) {
      const imageData = extractImageDataFromURL(modalImageURL, imagesData);

      setModalImageData(imageData);
    }
  }, [modalImageURL, imagesData]);

  return (
    <section className={styles.imagesContainer__wrapper}>
      <svg
        id={styles.imagesContainer__svgBackground}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 800 800"
      >
        <defs>
          <linearGradient
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            id="ffflurry-grad"
            gradientTransform="rotate(270)"
          >
            <stop stop-color="" stop-opacity="1" offset="0%"></stop>
            <stop stop-color="#2a3d54" stop-opacity="0.6" offset="45%"></stop>
            <stop stop-color="#1c2c3f" stop-opacity="0.8" offset="100%"></stop>
          </linearGradient>
        </defs>

        <g fill="url(#ffflurry-grad)">
          <rect
            width="591"
            height="1"
            x="213.5"
            y="632.5"
            rx="0.5"
            transform="rotate(235, 509, 633)"
            opacity="0.21"
          ></rect>
          <rect
            width="60"
            height="1"
            x="705"
            y="28.5"
            rx="0.5"
            transform="rotate(235, 735, 29)"
            opacity="0.68"
          ></rect>
          <rect
            width="433"
            height="1"
            x="-66.5"
            y="56.5"
            rx="0.5"
            transform="rotate(235, 150, 57)"
            opacity="0.38"
          ></rect>
          <rect
            width="51"
            height="1"
            x="581.5"
            y="351.5"
            rx="0.5"
            transform="rotate(235, 607, 352)"
            opacity="0.47"
          ></rect>
          <rect
            width="627"
            height="1"
            x="159.5"
            y="50.5"
            rx="0.5"
            transform="rotate(235, 473, 51)"
            opacity="0.55"
          ></rect>
          <rect
            width="480"
            height="1"
            x="69"
            y="244.5"
            rx="0.5"
            transform="rotate(235, 309, 245)"
            opacity="0.42"
          ></rect>
          <rect
            width="810"
            height="1"
            x="-225"
            y="206.5"
            rx="0.5"
            transform="rotate(235, 180, 207)"
            opacity="0.23"
          ></rect>
          <rect
            width="36"
            height="1"
            x="253"
            y="659.5"
            rx="0.5"
            transform="rotate(235, 271, 660)"
            opacity="0.94"
          ></rect>
          <rect
            width="75"
            height="1"
            x="713.5"
            y="94.5"
            rx="0.5"
            transform="rotate(235, 751, 95)"
            opacity="1.00"
          ></rect>
          <rect
            width="233"
            height="1"
            x="160.5"
            y="576.5"
            rx="0.5"
            transform="rotate(235, 277, 577)"
            opacity="0.91"
          ></rect>
          <rect
            width="592"
            height="1"
            x="-240"
            y="188.5"
            rx="0.5"
            transform="rotate(235, 56, 189)"
            opacity="0.60"
          ></rect>
          <rect
            width="222"
            height="1"
            x="564"
            y="219.5"
            rx="0.5"
            transform="rotate(235, 675, 220)"
            opacity="0.30"
          ></rect>
          <rect
            width="316"
            height="1"
            x="247"
            y="558.5"
            rx="0.5"
            transform="rotate(235, 405, 559)"
            opacity="0.78"
          ></rect>
          <rect
            width="326"
            height="1"
            x="586"
            y="491.5"
            rx="0.5"
            transform="rotate(235, 749, 492)"
            opacity="0.96"
          ></rect>
          <rect
            width="314"
            height="1"
            x="183"
            y="614.5"
            rx="0.5"
            transform="rotate(235, 340, 615)"
            opacity="0.43"
          ></rect>
          <rect
            width="82"
            height="1"
            x="212"
            y="525.5"
            rx="0.5"
            transform="rotate(235, 253, 526)"
            opacity="1.00"
          ></rect>
          <rect
            width="133"
            height="1"
            x="562.5"
            y="63.5"
            rx="0.5"
            transform="rotate(235, 629, 64)"
            opacity="0.57"
          ></rect>
          <rect
            width="436"
            height="1"
            x="84"
            y="401.5"
            rx="0.5"
            transform="rotate(235, 302, 402)"
            opacity="0.80"
          ></rect>
          <rect
            width="261"
            height="1"
            x="5.5"
            y="434.5"
            rx="0.5"
            transform="rotate(235, 136, 435)"
            opacity="0.80"
          ></rect>
          <rect
            width="674"
            height="1"
            x="279"
            y="640.5"
            rx="0.5"
            transform="rotate(235, 616, 641)"
            opacity="0.19"
          ></rect>
          <rect
            width="245"
            height="1"
            x="442.5"
            y="434.5"
            rx="0.5"
            transform="rotate(235, 565, 435)"
            opacity="0.70"
          ></rect>
          <rect
            width="172"
            height="1"
            x="-48"
            y="725.5"
            rx="0.5"
            transform="rotate(235, 38, 726)"
            opacity="0.20"
          ></rect>
          <rect
            width="770"
            height="1"
            x="343"
            y="738.5"
            rx="0.5"
            transform="rotate(235, 728, 739)"
            opacity="0.22"
          ></rect>
          <rect
            width="851"
            height="1"
            x="-79.5"
            y="73.5"
            rx="0.5"
            transform="rotate(235, 346, 74)"
            opacity="0.47"
          ></rect>
          <rect
            width="519"
            height="1"
            x="139.5"
            y="446.5"
            rx="0.5"
            transform="rotate(235, 399, 447)"
            opacity="0.55"
          ></rect>
          <rect
            width="326"
            height="1"
            x="-71"
            y="306.5"
            rx="0.5"
            transform="rotate(235, 92, 307)"
            opacity="0.28"
          ></rect>
          <rect
            width="719"
            height="1"
            x="-311.5"
            y="62.5"
            rx="0.5"
            transform="rotate(235, 48, 63)"
            opacity="0.46"
          ></rect>
          <rect
            width="439"
            height="1"
            x="-94.5"
            y="762.5"
            rx="0.5"
            transform="rotate(235, 125, 763)"
            opacity="0.82"
          ></rect>
          <rect
            width="408"
            height="1"
            x="536"
            y="615.5"
            rx="0.5"
            transform="rotate(235, 740, 616)"
            opacity="0.19"
          ></rect>
          <rect
            width="57"
            height="1"
            x="457.5"
            y="499.5"
            rx="0.5"
            transform="rotate(235, 486, 500)"
            opacity="0.28"
          ></rect>
          <rect
            width="429"
            height="1"
            x="15.5"
            y="342.5"
            rx="0.5"
            transform="rotate(235, 230, 343)"
            opacity="0.66"
          ></rect>
          <rect
            width="313"
            height="1"
            x="86.5"
            y="92.5"
            rx="0.5"
            transform="rotate(235, 243, 93)"
            opacity="0.66"
          ></rect>
          <rect
            width="404"
            height="1"
            x="157"
            y="763.5"
            rx="0.5"
            transform="rotate(235, 359, 764)"
            opacity="0.73"
          ></rect>
          <rect
            width="530"
            height="1"
            x="-213"
            y="585.5"
            rx="0.5"
            transform="rotate(235, 52, 586)"
            opacity="0.58"
          ></rect>
          <rect
            width="45"
            height="1"
            x="133.5"
            y="662.5"
            rx="0.5"
            transform="rotate(235, 156, 663)"
            opacity="0.28"
          ></rect>
          <rect
            width="165"
            height="1"
            x="333.5"
            y="666.5"
            rx="0.5"
            transform="rotate(235, 416, 667)"
            opacity="0.78"
          ></rect>
          <rect
            width="208"
            height="1"
            x="542"
            y="549.5"
            rx="0.5"
            transform="rotate(235, 646, 550)"
            opacity="0.89"
          ></rect>
          <rect
            width="405"
            height="1"
            x="-1.5"
            y="478.5"
            rx="0.5"
            transform="rotate(235, 201, 479)"
            opacity="0.41"
          ></rect>
          <rect
            width="604"
            height="1"
            x="238"
            y="122.5"
            rx="0.5"
            transform="rotate(235, 540, 123)"
            opacity="0.70"
          ></rect>
          <rect
            width="173"
            height="1"
            x="-34.5"
            y="502.5"
            rx="0.5"
            transform="rotate(235, 52, 503)"
            opacity="0.59"
          ></rect>
          <rect
            width="399"
            height="1"
            x="460.5"
            y="440.5"
            rx="0.5"
            transform="rotate(235, 660, 441)"
            opacity="0.79"
          ></rect>
          <rect
            width="540"
            height="1"
            x="-7"
            y="760.5"
            rx="0.5"
            transform="rotate(235, 263, 761)"
            opacity="0.26"
          ></rect>
          <rect
            width="120"
            height="1"
            x="158"
            y="636.5"
            rx="0.5"
            transform="rotate(235, 218, 637)"
            opacity="0.24"
          ></rect>
          <rect
            width="764"
            height="1"
            x="32"
            y="187.5"
            rx="0.5"
            transform="rotate(235, 414, 188)"
            opacity="0.58"
          ></rect>
          <rect
            width="184"
            height="1"
            x="70"
            y="567.5"
            rx="0.5"
            transform="rotate(235, 162, 568)"
            opacity="0.82"
          ></rect>
          <rect
            width="231"
            height="1"
            x="622.5"
            y="162.5"
            rx="0.5"
            transform="rotate(235, 738, 163)"
            opacity="0.57"
          ></rect>
          <rect
            width="516"
            height="1"
            x="68"
            y="698.5"
            rx="0.5"
            transform="rotate(235, 326, 699)"
            opacity="0.09"
          ></rect>
          <rect
            width="401"
            height="1"
            x="560.5"
            y="258.5"
            rx="0.5"
            transform="rotate(235, 761, 259)"
            opacity="0.92"
          ></rect>
          <rect
            width="364"
            height="1"
            x="-140"
            y="399.5"
            rx="0.5"
            transform="rotate(235, 42, 400)"
            opacity="0.99"
          ></rect>
          <rect
            width="342"
            height="1"
            x="588"
            y="374.5"
            rx="0.5"
            transform="rotate(235, 759, 375)"
            opacity="0.83"
          ></rect>
          <rect
            width="806"
            height="1"
            x="185"
            y="743.5"
            rx="0.5"
            transform="rotate(235, 588, 744)"
            opacity="0.89"
          ></rect>
          <rect
            width="385"
            height="1"
            x="121.5"
            y="487.5"
            rx="0.5"
            transform="rotate(235, 314, 488)"
            opacity="0.34"
          ></rect>
          <rect
            width="69"
            height="1"
            x="534.5"
            y="519.5"
            rx="0.5"
            transform="rotate(235, 569, 520)"
            opacity="0.48"
          ></rect>
          <rect
            width="177"
            height="1"
            x="425.5"
            y="374.5"
            rx="0.5"
            transform="rotate(235, 514, 375)"
            opacity="0.71"
          ></rect>
          <rect
            width="371"
            height="1"
            x="231.5"
            y="336.5"
            rx="0.5"
            transform="rotate(235, 417, 337)"
            opacity="0.11"
          ></rect>
          <rect
            width="110"
            height="1"
            x="523"
            y="278.5"
            rx="0.5"
            transform="rotate(235, 578, 279)"
            opacity="0.46"
          ></rect>
          <rect
            width="116"
            height="1"
            x="141"
            y="726.5"
            rx="0.5"
            transform="rotate(235, 199, 727)"
            opacity="0.92"
          ></rect>
          <rect
            width="445"
            height="1"
            x="463.5"
            y="326.5"
            rx="0.5"
            transform="rotate(235, 686, 327)"
            opacity="0.97"
          ></rect>
          <rect
            width="694"
            height="1"
            x="118"
            y="752.5"
            rx="0.5"
            transform="rotate(235, 465, 753)"
            opacity="0.75"
          ></rect>
          <rect
            width="298"
            height="1"
            x="344"
            y="245.5"
            rx="0.5"
            transform="rotate(235, 493, 246)"
            opacity="0.18"
          ></rect>
          <rect
            width="397"
            height="1"
            x="-107.5"
            y="651.5"
            rx="0.5"
            transform="rotate(235, 91, 652)"
            opacity="0.38"
          ></rect>
          <rect
            width="214"
            height="1"
            x="491"
            y="191.5"
            rx="0.5"
            transform="rotate(235, 598, 192)"
            opacity="0.36"
          ></rect>
        </g>
      </svg>
      <h3 className={styles.imagesContainer__title}>{title}</h3>
      <div className={styles.imagesContainer__container}>
        {imageURLsData && imagesData ? (
          imageURLsData.map((url) => (
            <ImageItem
              key={url}
              imageURL={url}
              imageData={extractImageDataFromURL(url, imagesData)}
              handleImageItemClick={handleImageItemClick}
            />
          ))
        ) : (
          <p className={styles.imagesContainer__noUploadsMessage}>
            No images can be found... check back later!
          </p>
        )}
      </div>

      {isModalOpen && (
        <ImageModal
          toggleModal={toggleModal}
          modalImageURL={modalImageURL}
          modalImageData={modalImageData}
          canEdit={canEdit}
        />
      )}
    </section>
  );
}

export default ImagesContainer;
