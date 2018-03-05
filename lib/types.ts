export interface NewEvent {
  type: string;
  date: Date;
  payload?: object;
  targetType?: string;
  targetId?: string;
}

export interface Event extends NewEvent {
  id: string;
}

export interface NewDbEvent {
  type: string;
  date: Date;
  payload?: object;
  target_type?: string;
  target_id?: string;
}

export interface DbEvent extends NewDbEvent {
  id: string;
}
