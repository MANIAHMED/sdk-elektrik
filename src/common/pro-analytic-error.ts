export class ProAnalyticError extends Error {
    error_code?: string
  
    constructor(message: string, error_code?: string) {
      super(message)
      this.error_code = error_code
    }
  }
  
  export const logPrefix = 'pro-analytic:'
  