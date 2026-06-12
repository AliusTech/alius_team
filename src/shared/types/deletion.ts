export interface DeletableItem {
  id: string;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  targetIds: string[];
  targetName?: string;
}
