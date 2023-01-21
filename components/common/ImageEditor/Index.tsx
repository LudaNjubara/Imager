import { useState, MouseEvent, ChangeEvent, useRef, LegacyRef } from "react";
import { toPng, toJpeg, toSvg } from "html-to-image";

import Slider from "../Slider/Slider";

import styles from "./imageEditor.module.css";
import { getEditedImage } from "../../../utils/common/utils";
import SaveAsDropdown from "./SaveAsDropdown";

type TImageEditorProps = {
  imageURL: string | null;
  containerRef: any;
  setImageDataURL: (imageDataURL: string) => void;
};

type TFilterType = "filters" | "transforms" | "borders";

export type TFilter = {
  name: string;
  filterType: TFilterType;
  value: number;
  range: {
    min: number;
    max: number;
  };
};

type TFilters = {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayScale: number;
  hueRotate: number;
  invert: number;
  blur: number;
  opacity: number;
};

type TTransforms = {
  rotate: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  skewX: number;
  skewY: number;
};

type TBorders = {
  borderWidth: number;
  borderRadius: number;
  borderColor: string | undefined;
};

function ImageEditor({ imageURL, containerRef, setImageDataURL }: TImageEditorProps) {
  const someRef = useRef(null);

  const [filters, setFilters] = useState<TFilters>({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    sepia: 0,
    grayScale: 0,
    hueRotate: 0,
    invert: 0,
    blur: 0,
    opacity: 1,
  });

  const [transforms, setTransforms] = useState<TTransforms>({
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
  });

  const [borders, setBorders] = useState<TBorders>({
    borderWidth: 0,
    borderRadius: 0,
    borderColor: undefined,
  });

  const inputs = {
    filters: [
      {
        name: `blur`,
        filterType: "filters",
        value: filters.blur,
        range: {
          min: 0,
          max: 20,
        },
      },
      {
        name: `brightness`,
        filterType: "filters",
        value: filters.brightness,
        range: {
          min: 0.1,
          max: 2,
        },
      },
      {
        name: `contrast`,
        filterType: "filters",
        value: filters.contrast,
        range: {
          min: 0.4,
          max: 5,
        },
      },
      {
        name: `opacity`,
        filterType: "filters",
        value: filters.opacity,
        range: {
          min: 0.1,
          max: 1,
        },
      },
      {
        name: `grayScale`,
        filterType: "filters",
        value: filters.grayScale,
        range: {
          min: 0,
          max: 1,
        },
      },
      {
        name: `hueRotate`,
        filterType: "filters",
        value: filters.hueRotate,
        range: {
          min: 0,
          max: 360,
        },
      },
      {
        name: `invert`,
        filterType: "filters",
        value: filters.invert,
        range: {
          min: 0,
          max: 1,
        },
      },
      {
        name: `sepia`,
        filterType: "filters",
        value: filters.sepia,
        range: {
          min: 0,
          max: 1,
        },
      },
      {
        name: `saturation`,
        filterType: "filters",
        value: filters.saturation,
        range: {
          min: 0,
          max: 4,
        },
      },
    ] as TFilter[],
    transforms: [
      {
        name: `rotate`,
        filterType: "transforms",
        value: transforms.rotate,
        range: {
          min: -360,
          max: 360,
        },
      },
      {
        name: `rotateX`,
        filterType: "transforms",
        value: transforms.rotateX,
        range: {
          min: -360,
          max: 360,
        },
      },
      {
        name: `rotateY`,
        filterType: "transforms",
        value: transforms.rotateY,
        range: {
          min: -360,
          max: 360,
        },
      },
      {
        name: `scale`,
        filterType: "transforms",
        value: transforms.scale,
        range: {
          min: 0.4,
          max: 1.5,
        },
      },
      {
        name: `skewX`,
        filterType: "transforms",
        value: transforms.skewX,
        range: {
          min: -360,
          max: 360,
        },
      },
      {
        name: `skewY`,
        filterType: "transforms",
        value: transforms.skewY,
        range: {
          min: -360,
          max: 360,
        },
      },
    ] as TFilter[],
    borders: [
      {
        name: `borderWidth`,
        filterType: "borders",
        value: borders.borderWidth,
        range: {
          min: 0,
          max: 100,
        },
      },
      {
        name: `borderColor`,
        filterType: "borders",
        value: borders.borderColor,
        range: {
          min: 0,
          max: 100,
        },
      },
      {
        name: `borderRadius`,
        filterType: "borders",
        value: borders.borderRadius,
        range: {
          min: 0,
          max: 50,
        },
      },
    ] as TFilter[],
  };

  const [currentlySelectedFilter, setCurrentlySelectedFilter] = useState<TFilter>(inputs.filters[0]);

  const onReset = () => {
    setFilters({
      brightness: 1,
      contrast: 1,
      saturation: 1,
      sepia: 0,
      grayScale: 0,
      hueRotate: 0,
      invert: 0,
      blur: 0,
      opacity: 1,
    });

    setTransforms({
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      skewX: 0,
      skewY: 0,
    });

    setBorders({
      borderWidth: 0,
      borderRadius: 0,
      borderColor: undefined,
    });
  };

  const onFilterClick = (e: MouseEvent<HTMLButtonElement>) => {
    const filterName = e.currentTarget.getAttribute("data-name");
    if (!filterName) return;

    const filterType = e.currentTarget.getAttribute("data-filter-type");
    if (!filterType) return;

    const filter = inputs[filterType as TFilterType].find(
      (filter) => filter.name.toLowerCase() === filterName.toLowerCase()
    );
    if (!filter) return;

    setCurrentlySelectedFilter(filter);
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filterName = currentlySelectedFilter.name;
    if (!filterName) return;

    const filterValue = e.currentTarget.value;
    if (!filterValue) return;

    const filterType = currentlySelectedFilter.filterType;
    if (!filterType) return;

    switch (filterType) {
      case "filters":
        setFilters({
          ...filters,
          [filterName]: filterValue,
        });
        break;
      case "transforms":
        setTransforms({
          ...transforms,
          [filterName]: filterValue,
        });
        break;
      case "borders":
        setBorders({
          ...borders,
          [filterName]: filterValue,
        });
        break;
      default:
        return;
    }
  };

  const imageStyles = {
    filter: `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturation}) sepia(${filters.sepia}) grayscale(${filters.grayScale}) hue-rotate(${filters.hueRotate}deg) invert(${filters.invert}) blur(${filters.blur}px) opacity(${filters.opacity})`,
    transform: `rotate(${transforms.rotate}deg) rotateX(${transforms.rotateX}deg) rotateY(${transforms.rotateY}deg) scale(${transforms.scale}) skewX(${transforms.skewX}deg) skewY(${transforms.skewY}deg)`,
    border: `${borders.borderWidth}px solid ${borders.borderColor}`,
    borderRadius: `${borders.borderRadius}%`,
  };

  return !!imageURL ? (
    <div className={styles.imageEditor__wrapper}>
      <SaveAsDropdown editableImageContainer={someRef} setImageDataURL={setImageDataURL} />

      <div className={styles.imageEditor__imageContainer} ref={someRef}>
        <img
          src={imageURL}
          alt="Editable image"
          className={styles.imageEditor__imageContainer__image}
          style={imageStyles}
        />
      </div>

      <div className={styles.imageEditor__controlsContainer}>
        <div className={styles.imageEditor__controls}>
          {inputs.filters.map((input) => (
            <button
              type="button"
              key={input.name}
              data-name={input.name}
              data-filter-type={input.filterType}
              className={styles.imageEditor__controls__button}
              onClick={onFilterClick}
            >
              {input.name}
            </button>
          ))}
        </div>

        <div className={styles.imageEditor__controls}>
          {inputs.transforms.map((input) => (
            <button
              type="button"
              key={input.name}
              data-name={input.name}
              data-filter-type={input.filterType}
              className={styles.imageEditor__controls__button}
              onClick={onFilterClick}
            >
              {input.name}
            </button>
          ))}
        </div>

        <div className={styles.imageEditor__controls}>
          {inputs.borders.map((input) => (
            <button
              type="button"
              key={input.name}
              data-name={input.name}
              data-filter-type={input.filterType}
              className={styles.imageEditor__controls__button}
              onClick={onFilterClick}
            >
              {input.name}
            </button>
          ))}
        </div>

        <Slider filter={currentlySelectedFilter} handleSliderChange={handleSliderChange} />
      </div>
    </div>
  ) : null;
}

export default ImageEditor;
