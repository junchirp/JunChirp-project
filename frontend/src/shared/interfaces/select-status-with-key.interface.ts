export interface SelectStatusWithKeyInterface {
  id: string;
  labelKey: 'active' | 'completed' | 'all';
  value: number | string | null;
}
