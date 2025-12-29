export interface ParticipantsOptionsWithKeyInterface {
  id: string;
  labelKey: 'all' | 'lessThan5' | 'from5to10' | 'moreThan10';
  min: number;
  max: number;
}
