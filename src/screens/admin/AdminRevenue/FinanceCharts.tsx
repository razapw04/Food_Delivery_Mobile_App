import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import {useResponsive} from '../../../hooks/useResponsive';
import {colors} from '../../../theme';
import type {HourlyFinancePoint} from '../../../utils/revenueFromOrders';
import {styles} from './styles';

const INCOME_COLOR = '#16A34A';
const EXPENSE_COLOR = '#DC2626';

type ChartMode = 'trend' | 'compare' | 'split';
type ChartPoint = HourlyFinancePoint;

const useChartWidth = (
  pointCount: number,
  options?: {
    perPoint?: number;
    fitScreenMaxPoints?: number;
    /** Always use screen width (no horizontal overflow / scroll). */
    forceFitScreen?: boolean;
  },
) => {
  const {cardWidth} = useResponsive();
  // Weekly (≤7–8 pts): slightly wider than card so x-axis breathes a bit.
  const screenWidth = Math.max(cardWidth + 24, 320);
  const fitMax = options?.fitScreenMaxPoints ?? 8;
  if (options?.forceFitScreen || pointCount <= fitMax) {
    return screenWidth;
  }
  const perPoint = options?.perPoint ?? 48;
  return Math.max(screenWidth, pointCount * perPoint);
};

const EVEN_AXIS_STEPS = [
  500, 1000, 2000, 4000, 5000, 10000, 20000, 25000, 40000, 50000, 100000,
  200000, 250000, 400000, 500000, 1000000,
];

const formatShort = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(Math.round(value));
};

const formatAxisLabel = (raw: string) => {
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return raw;
  }
  return formatShort(value);
};

const getEvenAxisScale = (values: number[], sections = 4) => {
  const peak = Math.max(0, ...values.filter(Number.isFinite), 0);
  const needed = Math.max(peak, 1);

  for (const step of EVEN_AXIS_STEPS) {
    const maxValue = step * sections;
    if (maxValue >= needed) {
      return {maxValue, step, sections};
    }
  }

  const fallbackStep = Math.ceil(needed / sections / 20000) * 20000;
  return {
    maxValue: fallbackStep * sections,
    step: fallbackStep,
    sections,
  };
};

const shortenLabel = (label: string, isHourly?: boolean) => {
  if (isHourly) {
    return label;
  }
  // "11 Nov" / "Mon" / "Mar 26"
  if (label.length <= 6) {
    return label;
  }
  const parts = label.split(' ');
  if (parts.length >= 2) {
    return `${parts[0]}\n${parts[1]}`;
  }
  return label.slice(0, 5);
};

const Legend = ({showExpense}: {showExpense: boolean}) => (
  <View style={styles.legendRow}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: INCOME_COLOR}]} />
      <Text style={styles.legendText}>Income</Text>
    </View>
    {showExpense ? (
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, {backgroundColor: EXPENSE_COLOR}]} />
        <Text style={styles.legendText}>Expense</Text>
      </View>
    ) : null}
  </View>
);

const ChartEmpty = ({subtitle}: {subtitle: string}) => (
  <View style={styles.chartEmpty}>
    <Text style={styles.chartSubtitle}>{subtitle}</Text>
    <Text style={styles.chartEmptyText}>No sales in this range yet.</Text>
  </View>
);

const TrendLineChart = ({
  data,
  subtitle,
  isHourly,
}: {
  data: ChartPoint[];
  subtitle: string;
  isHourly?: boolean;
}) => {
  const points = data.length > 0 ? data : [];
  // Today (hourly): lock to screen width so x-axis is not scrollable.
  const chartWidth = useChartWidth(Math.max(points.length, 1), {
    perPoint: isHourly ? 56 : 48,
    fitScreenMaxPoints: isHourly ? 24 : 8,
    forceFitScreen: Boolean(isHourly),
  });
  const hasIncome = points.some(item => item.income > 0);

  const incomeData = useMemo(
    () =>
      points.map((item, index) => {
        const labelEvery = isHourly
          ? points.length <= 8
            ? 1
            : points.length <= 14
              ? 2
              : 3
          : points.length <= 10
            ? 1
            : Math.ceil(points.length / 8);
        const showLabel =
          index === 0 ||
          index === points.length - 1 ||
          index % labelEvery === 0;
        return {
          value: Math.max(item.income, 0),
          label: showLabel ? shortenLabel(item.label, isHourly) : '',
          labelTextStyle: {
            color: '#9CA3AF',
            fontSize: isHourly ? 9 : 10,
            width: isHourly ? 36 : undefined,
          },
        };
      }),
    [isHourly, points],
  );

  const initialSpacing = isHourly ? 18 : 12;
  const endSpacing = isHourly ? 22 : 16;
  // Spread hours across full width (max gap that still fits — no scroll).
  const spacing = isHourly
    ? Math.max(
        1,
        Math.floor(
          (chartWidth - initialSpacing - endSpacing) /
            Math.max(points.length, 1),
        ),
      )
    : Math.max(
        Math.floor((chartWidth - 20) / Math.max(points.length, 1)) - 4,
        36,
      );

  const axis = useMemo(
    () => getEvenAxisScale(points.map(item => item.income), 4),
    [points],
  );

  if (!hasIncome) {
    return <ChartEmpty subtitle={subtitle} />;
  }

  const chart = (
    <LineChart
      key={`line-${points.length}-${subtitle}-${isHourly ? 'h' : 'd'}`}
      data={incomeData}
      height={210}
      width={chartWidth}
      spacing={spacing}
      initialSpacing={initialSpacing}
      endSpacing={endSpacing}
      areaChart
      curved
      color={colors.primary}
      startFillColor={colors.primary}
      endFillColor={colors.primary}
      startOpacity={0.28}
      endOpacity={0.02}
      thickness={3}
      hideDataPoints={points.length > 16}
      dataPointsColor={colors.primary}
      dataPointsRadius={3.5}
      focusedDataPointColor={colors.primary}
      focusedDataPointRadius={5}
      hideRules={false}
      rulesColor="#F3F4F6"
      rulesType="solid"
      xAxisThickness={0}
      yAxisThickness={0}
      yAxisTextStyle={{color: '#9CA3AF', fontSize: 10}}
      noOfSections={axis.sections}
      maxValue={axis.maxValue}
      stepValue={axis.step}
      formatYLabel={formatAxisLabel}
      disableScroll
      pointerConfig={{
        pointerStripHeight: 160,
        pointerStripColor: '#F3F4F6',
        pointerStripWidth: 1,
        pointerColor: colors.primary,
        radius: 5,
        pointerLabelWidth: 100,
        pointerLabelHeight: 44,
        activatePointersOnLongPress: false,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: {value?: number}[]) => {
          const value = items?.[0]?.value ?? 0;
          return (
            <View style={styles.pointerLabel}>
              <Text style={styles.pointerValue}>
                {Math.round(value).toLocaleString('en-PK')}
              </Text>
              <Text style={styles.pointerHint}>income</Text>
            </View>
          );
        },
      }}
    />
  );

  return (
    <>
      <Text style={styles.chartSubtitle}>{subtitle}</Text>
      {isHourly ? (
        chart
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chart}
        </ScrollView>
      )}
    </>
  );
};

const CompareBarChart = ({
  data,
  subtitle,
  isHourly,
}: {
  data: ChartPoint[];
  subtitle: string;
  isHourly?: boolean;
}) => {
  const points = data.length > 0 ? data : [];
  const showExpense = points.some(item => item.expense > 0);
  const chartWidth = useChartWidth(Math.max(points.length, 1), {
    perPoint: showExpense ? 56 : isHourly ? 56 : 48,
    fitScreenMaxPoints: isHourly ? 24 : 8,
    forceFitScreen: Boolean(isHourly),
  });
  const hasIncome = points.some(item => item.income > 0);

  const barData = useMemo(() => {
    if (!showExpense) {
      return points.map((item, index) => {
        const showLabel =
          points.length <= 10 ||
          index === 0 ||
          index === points.length - 1 ||
          index % Math.ceil(points.length / 8) === 0;
        return {
          value: Math.max(item.income, 0),
          label: showLabel ? shortenLabel(item.label) : '',
          spacing: 6,
          labelWidth: 36,
          labelTextStyle: {color: '#6B7280', fontSize: 10},
          frontColor: INCOME_COLOR,
        };
      });
    }

    return points.flatMap((item, index) => {
      const showLabel =
        points.length <= 8 ||
        index === 0 ||
        index === points.length - 1 ||
        index % Math.ceil(points.length / 6) === 0;
      return [
        {
          value: Math.max(item.income, 0),
          label: showLabel ? shortenLabel(item.label) : '',
          spacing: 2,
          labelWidth: 36,
          labelTextStyle: {color: '#6B7280', fontSize: 10},
          frontColor: INCOME_COLOR,
        },
        {
          value: Math.max(item.expense, 0),
          frontColor: EXPENSE_COLOR,
        },
      ];
    });
  }, [points, showExpense]);

  const axis = useMemo(
    () =>
      getEvenAxisScale(
        points.flatMap(item =>
          showExpense ? [item.income, item.expense] : [item.income],
        ),
      ),
    [points, showExpense],
  );

  if (!hasIncome && !showExpense) {
    return <ChartEmpty subtitle={subtitle} />;
  }

  const barSpacing = isHourly
    ? Math.max(
        Math.floor(
          (chartWidth - 24) /
            Math.max(points.length * (showExpense ? 2 : 1), 1),
        ) - (showExpense ? 10 : 14),
        10,
      )
    : showExpense
      ? 12
      : 16;

  const barChart = (
    <BarChart
      key={`bar-${points.length}-${showExpense}-${subtitle}-${isHourly ? 'h' : 'd'}`}
      data={barData}
      barWidth={showExpense ? 10 : isHourly ? 12 : 14}
      spacing={barSpacing}
      initialSpacing={isHourly ? 14 : 8}
      roundedTop
      roundedBottom
      hideRules={false}
      rulesColor="#F3F4F6"
      rulesType="solid"
      xAxisThickness={0}
      yAxisThickness={0}
      yAxisTextStyle={{color: '#9CA3AF', fontSize: 10}}
      noOfSections={axis.sections}
      maxValue={axis.maxValue}
      stepValue={axis.step}
      formatYLabel={formatAxisLabel}
      width={chartWidth}
      height={190}
      disableScroll
    />
  );

  return (
    <>
      <Legend showExpense={showExpense} />
      <Text style={styles.chartSubtitle}>{subtitle}</Text>
      {isHourly ? (
        barChart
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {barChart}
        </ScrollView>
      )}
    </>
  );
};

const SplitPieChart = ({
  income,
  expense,
  subtitle,
  hideExpense,
}: {
  income: number;
  expense: number;
  subtitle: string;
  hideExpense: boolean;
}) => {
  const safeIncome = Math.max(income, 0);
  const safeExpense = hideExpense ? 0 : Math.max(expense, 0);
  const total = Math.max(safeIncome + safeExpense, 1);
  const incomePct = Math.round((safeIncome / total) * 100);
  const expensePct = 100 - incomePct;
  const profit = safeIncome - safeExpense;

  const pieData = useMemo(() => {
    if (hideExpense || safeExpense <= 0) {
      return [
        {
          value: Math.max(safeIncome, 1),
          color: INCOME_COLOR,
          text: '100%',
        },
      ];
    }
    return [
      {
        value: Math.max(safeIncome, 1),
        color: INCOME_COLOR,
        text: `${incomePct}%`,
      },
      {
        value: Math.max(safeExpense, 1),
        color: EXPENSE_COLOR,
        text: `${expensePct}%`,
      },
    ];
  }, [expensePct, hideExpense, incomePct, safeExpense, safeIncome]);

  if (safeIncome <= 0 && safeExpense <= 0) {
    return <ChartEmpty subtitle={subtitle} />;
  }

  return (
    <>
      <Legend showExpense={!hideExpense && safeExpense > 0} />
      <Text style={styles.chartSubtitle}>{subtitle}</Text>
      <View style={styles.pieWrap}>
        <PieChart
          data={pieData}
          donut
          radius={78}
          innerRadius={48}
          showText
          textColor="#FFFFFF"
          textSize={11}
          focusOnPress
          centerLabelComponent={() => (
            <View style={styles.pieCenter}>
              <Text style={styles.pieCenterLabel}>
                {hideExpense ? 'Income' : 'Net'}
              </Text>
              <Text
                style={[
                  styles.pieCenterValue,
                  {
                    color:
                      hideExpense || profit >= 0 ? INCOME_COLOR : EXPENSE_COLOR,
                  },
                ]}>
                {formatShort(Math.abs(hideExpense ? safeIncome : profit))}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.profitRow}>
        <View>
          <Text style={styles.hBarLabel}>Income</Text>
          <Text style={[styles.hBarValue, {color: INCOME_COLOR}]}>
            Rs. {safeIncome.toLocaleString('en-PK')}
          </Text>
        </View>
        {!hideExpense ? (
          <View style={styles.pieExpenseBlock}>
            <Text style={styles.hBarLabel}>Expense</Text>
            <Text style={[styles.hBarValue, {color: EXPENSE_COLOR}]}>
              Rs. {safeExpense.toLocaleString('en-PK')}
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
};

const MODE_OPTIONS: {key: ChartMode; label: string}[] = [
  {key: 'trend', label: 'Trend'},
  {key: 'compare', label: 'Compare'},
  {key: 'split', label: 'Split'},
];

type Props = {
  period: RevenuePeriod;
  chartTrend: {
    points: HourlyFinancePoint[];
    isHourly: boolean;
    subtitle: string;
  };
  income: number;
  expense: number;
  hideExpense?: boolean;
};

const FinanceCharts = ({
  period,
  chartTrend,
  income,
  expense,
  hideExpense = false,
}: Props) => {
  const [mode, setMode] = useState<ChartMode>('trend');
  const trend = chartTrend.points ?? [];
  const chartSubtitle = chartTrend.subtitle || 'Selected range';
  const title =
    period === 'today'
      ? 'Today by hour'
      : period === 'week'
        ? 'This week'
        : period === 'month'
          ? 'This month'
          : period === 'year'
            ? 'This year'
            : 'Filtered range';

  return (
    <View style={styles.chartsWrap}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.segmentRow}>
          {MODE_OPTIONS.map(option => {
            const active = mode === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="button"
                style={[styles.segmentChip, active && styles.segmentChipActive]}
                onPress={() => setMode(option.key)}>
                <Text
                  style={[
                    styles.segmentChipText,
                    active && styles.segmentChipTextActive,
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.chartCard}>
        {mode === 'trend' ? (
          <TrendLineChart
            data={trend}
            subtitle={chartSubtitle}
            isHourly={chartTrend.isHourly}
          />
        ) : null}
        {mode === 'compare' ? (
          <CompareBarChart
            data={trend}
            subtitle={chartSubtitle}
            isHourly={chartTrend.isHourly}
          />
        ) : null}
        {mode === 'split' ? (
          <SplitPieChart
            income={income}
            expense={expense}
            hideExpense={hideExpense}
            subtitle={
              hideExpense
                ? `${chartSubtitle} · income`
                : `${chartSubtitle} · income vs expense`
            }
          />
        ) : null}
      </View>
    </View>
  );
};

export default FinanceCharts;
