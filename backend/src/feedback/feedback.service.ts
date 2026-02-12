import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const { data, error } = await this.supabase
      .from('feedback')
      .insert([
        {
          name: createFeedbackDto.name,
          email: createFeedbackDto.email,
          message: createFeedbackDto.message,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw new Error(`Failed to create feedback: ${error.message}`);
    }

    return data[0];
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch feedback: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch feedback: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete feedback: ${error.message}`);
    }

    return { message: 'Feedback deleted successfully' };
  }
}
