// // app/routes/api.pos-search.jsx
// import { authenticate } from '../shopify.server';
 
// // Handle OPTIONS preflight requests
// export async function loader({ request }) {
//   if (request.method === 'OPTIONS') {
//     return new Response(null, {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//     });
//   }
//   return new Response('Method not allowed', { status: 405 });
// }
 
// export async function action({ request }) {
//   if (request.method !== 'POST') {
//     console.log('❌ Not a POST request');
//     return new Response(JSON.stringify({ error: 'Method not allowed' }), {
//       status: 405,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
 
//   try {
//     const { admin } = await authenticate.admin(request);
//     const body = await request.json();
//     const { type, value } = body;
 
//     console.log('📝 Search request:', { type, value });
 
//     if (!type || !value) {
//       console.log('❌ Missing type or value');
//       return new Response(JSON.stringify({ error: 'Missing type or value' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
 
//     const cleanValue = value.replace(/#/g, '').trim();
//     console.log('🔍 Clean value:', cleanValue);
//     let results = [];
 
//     if (type === 'products') {
//       console.log('📦 Searching products with query: title:*' + cleanValue + '*');
     
//       const response = await admin.graphql(`
//         query {
//           products(first: 20, query: "title:*${cleanValue}*") {
//             edges {
//               node {
//                 id
//                 title
//                 handle
//                 variants(first: 1) {
//                   edges {
//                     node {
//                       id
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       `);
 
//       console.log('✓ GraphQL response received');
 
//       if (response.errors) {
//         console.error('❌ GraphQL error:', response.errors);
//         return new Response(JSON.stringify({ error: 'GraphQL error: ' + response.errors[0].message }), {
//           status: 500,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }
 
//       if (!response.products || !response.products.edges) {
//         console.log('⚠️ No products found');
//         return new Response(JSON.stringify({ results: [] }), {
//           status: 200,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       }
 
//       results = response.products.edges.map(edge => {
//         const variantId = edge.node.variants?.edges?.[0]?.node?.id;
//         return {
//           id: edge.node.id,
//           title: edge.node.title,
//           handle: edge.node.handle,
//           variantId: variantId || null,
//         };
//       });
 
//       console.log('✓ Products found:', results.length);
 
//     } else if (type === 'customers') {
//       console.log('👤 Searching customers...');
     
//       const response = await admin.graphql(`
//         query {
//           customers(first: 20, query: "${cleanValue}") {
//             edges {
//               node {
//                 id
//                 displayName
//                 email
//               }
//             }
//           }
//         }
//       `);
 
//       if (response.errors) {
//         throw new Error(response.errors[0].message);
//       }
 
//       results = response.customers?.edges?.map(edge => ({
//         id: edge.node.id,
//         name: edge.node.displayName,
//         email: edge.node.email,
//       })) || [];
 
//       console.log('✓ Customers found:', results.length);
 
//     } else if (type === 'orders') {
//       console.log('📋 Searching orders...');
     
//       const response = await admin.graphql(`
//         query {
//           orders(first: 20, query: "name:*${cleanValue}*") {
//             edges {
//               node {
//                 id
//                 name
//                 createdAt
//                 displayFinancialStatus
//                 displayFulfillmentStatus
//                 customer {
//                   displayName
//                 }
//               }
//             }
//           }
//         }
//       `);
 
//       if (response.errors) {
//         throw new Error(response.errors[0].message);
//       }
 
//       results = response.orders?.edges?.map(edge => ({
//         id: edge.node.id,
//         orderNumber: edge.node.name,
//         createdAt: edge.node.createdAt,
//         status: edge.node.displayFinancialStatus,
//         fulfillment: edge.node.displayFulfillmentStatus,
//         customer: edge.node.customer?.displayName || 'Unknown',
//       })) || [];
 
//       console.log('✓ Orders found:', results.length);
//     }
 
//     console.log('✓ Returning', results.length, 'results');
//     return new Response(JSON.stringify({ results }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });
 
//   } catch (error) {
//     console.error('❌ POS Search error:', error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
 
 