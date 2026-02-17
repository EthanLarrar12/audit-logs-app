export class FilterContextBuilder {
  private fragments: Map<string, string> = new Map();
  private variables: Record<string, unknown> = {};
  private variableDefinitions: Map<string, string> = new Map();

  /**
   * Register a GraphQL fragment to be included in the query
   * @param name Unique name for the fragment usage (field alias)
   * @param fragment The actual GraphQL fragment string (e.g. `query { field { subfield } }` body)
   */
  addFragment(name: string, fragment: string) {
    this.fragments.set(name, fragment);
  }

  /**
   * Register a variable to be passed to the query
   * @param name Variable name (without $)
   * @param type GraphQL type (e.g. "String!", "Int")
   * @param value The value of the variable
   */
  addVariable(name: string, type: string, value: unknown) {
    this.variables[name] = value;
    this.variableDefinitions.set(name, type);
  }

  /**
   * Check if any fragments have been registered
   */
  hasFragments(): boolean {
    return this.fragments.size > 0;
  }

  /**
   * Get the variables object for the query execution
   */
  getVariables(): Record<string, unknown> {
    return this.variables;
  }

  /**
   * Build the final GraphQL query string
   */
  buildQuery(): string {
    if (this.fragments.size === 0) {
      return "";
    }

    const varDefs = Array.from(this.variableDefinitions.entries())
      .map(([name, type]) => `$${name}: ${type}`)
      .join(", ");

    const queryHeader = varDefs
      ? `query AuditFilterContext(${varDefs})`
      : `query AuditFilterContext`;

    const queryBody = Array.from(this.fragments.entries())
      .map(([alias, fragment]) => `${alias}: ${fragment}`)
      .join("\n");

    return `${queryHeader} {
      ${queryBody}
    }`;
  }
}
