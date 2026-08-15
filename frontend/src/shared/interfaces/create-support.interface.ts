import { ShortLocaleType } from '../types/short-locale.type';
import { SerializedEditorState } from 'lexical';

export interface CreateSupportInterface {
  email: string;
  requestText: string;
  request: SerializedEditorState;
  locale: ShortLocaleType;
}
