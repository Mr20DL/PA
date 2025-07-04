import { supabase } from '../supabaseClient.js';

class LogRepository {
  async save(logEntry) {
    const { error } = await supabase
      .from('execution_logs')
      .insert({
        action: logEntry.action,
        metadata: logEntry.metadata,
        process_id: logEntry.processId
      });
    
    if (error) console.error('Error saving log:', error);
  }

  async getLogs() {
    const { data, error } = await supabase
      .from('execution_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }
}

export default LogRepository;