import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Keyboard,
} from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import { usePrinterService } from "../../Service/IpServices";
import { useToast } from "../../Context/ToastContext";
import { createPrinterSettingsStyles } from "./PrinterStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { storage } from "@shared/utils";
import { logger } from "@core/logger";

// Constants
const DEFAULT_PORT = "9100";
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;
const MIN_PORT = 1;
const MAX_PORT = 65535;
const PREVIEW_PRINTER_COUNT = 3;
const STORAGE_KEY_EMPLOYEE = "EMPLOYEE_ID";
const STORAGE_KEY_USERDATA = "userData";

// Helper Functions
const safeIdToString = (id) => id?.toString() ?? "";

const isValidIP = (ip) => {
  if (!IP_PATTERN.test(ip)) return false;
  return ip.split(".").every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
};

const isValidPort = (port) => {
  const portNum = Number(port);
  return !isNaN(portNum) && portNum >= MIN_PORT && portNum <= MAX_PORT;
};

const PrinterSettings = () => {
  const { theme } = useTheme();
  const styles = createPrinterSettingsStyles(theme);
  const { showToast } = useToast();
  const printerService = usePrinterService();
  const navigation = useNavigation();
  
  // Refs
  const isMountedRef = useRef(true);
  const scrollViewRef = useRef(null);
  
  // State Management
  const [printerList, setPrinterList] = useState([]);
  const [currentPrinter, setCurrentPrinterState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [host, setHost] = useState("");
  const [port, setPort] = useState(DEFAULT_PORT);
  const [printerName, setPrinterName] = useState("");
  
  const [employeeId, setEmployeeId] = useState("");

  const [showPrinterList, setShowPrinterList] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load employee ID on mount
  useEffect(() => {
    loadEmployeeId();
  }, []);

  // Load printer data when employee ID changes
  useEffect(() => {
    if (employeeId) {
      loadPrinterData();
    }
  }, [employeeId]);

  // Update form when current printer changes
  useEffect(() => {
    if (currentPrinter) {
      setHost(currentPrinter.ip_address || "");
      setPort((currentPrinter.port || DEFAULT_PORT).toString());
      setPrinterName(currentPrinter.name || "");
    } else {
      resetForm();
    }
  }, [currentPrinter]);

  // Load employee ID from AsyncStorage
  const loadEmployeeId = useCallback(async () => {
    try {
      let storedEmployeeId = await storage.get(STORAGE_KEY_EMPLOYEE);

      if (!storedEmployeeId) {
        // storage.get auto-parses JSON; guard in case it returns a raw string.
        const userData = await storage.get(STORAGE_KEY_USERDATA);
        if (userData) {
          const parsedUser =
            typeof userData === "string" ? JSON.parse(userData) : userData;
          storedEmployeeId = parsedUser.employeeId || parsedUser.id || "";
        }
      }

      if (storedEmployeeId && isMountedRef.current) {
        setEmployeeId(storedEmployeeId);
      } else {
        showToast("Employee ID not found. Please login again.", "error");
      }
    } catch (error) {
      logger.error("Error loading employee ID:", error);
      showToast("Failed to load employee data", "error");
    }
  }, [showToast]);

  // Load printer data from service
  const loadPrinterData = useCallback(async () => {
    if (!employeeId) return;
    
    try {
      logger.debug("🖨️ Loading printers for employee:", employeeId);
      
      const employeePrinters = await printerService.getPrintersByEmployee(employeeId);

      if (!isMountedRef.current) return;

      logger.debug("📦 Printers loaded:", employeePrinters?.length || 0);

      setPrinterList(employeePrinters || []);

      const activePrinter = (employeePrinters || []).find(
        (printer) => printer.active === true
      );
      setCurrentPrinterState(activePrinter || null);
    } catch (error) {
      logger.error("Error loading printer data:", error);
      if (isMountedRef.current) {
        showToast("Failed to load printer settings", "error");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [printerService, showToast, employeeId]);

  // Validate form input
  const validateInput = useCallback(() => {
    const trimmedHost = host.trim();
    const trimmedPort = port.trim();

    if (!trimmedHost) {
      showToast("Please enter printer IP address", "warning");
      return false;
    }

    if (!isValidIP(trimmedHost)) {
      showToast(
        "Invalid IP address. Format: 192.168.1.100",
        "warning"
      );
      return false;
    }

    if (!employeeId) {
      showToast("Employee ID not available", "error");
      return false;
    }

    if (!isValidPort(trimmedPort)) {
      showToast(
        `Port must be between ${MIN_PORT} and ${MAX_PORT}`,
        "warning"
      );
      return false;
    }

    return true;
  }, [host, port, employeeId, showToast]);

  // Save or update printer
  const handleSavePrinter = useCallback(async () => {
    if (!validateInput() || isSaving || !employeeId) return;

    Keyboard.dismiss();
    setIsSaving(true);

    const trimmedHost = host.trim();
    const printerDisplayName = printerName.trim() || `Printer ${trimmedHost}`;

    const printerData = {
      ipAddress: trimmedHost,
      port: Number(port),
      name: printerDisplayName,
      active: editingPrinter?.active || false,
      empId: Number(employeeId),
    };

    try {
      if (editingPrinter) {
        printerData.id = editingPrinter.id;
        await printerService.updatePrinter(printerData);
        showToast("Printer updated successfully!", "success");
      } else {
        await printerService.createPrinter(printerData);
        showToast("Printer added successfully!", "success");
      }

      await loadPrinterData();
      setEditingPrinter(null);

      if (!editingPrinter) {
        resetForm();
      }

      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error) {
      const errorMessage = error.message || "Failed to save printer";
      showToast(errorMessage, "error");
      logger.error("Save printer error:", error);
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [
    validateInput,
    isSaving,
    printerName,
    host,
    port,
    employeeId,
    editingPrinter,
    printerService,
    loadPrinterData,
    showToast,
  ]);

  // Set printer as active
  const handleSetCurrentPrinter = useCallback(
    async (printer) => {
      try {
        logger.debug("🎯 Setting printer as active:", printer.name);
        
        // First, deactivate all other printers for this employee
        const employeePrinters = printerList.filter(
          (p) => p.empId?.toString() === employeeId
        );

        const updatePromises = employeePrinters.map(async (p) => {
          const isTargetPrinter = p.id === printer.id;
          
          // Only update if status needs to change
          if ((isTargetPrinter && !p.active) || (!isTargetPrinter && p.active)) {
            return await printerService.updatePrinter({
              id: p.id,
              ipAddress: p.ip_address,
              port: p.port,
              name: p.name,
              active: isTargetPrinter,
              empId: p.empId,
            });
          }
          return p;
        });

        await Promise.all(updatePromises);
        
        if (isMountedRef.current) {
          await loadPrinterData();
          setShowPrinterList(false);
          showToast(`${printer.name} is now active`, "success");
        }
      } catch (error) {
        logger.error("Error setting current printer:", error);
        showToast(error.message || "Failed to set active printer", "error");
      }
    },
    [printerList, printerService, loadPrinterData, showToast, employeeId]
  );

  // Clear active printer
  const clearCurrentPrinter = useCallback(async () => {
    try {
      const employeePrinters = printerList.filter(
        (p) => p.empId?.toString() === employeeId && p.active
      );

      if (employeePrinters.length === 0) {
        showToast("No active printer to clear", "info");
        return;
      }

      const updatePromises = employeePrinters.map(
        async (p) =>
          await printerService.updatePrinter({
            id: p.id,
            ipAddress: p.ip_address,
            port: p.port,
            name: p.name,
            active: false,
            empId: p.empId,
          })
      );

      await Promise.all(updatePromises);
      
      if (isMountedRef.current) {
        await loadPrinterData();
        showToast("Active printer cleared", "info");
      }
    } catch (error) {
      logger.error("Error clearing current printer:", error);
      showToast("Failed to clear active printer", "error");
    }
  }, [printerList, printerService, loadPrinterData, showToast, employeeId]);

  // Edit printer
  const handleEditPrinter = useCallback((printer) => {
    setEditingPrinter(printer);
    setHost(printer.ip_address || "");
    setPort(printer.port.toString());
    setPrinterName(printer.name || "");
    setShowPrinterList(false);
    
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  // Delete printer
  const handleDeletePrinter = useCallback(
    (printer) => {
      Alert.alert(
        "Delete Printer",
        `Are you sure you want to delete "${printer.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await printerService.deletePrinter(printer.id);
                
                if (isMountedRef.current) {
                  await loadPrinterData();
                  showToast("Printer deleted successfully", "success");
                }
              } catch (error) {
                const errorMessage = error.message || "Failed to delete printer";
                showToast(errorMessage, "error");
                logger.error("Delete printer error:", error);
              }
            },
          },
        ]
      );
    },
    [printerService, loadPrinterData, showToast]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setHost("");
    setPort(DEFAULT_PORT);
    setPrinterName("");
    setEditingPrinter(null);
  }, []);

  // Clear all printers for current employee
  const handleClearAllPrinters = useCallback(async () => {
    try {
      const employeePrinters = printerList.filter(
        (p) => p.empId?.toString() === employeeId
      );

      if (employeePrinters.length === 0) {
        showToast("No printers to delete", "info");
        setShowClearConfirm(false);
        return;
      }

      await Promise.all(
        employeePrinters.map((printer) => printerService.deletePrinter(printer.id))
      );

      if (isMountedRef.current) {
        await loadPrinterData();
        setShowClearConfirm(false);
        showToast(`${employeePrinters.length} printer(s) deleted`, "success");
      }
    } catch (error) {
      logger.error("Error clearing printers:", error);
      showToast("Failed to clear printers", "error");
    }
  }, [printerList, printerService, loadPrinterData, showToast, employeeId]);

  // Refresh printers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPrinterData();
    showToast("Printer list updated", "info");
  }, [loadPrinterData, showToast]);

  // Filter printers based on search query
  const filteredPrinters = useMemo(() => {
    if (!searchQuery.trim()) return printerList;

    const query = searchQuery.toLowerCase().trim();
    return printerList.filter(
      (printer) =>
        printer.name.toLowerCase().includes(query) ||
        (printer.ip_address || "").includes(query) ||
        printer.port.toString().includes(query)
    );
  }, [printerList, searchQuery]);

  // Sort printers - active first, then by usage/date
  const sortedPrinters = useMemo(() => {
    return [...filteredPrinters].sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;

      const aDate = new Date(a.last_used || a.created_at || 0);
      const bDate = new Date(b.last_used || b.created_at || 0);

      return bDate - aDate;
    });
  }, [filteredPrinters]);

  // Render printer item
  const renderPrinterItem = useCallback(
    ({ item }) => {
      const isCurrent = item.active === true;

      return (
        <View
          style={[styles.printerItem, isCurrent && styles.currentPrinterItem]}
        >
          <View style={styles.printerInfo}>
            <View style={styles.printerNameRow}>
              <Text style={styles.printerName}>{item.name}</Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.currentBadgeText}>ACTIVE</Text>
                </View>
              )}
            </View>
            <Text style={styles.printerAddress}>
              {item.ip_address}:{item.port}
            </Text>
          </View>
          <View style={styles.printerActions}>
            {!isCurrent && (
              <TouchableOpacity
                style={[styles.actionButton, styles.selectButton]}
                onPress={() => handleSetCurrentPrinter(item)}
              >
                <MaterialIcons name="check-circle" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEditPrinter(item)}
            >
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeletePrinter(item)}
            >
              <MaterialIcons name="delete" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleSetCurrentPrinter, handleEditPrinter, handleDeletePrinter, styles]
  );

  // Key extractor
  const keyExtractor = useCallback((item) => safeIdToString(item.id), []);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
        <Text style={styles.loadingText}>Loading printer settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[theme.COLORS.primary]}
          tintColor={theme.COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.COLORS.buttonText}
          />
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Printer Settings</Text>

        <TouchableOpacity
          style={[styles.refreshButton, isRefreshing && styles.disabledButton]}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <MaterialIcons
            name="refresh"
            size={20}
            color={theme.COLORS.buttonText}
          />
        </TouchableOpacity>
      </View>

      {/* Compact Current Printer */}
      {currentPrinter && (
        <View style={styles.compactCurrentPrinter}>
          <View style={styles.compactPrinterInfo}>
            <View style={styles.compactPrinterIcon}>
              <MaterialIcons name="print" size={20} color={theme.COLORS.primary} />
            </View>
            <View style={styles.compactPrinterDetails}>
              <View style={styles.compactPrinterHeader}>
                <Text style={styles.compactPrinterName}>{currentPrinter.name}</Text>
                <View style={styles.compactActiveBadge}>
                  <View style={styles.compactActiveDot} />
                  <Text style={styles.compactActiveBadgeText}>Active</Text>
                </View>
              </View>
              <Text style={styles.compactPrinterAddress}>
                {currentPrinter.ip_address}:{currentPrinter.port}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.compactClearButton}
            onPress={clearCurrentPrinter}
          >
            <MaterialIcons name="close" size={18} color={theme.COLORS.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Add/Edit Form */}
      <View style={styles.formSection}>
        <View style={styles.formHeader}>
          <View style={styles.formTitleRow}>
            <MaterialIcons 
              name={editingPrinter ? "edit" : "add-circle-outline"} 
              size={22} 
              color={theme.COLORS.primary} 
            />
            <Text style={styles.sectionTitle}>
              {editingPrinter ? "Edit Printer" : "Add New Printer"}
            </Text>
          </View>
          {editingPrinter && (
            <TouchableOpacity onPress={resetForm} style={styles.cancelEditButton}>
              <MaterialIcons name="close" size={18} color={theme.COLORS.danger} />
              <Text style={styles.cancelEditText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Printer Name <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="label" size={18} color={theme.COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={printerName}
              onChangeText={setPrinterName}
              placeholder="e.g. Kitchen Printer"
              placeholderTextColor={theme.COLORS.placeholder}
              editable={!isSaving}
              maxLength={50}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            IP Address <Text style={styles.requiredText}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="computer" size={18} color={theme.COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={host}
              onChangeText={setHost}
              placeholder="192.168.0.8"
              placeholderTextColor={theme.COLORS.placeholder}
              keyboardType="numeric"
              editable={!isSaving}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={15}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Port <Text style={styles.requiredText}>*</Text>
          </Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="settings-ethernet" size={18} color={theme.COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={setPort}
              placeholder={DEFAULT_PORT}
              keyboardType="numeric"
              placeholderTextColor={theme.COLORS.placeholder}
              editable={!isSaving}
              maxLength={5}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSavePrinter}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.COLORS.buttonText} />
          ) : (
            <>
              <MaterialIcons 
                name={editingPrinter ? "save" : "add"} 
                size={20} 
                color={theme.COLORS.buttonText} 
              />
              <Text style={styles.buttonText}>
                {editingPrinter ? "Update Printer" : "Add Printer"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Printer List */}
      <View style={styles.savedPrintersSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="list" size={22} color={theme.COLORS.primary} />
            <Text style={styles.sectionTitle}>
              Your Printers
            </Text>
            <View style={styles.printerCountBadge}>
              <Text style={styles.printerCountText}>{printerList.length}</Text>
            </View>
          </View>
          <View style={styles.sectionActions}>
            {printerList.length > PREVIEW_PRINTER_COUNT && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setShowPrinterList(true)}
              >
                <Text style={styles.viewAllButtonText}>View All</Text>
                <MaterialIcons name="arrow-forward" size={14} color={theme.COLORS.primary} />
              </TouchableOpacity>
            )}
            {printerList.length > 0 && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={() => setShowClearConfirm(true)}
              >
                <MaterialIcons name="delete-sweep" size={16} color={theme.COLORS.buttonText} />
                <Text style={styles.clearAllButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {printerList.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="print-disabled" size={56} color={theme.COLORS.textLight} style={styles.emptyStateIcon} />
            <Text style={styles.emptyText}>No printers configured</Text>
            <Text style={styles.emptySubtext}>
              Add your first printer to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedPrinters.slice(0, PREVIEW_PRINTER_COUNT)}
            renderItem={renderPrinterItem}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Full List Modal */}
      <Modal
        visible={showPrinterList}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrinterList(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPrinterList(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Your Printers ({printerList.length})
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowPrinterList(false)}
                    style={styles.modalCloseButton}
                  >
                    <MaterialIcons name="close" size={24} color={theme.COLORS.text} />
                  </TouchableOpacity>
                </View>

                {printerList.length > 0 && (
                  <View style={styles.searchWrapper}>
                    <MaterialIcons name="search" size={20} color={theme.COLORS.textLight} style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search printers..."
                      placeholderTextColor={theme.COLORS.placeholder}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}

                {filteredPrinters.length === 0 ? (
                  <View style={styles.emptyState}>
                    <MaterialIcons 
                      name={searchQuery ? "search-off" : "print-disabled"} 
                      size={56} 
                      color={theme.COLORS.textLight} 
                      style={styles.emptyStateIcon} 
                    />
                    <Text style={styles.emptyText}>
                      {searchQuery ? "No printers found" : "No printers configured"}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={sortedPrinters}
                    renderItem={renderPrinterItem}
                    keyExtractor={keyExtractor}
                    style={styles.fullList}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        visible={showClearConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowClearConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmIconContainer}>
              <MaterialIcons name="warning" size={48} color={theme.COLORS.danger} />
            </View>
            <Text style={styles.confirmTitle}>Delete All Printers?</Text>
            <Text style={styles.confirmMessage}>
              This will permanently delete all {printerList.length} printer
              {printerList.length !== 1 ? "s" : ""} from your account. This
              action cannot be undone.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelConfirmButton]}
                onPress={() => setShowClearConfirm(false)}
              >
                <Text style={styles.cancelConfirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.deleteConfirmButton]}
                onPress={handleClearAllPrinters}
              >
                <Text style={styles.confirmButtonText}>Delete All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default PrinterSettings;