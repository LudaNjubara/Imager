import { useAWSImageURLs, useLatestUploadsImages } from "../../../hooks/hooks";
import ImagesContainer from "../../common/ImagesContainer/Index";

function LatestUploads() {
  const { latestUploadsImagesData } = useLatestUploadsImages();
  const { imageURLsData } = useAWSImageURLs(latestUploadsImagesData ? latestUploadsImagesData : []);

  return (
    <ImagesContainer
      title="Latest Uploads"
      imagesData={latestUploadsImagesData}
      imageURLsData={imageURLsData}
    />
  );
}

export default LatestUploads;
