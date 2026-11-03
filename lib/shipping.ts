const ZONES = [
  { fee: 75, areas: ['Cairo', 'Giza'] },
  { fee: 80, areas: ['Giza Suburbs', 'Cairo Outskirts'] },
  { 
    fee: 100, 
    areas: [
      'Beheira', 'Kafr El Sheikh', 'Dakahlia', 'Qalyubia', 
      'Damietta', 'Monufia', 'Sharqia', 'Gharbia', 
      'Ismailia', 'Suez', 'Port Said'
    ] 
  },
  { 
    fee: 120, 
    areas: [
      'Fayoum', 'Beni Suef', 'Minya', 'Assiut', 
      'Sohag', 'Qena', 'Luxor', 'Aswan'
    ] 
  },
  { fee: 150, areas: ['Matrouh', 'New Valley', 'Red Sea', 'Sharm El Sheikh'] }
];

export const SHIPPING_FEES: Record<string, number> = Object.fromEntries(
  ZONES.flatMap(({ fee, areas }) => areas.map((area) => [area, fee])),
);

export const GOVERNORATES = Object.keys(SHIPPING_FEES).sort();

export const shippingFee = (city: string): number | undefined => SHIPPING_FEES[city];
