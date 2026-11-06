import React, {useMemo} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import type {BranchRevenueSnapshot, WeeklyFinancePoint} from './mockData';
import {styles} from './styles';

const INCOME_COLOR = '#16A34A';
const EXPENSE_COLOR = '#DC2626';
const CHART_WIDTH = Math.min(Dimensions.get('window').width - 64, 360);

const formatShort = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
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
  const barData = useMemo(
    () =>
      data.flatMap(item => [
        {
          value: item.income,
          label: item.label,
          spacing: 2,
          labelWidth: 28,
          labelTextStyle: {color: '#6B7280', fontSize: 10},
          frontColor: INCOME_COLOR,
        },
        {
          value: item.expense,
          frontColor: EXPENSE_COLOR,
        },
      ]),
    [data],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Weekly income vs expense</Text>
      <Legend />
      <BarChart
        data={barData}
        barWidth={10}
        spacing={14}
        roundedTop
        hideRules={false}
        rulesColor="#F3F4F6"
        rulesType="solid"
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{color: '#9CA3AF', fontSize: 10}}
        noOfSections={4}
        maxValue={Math.max(
          ...data.map(item => Math.max(item.income, item.expense)),
          1,
        )}
        width={CHART_WIDTH}
        height={180}
        isAnimated
      />
    </View>
  );
};

const WeeklyLineChart = ({data}: {data: WeeklyFinancePoint[]}) => {
  const incomeData = useMemo(
    () =>
      data.map(item => ({
        value: item.income,
        label: item.label,
        labelTextStyle: {color: '#6B7280', fontSize: 10},
      })),
    [data],
  );
  const expenseData = useMemo(
    () => data.map(item => ({value: item.expense})),
    [data],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Weekly trend</Text>
      <Legend />
      <LineChart
        data={incomeData}
        data2={expenseData}
        height={180}
        width={CHART_WIDTH}
        spacing={CHART_WIDTH / Math.max(data.length, 1) - 8}
        color1={INCOME_COLOR}
        color2={EXPENSE_COLOR}
        dataPointsColor1={INCOME_COLOR}
        dataPointsColor2={EXPENSE_COLOR}
        startFillColor1={INCOME_COLOR}
        startFillColor2={EXPENSE_COLOR}
        endFillColor1={INCOME_COLOR}
        endFillColor2={EXPENSE_COLOR}
        startOpacity={0.2}
        endOpacity={0.02}
        startOpacity2={0.15}
        endOpacity2={0.02}
        areaChart
        curved
        hideRules={false}
        rulesColor="#F3F4F6"
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{color: '#9CA3AF', fontSize: 10}}
        noOfSections={4}
        isAnimated
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
  const total = Math.max(income + expense, 1);
  const incomePct = Math.round((income / total) * 100);
  const expensePct = 100 - incomePct;
  const profit = income - expense;

  const pieData = useMemo(
    () => [
      {
        value: Math.max(income, 1),
        color: INCOME_COLOR,
        text: `${incomePct}%`,
      },
      {
        value: Math.max(expense, 1),
        color: EXPENSE_COLOR,
        text: `${expensePct}%`,
      },
    ],
    [expense, expensePct, income, incomePct],
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
          fontWeight="bold"
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
            Rs. {income.toLocaleString('en-PK')}
          </Text>
        </View>
        <View style={styles.pieExpenseBlock}>
          <Text style={styles.hBarLabel}>Expense</Text>
          <Text style={[styles.hBarValue, {color: EXPENSE_COLOR}]}>
            Rs. {expense.toLocaleString('en-PK')}
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
  return (
    <View style={styles.chartsWrap}>
      <WeeklyBarChart data={snapshot.weeklyTrend} />
      <WeeklyLineChart data={snapshot.weeklyTrend} />
      <MonthPieChart
        income={snapshot.month}
        expense={snapshot.expenseMonth}
      />
    </View>
  );
};

export default FinanceCharts;
