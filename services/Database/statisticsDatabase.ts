import { doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

import { TStatisticTypes } from "../../types/globals";

export interface IStatisticsDatabase {
    UpdateStatistic: (statisticType: TStatisticTypes) => void;
}

class StatisticsDatabase implements IStatisticsDatabase {
    UpdateStatistic(statisticType: TStatisticTypes) {
        const docRef = doc(db, "statistics/statisticsData");

        switch (statisticType) {
            case "imageUploads":
                setDoc(docRef, {
                    imageUploads: {
                        title: "Image Uploads",
                        value: increment(1)
                    }
                }, { merge: true })
                    .catch((error) => {
                        throw new Error(error);
                    });

                break;

            default:
                throw new Error("Invalid statistic type");
        }


    }
}

const statisticsDatabase = Object.freeze(new StatisticsDatabase());

export default statisticsDatabase;