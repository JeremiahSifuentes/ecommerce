import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// Backend 
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          // Created using stripe.js dashboard
          {shipping_rate: 'shr_1LEJjqHu6PnKmeHrV4A3kZ2w'},
          {shipping_rate: 'shr_1LEJkmHu6PnKmeHrEesgvJzi'}
        ],
           // Array with different objects where we can specify the quantity and price
          //  We have to modify each specific item to provide some additional information 
          line_items: req.body.map((item) => {
            const img = item.image[0].asset._ref;
            const newImage = img.replace('image-', 'https://cdn.sanity.io/images/vfxfwnaw/production/').replace('-webp', '.webp');
  
            // Object to represent one of our items
            return {
              price_data: { 
                currency: 'usd',
                product_data: { 
                  name: item.name,
                  images: [newImage],
                },
                unit_amount: item.price * 100,
              },
              adjustable_quantity: {
                enabled:true,
                minimum: 1,
              },
              // Starting quantity
              quantity: item.quantity
            }
          }),
          // Success and Cancel URLs
          success_url: `${req.headers.origin}/success`,
          cancel_url: `${req.headers.origin}/canceled`,
        }
  
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);
  
        res.status(200).json(session);
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }