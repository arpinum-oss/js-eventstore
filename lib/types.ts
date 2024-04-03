export interface EventValue {
  type: string;
  date: Date;
  targetType?: string;
  targetId?: string;
  payload?: unknown;
}

export interface Event extends EventValue {
  id: string;
}

export interface DbEventValue {
  type: string;
  date: Date;
  target_type?: string;
  target_id?: string;
  payload?: unknown;
}

export interface DbEvent extends DbEventValue {
  id: string;
}
