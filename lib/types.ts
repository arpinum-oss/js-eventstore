export interface EventValue {
  type: string;
  date: Date;
  payload?: object;
  targetType?: string;
  targetId?: string;
}

export interface Event extends EventValue {
  id: string;
}

export interface DbEventValue {
  type: string;
  date: Date;
  payload?: object;
  target_type?: string;
  target_id?: string;
}

export interface DbEvent extends DbEventValue {
  id: string;
}
