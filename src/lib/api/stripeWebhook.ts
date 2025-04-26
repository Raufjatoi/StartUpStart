import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const YOUR_ACCOUNT_ID = 'your_stripe_account_id'; // Get this from Stripe Dashboard

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update user's subscription status
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_id: session.subscription,
            subscription_plan: 'premium'
          })
          .eq('id', session.client_reference_id);

        // Transfer funds to your account (90% of the payment)
        if (session.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            session.payment_intent as string
          );
          
          await stripe.transfers.create({
            amount: Math.floor(paymentIntent.amount * 0.9), // 90% of the payment
            currency: 'usd',
            destination: YOUR_ACCOUNT_ID,
            transfer_group: `sub_${session.subscription}`,
          });
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_plan: 'free'
          })
          .eq('subscription_id', subscription.id);
        break;
    }
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}