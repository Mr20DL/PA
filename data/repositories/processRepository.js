import { supabase } from '../supabaseClient.js';

export default class ProcessRepository {
  async addProcess(process) {
    const { data, error } = await supabase
      .from('processes')
      .insert(process)
      .select();
    
    if (error) throw new Error(error.message);
    return data[0];
  }

  async getReadyProcesses() {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('state', 'ready')
      .order('priority', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProcessState(id, state) {
    const { error } = await supabase
      .from('processes')
      .update({ state })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
}