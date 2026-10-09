const ZONES = [
  { fee: 75, areas: ['Cairo', 'Giza'] },
  { fee: 85, areas: ['Beheira', 'Kafr El Sheikh', 'Dakahlia', 'Qalyubia', 'Damietta', 'Monufia', 'Sharqia', 'Gharbia'] },
  { fee: 90, areas: ['Ismailia', 'Suez', 'Port Said'] },
  { fee: 105, areas: ['Qena', 'Luxor', 'Aswan'] },
  { fee: 150, areas: ['New Valley', 'Red Sea', 'North Coast', 'Matrouh'] },
  { fee: 200, areas: ['South Sinai', 'North Sinai'] },
  
  { fee: 85, areas: ['Alexandria','Fayoum', 'Beni Suef','Minya','Assiut', 'Sohag'] },
  
];

export const SHIPPING_FEES: Record<string, number> = Object.fromEntries(
  ZONES.flatMap(({ fee, areas }) => areas.map((area) => [area, fee])),
);

export const GOVERNORATES = Object.keys(SHIPPING_FEES).sort();

export const shippingFee = (city: string): number | undefined => SHIPPING_FEES[city];
