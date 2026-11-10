import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {useResponsive} from '../../../hooks/useResponsive';
import type {BranchRevenueSnapshot, WeeklyFinancePoint} from './mockData';
import {styles} from './styles';

const INCOME_COLOR = '#16A34A';
const EXPENSE_COLOR = '#DC2626';

const useChartWidth = () => {
  const {cardWidth} = useResponsive();
  return Math.max(cardWidth - 24, 260);
};

const AXIS_SECTIONS = 4;

/** Even round steps so Y ticks land on clean ranges like 0–20k, 20k–40k. */
const EVEN_AXIS_STEPS = [
  1000, 2000, 4000, 5000, 10000, 20000, 25000, 40000, 50000, 100000, 200000,
  250000, 400000, 500000, 1000000,
];

const formatShort = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
};

const formatAxisLabel = (raw: string) => {
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return raw;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    const label =
      Number.isInteger(thousands) || value >= 10000
        ? `${Math.round(thousands)}k`
        : `${thousands.toFixed(1)}k`;
    return label;
  }
  return String(Math.round(value));
};

/** Pick even step + max so sections are equal (e.g. 0, 20k, 40k, 60k, 80k). */
const getEvenAxisScale = (values: number[], sections = AXIS_SECTIONS) => {
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

const Legend = () => (
  <View style={styles.legendRow}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: INCOME_COLOR}]} />
      <Text style={styles.legendText}>Income</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: EXPENSE_COLOR}]} />
      <Text style={styles.legendText}>Expense</Text>
    </View>
  </View>
);

const WeeklyBarChart = ({data}: {data: WeeklyFinancePoint[]}) => {
  const chartWidth = useChartWidth();
  const points = data.length > 0 ? data : [{label: '-', income: 0, expense: 0}];

  const barData = useMemo(
    () =>
      points.flatMap(item => [
        {
          value: Math.max(item.income, 0),
          label: item.label,
          spacing: 2,
          labelWidth: 28,
          labelTextStyle: {color: '#6B7280', fontSize: 10},
          frontColor: INCOME_COLOR,
        },
        {
          value: Math.max(item.expense, 0),
          frontColor: EXPENSE_COLOR,
        },
      ]),
    [points],
  );

  const axis = useMemo(
    () =>
      getEvenAxisScale(
        points.map(item => Math.max(item.income, item.expense)),
      ),
    [points],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Weekly income vs expense</Text>
      <Legend />
      <BarChart
        data={barData}
        barWidth={10}
        spacing={14}
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
        height={180}
        disableScroll
      />
    </View>
  );
};

const WeeklyLineChart = ({data}: {data: WeeklyFinancePoint[]}) => {
  const chartWidth = useChartWidth();
  const points = data.length > 0 ? data : [{label: '-', income: 0, expense: 0}];

  const incomeData = useMemo(
    () =>
      points.map(item => ({
        value: Math.max(item.income, 0),
        label: item.label,
        labelTextStyle: {color: '#6B7280', fontSize: 10},
      })),
    [points],
  );
  const expenseData = useMemo(
    () => points.map(item => ({value: Math.max(item.expense, 0)})),
    [points],
  );

  const spacing = Math.max(
    Math.floor(chartWidth / Math.max(points.length, 1)) - 12,
    24,
  );

  const axis = useMemo(
    () =>
      getEvenAxisScale(
        points.map(item => Math.max(item.income, item.expense)),
      ),
    [points],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Weekly trend</Text>
      <Legend />
      <LineChart
        data={incomeData}
        data2={expenseData}
        height={180}
        width={chartWidth}
        spacing={spacing}
        color1={INCOME_COLOR}
        color2={EXPENSE_COLOR}
        dataPointsColor1={INCOME_COLOR}
        dataPointsColor2={EXPENSE_COLOR}
        thickness={2}
        thickness2={2}
        hideRules={false}
        rulesColor="#F3F4F6"
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{color: '#9CA3AF', fontSize: 10}}
        noOfSections={axis.sections}
        maxValue={axis.maxValue}
        stepValue={axis.step}
        formatYLabel={formatAxisLabel}
        curved
        disableScroll
      />
    </View>
  );
};

const MonthPieChart = ({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) => {
  const safeIncome = Math.max(income, 0);
  const safeExpense = Math.max(expense, 0);
  const total = Math.max(safeIncome + safeExpense, 1);
  const incomePct = Math.round((safeIncome / total) * 100);
  const expensePct = 100 - incomePct;
  const profit = safeIncome - safeExpense;

  const pieData = useMemo(
    () => [
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
    ],
    [expensePct, incomePct, safeExpense, safeIncome],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>This month split</Text>
      <Legend />
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
              <Text style={styles.pieCenterLabel}>Net</Text>
              <Text
                style={[
                  styles.pieCenterValue,
                  {color: profit >= 0 ? INCOME_COLOR : EXPENSE_COLOR},
                ]}>
                {formatShort(Math.abs(profit))}
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
        <View style={styles.pieExpenseBlock}>
          <Text style={styles.hBarLabel}>Expense</Text>
          <Text style={[styles.hBarValue, {color: EXPENSE_COLOR}]}>
            Rs. {safeExpense.toLocaleString('en-PK')}
          </Text>
        </View>
      </View>
    </View>
  );
};

type Props = {
  snapshot: BranchRevenueSnapshot;
};

const FinanceCharts = ({snapshot}: Props) => {
  const trend = snapshot?.weeklyTrend ?? [];

  return (
    <View style={styles.chartsWrap}>
      <WeeklyBarChart data={trend} />
      <WeeklyLineChart data={trend} />
      <MonthPieChart
        income={snapshot?.month ?? 0}
        expense={snapshot?.expenseMonth ?? 0}
      />
    </View>
  );
};

export default FinanceCharts;
