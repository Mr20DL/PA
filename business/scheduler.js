class Scheduler {
  constructor(algorithm = 'FIFO') {
    this.algorithm = algorithm;
  }

  execute(processes, quantum = 200) {
    const results = [];
    let executedProcesses = [];
    
    switch(this.algorithm) {
      case 'FIFO':
        executedProcesses = [...processes];
        processes.forEach(process => {
          const executionTime = Math.min(quantum, process.execution_time);
          results.push({
            id: process.id,
            name: process.name,
            executionTime,
            remaining: process.execution_time - executionTime
          });
        });
        break;
        
      case 'PRIORITY':
        const sorted = [...processes].sort((a, b) => b.priority - a.priority);
        sorted.forEach(process => {
          const executionTime = Math.min(quantum, process.execution_time);
          results.push({
            id: process.id,
            name: process.name,
            executionTime,
            remaining: process.execution_time - executionTime
          });
        });
        executedProcesses = sorted;
        break;
        
      case 'ROUND_ROBIN':
        executedProcesses = [];
        const queue = [...processes];
        
        while(queue.length > 0) {
          const process = queue.shift();
          const executionTime = Math.min(quantum, process.execution_time);
          process.execution_time -= executionTime;
          
          results.push({
            id: process.id,
            name: process.name,
            executionTime,
            remaining: process.execution_time
          });
          
          if(process.execution_time > 0) {
            queue.push(process);
          } else {
            executedProcesses.push(process);
          }
        }
        break;
    }
    
    return {
      executedProcesses,
      metadata: {
        timestamp: new Date(),
        algorithm: this.algorithm,
        totalProcesses: processes.length
      }
    };
  }
}

export default Scheduler;