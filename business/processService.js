import ProcessRepository from '../data/repositories/processRepository.js';
import LogRepository from '../data/repositories/logRepository.js';
import Scheduler from './scheduler.js';
import AuditService from './auditService.js';

export default class ProcessService {
  constructor() {
    this.processRepo = new ProcessRepository();
    this.logRepo = new LogRepository();
    this.auditService = new AuditService(this.logRepo);
    this.scheduler = new Scheduler();
  }

  async createProcess(processData) {
    const newProcess = {
      name: processData.name,
      execution_time: processData.executionTime,
      priority: processData.priority || 0,
      state: 'ready'
    };
    
    const process = await this.processRepo.addProcess(newProcess);
    await this.auditService.registerAction('PROCESS_CREATED', process.id, newProcess);
    return process;
  }

  async executeProcesses(algorithm = 'FIFO') {
    const processes = await this.processRepo.getReadyProcesses();
    const result = this.scheduler.execute(processes, algorithm);
    
    for (const process of result.executedProcesses) {
      await this.processRepo.updateProcessState(process.id, 'executed');
      await this.auditService.registerAction('PROCESS_EXECUTED', process.id, {
        executionTime: process.execution_time,
        algorithm
      });
    }
    
    return result;
  }

  async getExecutionLogs() {
    return this.logRepo.getLogs();
  }
}