import { EColumnType } from '../enums/column-type.enum';

export interface IColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: EColumnType;
}
