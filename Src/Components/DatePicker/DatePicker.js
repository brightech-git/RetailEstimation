import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "../../Context/ThemeContext";
import { createDatePickerStyles } from "./DatePickerStyles";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = MONTH_NAMES.map((m) => m.slice(0, 3));
const YEARS_PER_PAGE = 12;

const isSameDay = (a, b) =>
  !!a && !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Builds a 7-column grid of Date objects (nulls for the leading/trailing
// blanks) for the given month.
const buildMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay(); // 0 = Sunday

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
};

// Chunk an array into rows of `size`.
const chunk = (arr, size) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
};

// A pure-JS calendar date picker — no native module, so it needs no
// prebuild/rebuild step and works the same in Expo Go and a dev client.
// Tap the header label to switch between day / month / year grids, so
// jumping to a distant year doesn't need dozens of taps on the arrows.
const DatePicker = ({ visible, value, onClose, onSelect, minDate, maxDate }) => {
  const { theme } = useTheme();
  const styles = createDatePickerStyles(theme);

  const initial = value instanceof Date && !isNaN(value) ? value : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [mode, setMode] = useState("days"); // "days" | "months" | "years"
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor(initial.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE
  );

  useEffect(() => {
    if (!visible) return;
    const base = value instanceof Date && !isNaN(value) ? value : new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setMode("days");
    setYearPageStart(Math.floor(base.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE);
  }, [visible]);

  const goPrev = () => {
    if (mode === "days") {
      setViewMonth((m) => {
        if (m === 0) {
          setViewYear((y) => y - 1);
          return 11;
        }
        return m - 1;
      });
    } else if (mode === "months") {
      setViewYear((y) => y - 1);
    } else {
      setYearPageStart((y) => y - YEARS_PER_PAGE);
    }
  };

  const goNext = () => {
    if (mode === "days") {
      setViewMonth((m) => {
        if (m === 11) {
          setViewYear((y) => y + 1);
          return 0;
        }
        return m + 1;
      });
    } else if (mode === "months") {
      setViewYear((y) => y + 1);
    } else {
      setYearPageStart((y) => y + YEARS_PER_PAGE);
    }
  };

  const handleHeaderPress = () => {
    if (mode === "days") setMode("months");
    else if (mode === "months") {
      setYearPageStart(Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE);
      setMode("years");
    } else setMode("months");
  };

  const handlePickMonth = (idx) => {
    setViewMonth(idx);
    setMode("days");
  };

  const handlePickYear = (year) => {
    setViewYear(year);
    setMode("months");
  };

  const isDisabled = (date) => {
    if (!date) return true;
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const today = new Date();
  const rows = buildMonthGrid(viewYear, viewMonth);
  const yearRows = chunk(
    Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i),
    3
  );

  const headerLabel =
    mode === "days"
      ? `${MONTH_NAMES[viewMonth]} ${viewYear}`
      : mode === "months"
        ? String(viewYear)
        : `${yearPageStart} – ${yearPageStart + YEARS_PER_PAGE - 1}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.card}>
              <View style={styles.monthNavRow}>
                <TouchableOpacity style={styles.navButton} onPress={goPrev} activeOpacity={0.7}>
                  <Text style={styles.navButtonText}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHeaderPress} activeOpacity={0.7}>
                  <Text style={styles.monthLabel}>{headerLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={goNext} activeOpacity={0.7}>
                  <Text style={styles.navButtonText}>›</Text>
                </TouchableOpacity>
              </View>

              {mode === "days" && (
                <>
                  <View style={styles.weekRow}>
                    {WEEK_DAYS.map((d) => (
                      <View key={d} style={styles.weekDayCell}>
                        <Text style={styles.weekDayText}>{d}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.grid}>
                    {rows.map((row, rIdx) => (
                      <View key={`row-${rIdx}`} style={styles.dayRow}>
                        {row.map((date, cIdx) => {
                          if (!date) return <View key={`empty-${cIdx}`} style={styles.dayCell} />;
                          const selected = isSameDay(date, value);
                          const isToday = isSameDay(date, today);
                          const disabled = isDisabled(date);
                          return (
                            <TouchableOpacity
                              key={`day-${cIdx}`}
                              style={styles.dayCell}
                              activeOpacity={0.6}
                              disabled={disabled}
                              onPress={() => onSelect(date)}
                            >
                              <View
                                style={[
                                  styles.dayCircle,
                                  isToday && styles.dayCircleToday,
                                  selected && styles.dayCircleSelected,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.dayText,
                                    selected && styles.dayTextSelected,
                                    disabled && { opacity: 0.35 },
                                  ]}
                                >
                                  {date.getDate()}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </>
              )}

              {mode === "months" && (
                <View style={styles.grid}>
                  {chunk(MONTH_SHORT, 3).map((row, rIdx) => (
                    <View key={`mrow-${rIdx}`} style={styles.dayRow}>
                      {row.map((label, cIdx) => {
                        const idx = rIdx * 3 + cIdx;
                        const selected = idx === viewMonth;
                        return (
                          <TouchableOpacity
                            key={label}
                            style={styles.monthCell}
                            activeOpacity={0.6}
                            onPress={() => handlePickMonth(idx)}
                          >
                            <View style={[styles.monthPill, selected && styles.dayCircleSelected]}>
                              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                                {label}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}

              {mode === "years" && (
                <View style={styles.grid}>
                  {yearRows.map((row, rIdx) => (
                    <View key={`yrow-${rIdx}`} style={styles.dayRow}>
                      {row.map((year) => {
                        const selected = year === viewYear;
                        return (
                          <TouchableOpacity
                            key={year}
                            style={styles.monthCell}
                            activeOpacity={0.6}
                            onPress={() => handlePickYear(year)}
                          >
                            <View style={[styles.monthPill, selected && styles.dayCircleSelected]}>
                              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                                {year}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.todayBtn}
                  onPress={() => onSelect(new Date())}
                  activeOpacity={0.7}
                >
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DatePicker;
