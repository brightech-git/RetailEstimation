import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
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

const QuickEstimateScreen = () => {
  const { theme } = useTheme();
  const styles = createQuickEstimateStyles(theme);
  const API_BASE_URL = useApiBaseUrl();

  // Fetch → submit → print, all automatic
  const quick = useQuickEstimate(API_BASE_URL);
  const { EstimationPreviewComponent } = quick;

  return (
    <>
      <CommonHeader title="Quick Estimate" />

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
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};

export default QuickEstimateScreen;
