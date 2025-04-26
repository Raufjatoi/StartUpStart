import { supabase } from '@/lib/supabase';

export async function handleLemonsqueezyWebhook(event: any) {
  const { data } = event;

  switch (event.type) {
    case 'subscription_created':
      await handleSubscriptionCreated(data);
      break;
    case 'subscription_updated':
      await handleSubscriptionUpdated(data);
      break;
    case 'subscription_cancelled':
      await handleSubscriptionCancelled(data);
      break;
  }
}

async function handleSubscriptionCreated(data: any) {
  const { user_id } = data.custom_data;
  
  // Update user's subscription status in Supabase
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_id: data.id,
      subscription_plan: 'pro'
    })
    .eq('id', user_id);

  if (error) {
    console.error('Error updating subscription status:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  const { user_id } = data.custom_data;
  
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: data.status,
      subscription_plan: 'pro'
    })
    .eq('id', user_id);

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  const { user_id } = data.custom_data;
  
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      subscription_plan: 'free'
    })
    .eq('id', user_id);

  if (error) {
    console.error('Error cancelling subscription:', error);
  }
}