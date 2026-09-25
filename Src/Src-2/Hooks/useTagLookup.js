import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { EstimationService } from "../../Src-1/Service/EstimationService";
import { calcOfferDiscount, getOfferBoardRate } from "../../shared/EstimationCalculations";

/**
 * Quick Estimate tag lookup: checks the tag is not already issued, loads
 * its estimation rows and applies the tag's offer (DISCOUNT/BOARD_RATE).
 *
 * @param {string} apiBaseUrl
 * @returns {{ loading: boolean, lookupTag: (itemId, tagNo) => Promise<object[]|null> }}
 *   lookupTag resolves to the rows, or null when the tag is issued / the lookup fails.
 */
const useTagLookup = (apiBaseUrl) => {
  const service = useMemo(() => new EstimationService(apiBaseUrl), [apiBaseUrl]);
  const [loading, setLoading] = useState(false);

  const lookupTag = useCallback(
    async (itemId, tagNo) => {
      setLoading(true);
      try {
        const issued = await service.checkTagExists(itemId, tagNo);
        if (issued?.status === "issued") {
          Alert.alert(
            "Tag Already Issued",
            `This tag was already issued on ${issued.trandate}\nTransaction No: ${issued.tranno}`
          );
          return null;
        }

        const rawData = (await service.fetchEstimationData(itemId, tagNo)) || [];
        const offer = await service.getOffer(tagNo);
        const discount = calcOfferDiscount(offer);
        const boardRate = getOfferBoardRate(offer);

        return rawData.map((d) => ({ ...d, DISCOUNT: discount, BOARD_RATE: boardRate }));
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to fetch data from API");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { loading, lookupTag };
};

export default useTagLookup;
