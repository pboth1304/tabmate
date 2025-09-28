export interface TabmateOptions {
  /**
   * Number of tabs to indent.
   */
  tabs?: number;
  /**
   * Number of spaces per tab.
   */
  tabWidth?: number;
}

/**
 * Represents an instance of Tabmate, providing methods to update options,
 * manage its lifecycle, and retrieve its current state.
 */
export interface TabmateInstance {
  /**
   * The HTML element associated with the Tabmate instance.
   */
  el: TabmateTarget;
  /**
   * Updates the configuration options for the Tabmate instance.
   */
  updateOptions(options: Partial<TabmateOptions>): void;
  /**
   * Detaches the Tabmate instance, cleaning up any event listeners.
   */
  detach(): void;
  /**
   * Retrieves the current configuration options of the Tabmate instance
   */
  getOptions(): TabmateOptions;
}

export type TabmateTarget = HTMLTextAreaElement;
