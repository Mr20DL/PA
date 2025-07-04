class AuditService {
  constructor(logRepository) {
    this.logRepository = logRepository
  }

  async registerAction(action, processId, metadata = {}) {
    await this.logRepository.save({
      action,
      processId,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    })
  }
}

export default AuditService