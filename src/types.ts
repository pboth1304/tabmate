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
 *
 * Properties:
 * - el: The HTML element associated with the Tabmate instance.
 *
 * Methods:
 * - updateOptions(options): Updates the configuration options for the Tabmate instance.
 * - detach(): Detaches the Tabmate instance, cleaning up any event listeners or bindings.
 * - getOptions(): Retrieves the current configuration options of the Tabmate instance.
 * - isAttached(): Checks whether the Tabmate instance is currently attached and active.
 */
export interface TabmateInstance {
  el: TabmateTarget;
  //updateOptions(options: Partial<TabmateOptions>): void;
  detach(): void;
  getOptions(): TabmateOptions;
  //isAttached(): boolean;*/
}

export type TabmateTarget = HTMLTextAreaElement;
