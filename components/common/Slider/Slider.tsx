import { ChangeEvent } from "react";

import { TFilter } from "../ImageEditor/Index";

import styles from "./slider.module.css";

type TSliderProps = {
  filter: TFilter;
  handleSliderChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Slider({ filter, handleSliderChange }: TSliderProps) {
  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={filter.range.min}
        max={filter.range.max}
        defaultValue={filter.value}
        step={0.1}
        className={styles.slider}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default Slider;
