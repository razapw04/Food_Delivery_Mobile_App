import {
  isOpenDineInTab,
  resolveOrderChannel,
  type StoredOrder,
} from '../storage/orderStorage';
import {channelLabel} from './revenueFromOrders';

const modeLabel = (order: StoredOrder) => {
  if (order.orderMode === 'dine_in') {
    return isOpenDineInTab(order) ? 'Dine-in (open tab)' : 'Dine-in (closed)';
  }
  if (order.orderMode === 'pickup') {
    return 'Pickup';
  }
  return 'Delivery';
};

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const paymentLabel = (method: StoredOrder['paymentMethod']) => {
  if (method === 'card') {
    return 'Card';
  }
  if (method === 'jazzcash') {
    return 'JazzCash';
  }
  return 'Cash on Delivery';
};

export type OrderSlipLine = {
  label: string;
  value: string;
};

export const getOrderSlipLines = (order: StoredOrder): OrderSlipLine[] => {
  const itemLines = (order.items ?? []).map(item => ({
    label: `${item.quantity}x ${item.name}${
      item.variation ? ` (${item.variation})` : ''
    }`,
    value: formatPrice(item.unitPrice * item.quantity),
  }));

  return [
    {label: 'Order', value: order.orderId},
    {label: 'Channel', value: channelLabel(resolveOrderChannel(order))},
    {label: 'Date', value: formatWhen(order.createdAt)},
    ...(order.tableNo
      ? [{label: 'Table', value: String(order.tableNo)}]
      : []),
    ...(order.waiterName
      ? [{label: 'Waiter', value: String(order.waiterName)}]
      : []),
    {label: 'Customer', value: order.customerName || 'Customer'},
    {label: 'Phone/Email', value: order.customerEmail},
    {label: 'Mode', value: modeLabel(order)},
    {label: 'Payment', value: paymentLabel(order.paymentMethod)},
    {label: 'Status', value: order.status},
    ...itemLines,
    {label: 'Subtotal', value: formatPrice(order.productTotal)},
    {label: 'Discount', value: `- ${formatPrice(order.discount)}`},
    {label: 'Delivery', value: formatPrice(order.deliveryFee)},
    {
      label: `Tax (${order.taxPercent}%)`,
      value: formatPrice(order.taxAmount),
    },
    {label: 'TOTAL', value: formatPrice(order.totalAmount)},
  ];
};

export const buildOrderSlipText = (order: StoredOrder): string => {
  const lines = [
    'FOOD DELIVERY',
    'ORDER SLIP',
    '------------------------------',
    `CUSTOMER: ${order.customerName || 'Customer'}`,
    '------------------------------',
    `Order: ${order.orderId}`,
    `Date: ${formatWhen(order.createdAt)}`,
    ...(order.tableNo ? [`Table: ${order.tableNo}`] : []),
    ...(order.waiterName ? [`Waiter: ${order.waiterName}`] : []),
    `Email: ${order.customerEmail}`,
    `Mode: ${modeLabel(order)}`,
    `Payment: ${paymentLabel(order.paymentMethod)}`,
    `Status: ${order.status}`,
    '------------------------------',
  ];

  for (const item of order.items ?? []) {
    const name = `${item.quantity}x ${item.name}${
      item.variation ? ` (${item.variation})` : ''
    }`;
    lines.push(`${name}`);
    lines.push(`  ${formatPrice(item.unitPrice * item.quantity)}`);
  }

  lines.push('------------------------------');
  lines.push(`Subtotal: ${formatPrice(order.productTotal)}`);
  lines.push(`Discount: - ${formatPrice(order.discount)}`);
  lines.push(`Delivery: ${formatPrice(order.deliveryFee)}`);
  lines.push(`Tax (${order.taxPercent}%): ${formatPrice(order.taxAmount)}`);
  lines.push(`TOTAL: ${formatPrice(order.totalAmount)}`);

  if (order.deliveryAddress) {
    lines.push('------------------------------');
    lines.push(`Address: ${order.deliveryAddress}`);
  }
  if (order.deliveryInstructions?.trim()) {
    lines.push(`Note: ${order.deliveryInstructions.trim()}`);
  }

  lines.push('------------------------------');
  lines.push('Thank you!');
  return lines.join('\n');
};

export const buildOrderSlipHtml = (order: StoredOrder): string => {
  const itemsHtml = (order.items ?? [])
    .map(
      item => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px dashed #ddd;">
          ${item.quantity}x ${item.name}${
            item.variation ? ` <span style="color:#666">(${item.variation})</span>` : ''
          }
        </td>
        <td style="padding:6px 0;border-bottom:1px dashed #ddd;text-align:right;white-space:nowrap;">
          ${formatPrice(item.unitPrice * item.quantity)}
        </td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Order ${order.orderId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#111; margin:0; padding:24px;">
  <div style="max-width:420px;margin:0 auto;">
    <h1 style="margin:0;font-size:22px;text-align:center;">Food Delivery</h1>
    <p style="margin:4px 0 8px;text-align:center;color:#666;font-size:13px;">Order Slip</p>
    <div style="text-align:center;margin:0 0 14px;">
      <div style="font-size:22px;font-weight:800;color:#111;line-height:1.2;">
        ${order.customerName || 'Customer'}
      </div>
      <div style="margin-top:2px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:#666;">
        Customer
      </div>
    </div>
    <div style="border-top:2px solid #111;border-bottom:2px solid #111;padding:12px 0;margin-bottom:12px;font-size:13px;line-height:1.6;">
      <div><strong>Order:</strong> ${order.orderId}</div>
      <div><strong>Date:</strong> ${formatWhen(order.createdAt)}</div>
      ${
        order.tableNo
          ? `<div><strong>Table:</strong> ${order.tableNo}</div>`
          : ''
      }
      ${
        order.waiterName
          ? `<div><strong>Waiter:</strong> ${order.waiterName}</div>`
          : ''
      }
      <div><strong>Email:</strong> ${order.customerEmail}</div>
      <div><strong>Mode:</strong> ${modeLabel(order)}</div>
      <div><strong>Payment:</strong> ${paymentLabel(order.paymentMethod)}</div>
      <div><strong>Status:</strong> ${order.status}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      ${itemsHtml}
    </table>
    <div style="margin-top:12px;font-size:13px;line-height:1.7;">
      <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>${formatPrice(
        order.productTotal,
      )}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>Discount</span><span>- ${formatPrice(
        order.discount,
      )}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>Delivery</span><span>${formatPrice(
        order.deliveryFee,
      )}</span></div>
      <div style="display:flex;justify-content:space-between;"><span>Tax (${
        order.taxPercent
      }%)</span><span>${formatPrice(order.taxAmount)}</span></div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:2px solid #111;font-size:16px;font-weight:700;">
        <span>TOTAL</span><span>${formatPrice(order.totalAmount)}</span>
      </div>
    </div>
    ${
      order.deliveryAddress
        ? `<p style="margin-top:16px;font-size:12px;color:#444;"><strong>Address:</strong> ${order.deliveryAddress}</p>`
        : ''
    }
    ${
      order.deliveryInstructions?.trim()
        ? `<p style="margin-top:8px;font-size:12px;color:#444;"><strong>Note:</strong> ${order.deliveryInstructions.trim()}</p>`
        : ''
    }
    <p style="margin-top:24px;text-align:center;font-size:12px;color:#666;">Thank you!</p>
  </div>
</body>
</html>`;
};
