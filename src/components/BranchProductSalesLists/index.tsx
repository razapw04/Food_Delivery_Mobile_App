import React from 'react';
import {View} from 'react-native';
import type {TopSellingProduct} from '../../utils/revenueFromOrders';
import TopSellingProducts from '../TopSellingProducts';
import {styles} from './styles';

type Props = {
  most: TopSellingProduct[];
  hot: TopSellingProduct[];
  least: TopSellingProduct[];
  meta?: string;
  emptyText?: string;
};

const BranchProductSalesLists = ({
  most,
  hot,
  least,
  meta = 'This branch',
  emptyText = 'No countable sales yet for this branch.',
}: Props) => (
  <View style={styles.wrap}>
    <TopSellingProducts
      title="Most selling"
      meta={meta}
      products={most}
      emptyText={emptyText}
    />
    <TopSellingProducts
      title="Hot selling"
      meta={meta}
      products={hot}
      emptyText={emptyText}
    />
    <TopSellingProducts
      title="Least selling"
      meta={meta}
      products={least}
      emptyText={emptyText}
    />
  </View>
);

export default BranchProductSalesLists;
