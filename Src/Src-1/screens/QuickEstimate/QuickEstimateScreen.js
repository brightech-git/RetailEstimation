import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CommonHeader from "../../../Components/Header/CommonHeader";
import Footer from "../../../Components/Footer/Footer";
import BarcodeScannerModal from "../../Components/BarCodeScanner/BarcodeScannerModal";
import ItemDetailsCard from "../../Components/ItemDetailCard/ItemDetailCard";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createQuickEstimateStyles } from "./QuickEstimateStyles";
import { useQuickEstimate } from "../../Hook/useQuickEstimate";
import useTodayRate from "../../Hook/useTodayRate";

const QuickEstimateScreen = () => {
  const { theme } = useTheme();
  const styles = createQuickEstimateStyles(theme);
  const API_BASE_URL = useApiBaseUrl();
  const {
    goldRate,
    silverRate,
    loading: ratesLoading,
    error: ratesError,
  } = useTodayRate(API_BASE_URL);

  const ratesSubtitle = ratesLoading
    ? "Gold: ...  |  Silver: ..."
    : ratesError
      ? "Gold: --  |  Silver: --"
      : `Gold: ₹ ${goldRate?.toLocaleString() ?? "N/A"}  |  Silver: ₹ ${
          silverRate?.toLocaleString() ?? "N/A"
        }`;

  // Fetch → submit → print, all automatic
  const quick = useQuickEstimate(API_BASE_URL);
  const { EstimationPreviewComponent } = quick;
  const progressSteps = ["Fetching data", "Submitting estimate", "Printing receipt"];
  const activeStep =
    quick.status === "Fetching..." ? 0 :
    quick.status === "Submitting..." ? 1 : 2;

  return (
    <>
      <CommonHeader
        title="Quick Estimate"
        subtitle={ratesSubtitle}
        containerStyle={{ minHeight: 66, paddingVertical: 8 }}
        subtitleStyle={{ fontSize: 14, marginTop: 3, opacity: 1 }}
      />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Combined Input Field with Camera and Fetch Buttons */}
          <View style={styles.combinedInputContainer}>
            <View style={styles.combinedInputWrapper}>
              <TextInput
                style={styles.combinedInput}
                placeholder="(e.g., ABC123-456)"
                placeholderTextColor={theme.COLORS.placeholder}
                value={quick.combinedInput}
                onChangeText={quick.handleInputChange}
                editable={!quick.busy}
                onSubmitEditing={() => quick.fetchApiData()}
                returnKeyType="done"
              />

              {/* Camera Icon for Barcode Scanner */}
              <TouchableOpacity
                style={styles.scannerButton}
                onPress={quick.openScanner}
                disabled={quick.busy}
              >
                <Icon name="camera" size={24} color={theme.COLORS.primary} />
              </TouchableOpacity>

              {/* Fetch Button */}
              <TouchableOpacity
                style={[styles.fetchButton, quick.busy && styles.disabledButton]}
                onPress={() => quick.fetchApiData()}
                disabled={quick.busy}
              >
                <Text style={styles.fetchButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  {quick.status || "Fetch"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Validation Error Message */}
            {quick.validationError ? (
              <Text style={styles.errorText}>{quick.validationError}</Text>
            ) : null}

            {/* Helper Text */}
            <Text style={styles.helperText}>
              Format: ITEMID-TAGNO (separated by hyphen) — Fetch saves and prints automatically
            </Text>
          </View>

          {/* Progress: fetching / saving / printing */}
          {quick.busy && (
            <ActivityIndicator
              size="large"
              color={theme.COLORS.primary}
              style={styles.loader}
            />
          )}

          {/* Item Details */}
          {quick.displayData.length > 0 && (
            <View style={styles.itemsContainer}>
              <View style={styles.cardsGrid}>
                {quick.displayData.map((item, index) => (
                  <ItemDetailsCard
                    key={`item-${index}`}
                    item={item}
                    index={index}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                styles.printButton,
                !quick.canPrint && styles.disabledButton,
              ]}
              onPress={quick.handlePrint}
              disabled={!quick.canPrint}
            >
              <Text style={styles.submitButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>Reprint Slip</Text>
            </TouchableOpacity>
          </View>

          {/* Scanner Modal */}
          <BarcodeScannerModal
            visible={quick.scannerVisible}
            onClose={quick.closeScanner}
            scanningField={quick.scanningField}
            onScanned={quick.handleScanned}
          />

          {/* Print Preview */}
          {EstimationPreviewComponent &&
            React.isValidElement(EstimationPreviewComponent) &&
            EstimationPreviewComponent}

          <Modal
            visible={quick.busy}
            transparent
            animationType="fade"
            onRequestClose={() => {}}
          >
            <View style={styles.progressOverlay}>
              <View style={styles.progressCard}>
                <View style={styles.rocketBadge}>
                  <Icon name="rocket-launch" size={32} color={theme.COLORS.buttonText} />
                </View>
                <Text style={styles.progressTitle}>Quick Estimate</Text>
                <Text style={styles.progressStatus}>
                  {quick.status || "Preparing..."}
                </Text>
                <View style={styles.progressSteps}>
                  {progressSteps.map((step, index) => {
                    const complete = index < activeStep;
                    const current = index === activeStep;
                    return (
                      <View key={step} style={styles.progressStep}>
                        <View
                          style={[
                            styles.progressStepIcon,
                            (complete || current) && styles.progressStepIconActive,
                          ]}
                        >
                          <Icon
                            name={complete ? "check" : current ? "rocket-launch" : "circle-outline"}
                            size={16}
                            color={
                              complete || current
                                ? theme.COLORS.buttonText
                                : theme.COLORS.placeholder
                            }
                          />
                        </View>
                        <Text
                          style={[
                            styles.progressStepText,
                            (complete || current) && styles.progressStepTextActive,
                          ]}
                        >
                          {step}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};

export default QuickEstimateScreen;
