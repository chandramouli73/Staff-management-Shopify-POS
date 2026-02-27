// import { useState, useRef } from 'preact/hooks';
// import { render } from 'preact';

// function Extension() {
//   const [searchValue, setSearchValue] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [debug, setDebug] = useState([]);

//   const debounceRef = useRef(null);

//   const log = (msg) => {
//     console.log('🎯 POS DEBUG:', msg);
//     setDebug(prev => [
//       ...prev.slice(-10),
//       `${new Date().toLocaleTimeString()}: ${msg}`
//     ]);
//   };

//   // ✅ POS PRODUCT SEARCH
//   const searchProducts = async (query) => {
//     if (!query.trim()) {
//       log('❌ Empty search');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       setResults([]);

//       log(`🚀 POS SEARCH: "${query}"`);
//       // Use the app proxy on your shop domain to search via the server
//       const proxyUrl = 'https://shopiee-selling.myshopify.com/apps/pos-search';
//       log(`Proxy URL: ${proxyUrl}`);
//       log(`🔍 Searching for: ${query}`);
//       const resp = await fetch(proxyUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productName: query }),
//       });
//       log(`🔗 Proxy response: ${resp.status}`);
//       const payload = await resp.json().catch(() => ({}));

//       if (!resp.ok) {
//         const msg = payload?.error || `Search failed (${resp.status})`;
//         setError(msg);
//         log(`💥 Proxy error: ${msg}`);
//         return;
//       }

//       const items = payload.results || [];
//       log(`📦 Items: ${items.length}`);

//       if (items.length === 0) {
//         setError(`No products found for "${query}"`);
//         return;
//       }

//       const products = items.map(item => ({
//         id: item.id,
//         title: item.title,
//         handle: item.handle ?? '',
//         imageUrl: item.imageUrl ?? '',
//         variants: item.variants || [],
//       }));

//       setResults(products);
//       log(`✅ Found ${products.length} products`);

//     } catch (e) {
//       log(`💥 ERROR: ${e}`);
//       setError(e.message);
//     } finally {
//       setLoading(false);
//       log('🏁 SEARCH END');
//     }
//   };

//   const handleSearchValueChange = (event) => {
//     const value = event.target?.value ?? event.detail?.value ?? '';
//     setSearchValue(value);

//     clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       searchProducts(value);
//     }, 400);
//   };

//   return (
//     <s-page heading="🔍 Product Search">
//       <s-scroll-box>

//         <s-box padding="base">
//           <s-text-field
//             label="Search products1"
//             value={searchValue}
//             placeholder="Search product title"
//             onChange={handleSearchValueChange}
//           />
//         </s-box>

//         {loading && (
//           <s-box padding="base">
//             <s-text>🔄 Searching…</s-text>
//           </s-box>
//         )}

//         {error && (
//           <s-box padding="base">
//             <s-banner status="critical">{error}</s-banner>
//           </s-box>
//         )}

//         {results.length > 0 && (
//           <s-box padding="base">
//             {results.map(product => (
//               <s-box key={product.id} padding="base" border="base">
//                 <s-text>📦 {product.title}</s-text>
//               </s-box>
//             ))}
//           </s-box>
//         )}

//         {debug.length > 0 && (
//           <s-box padding="base">
//             <s-text size="small" weight="bold">🐛 Debug</s-text>
//             {debug.map((d, i) => (
//               <s-text key={i} size="xsmall" color="subdued">{d}</s-text>
//             ))}
//           </s-box>
//         )}

//       </s-scroll-box>
//     </s-page>
//   );
// }

// export default function () {
//   render(<Extension />, document.body);
// }







// import { render } from 'preact';
// import { useState, useEffect } from 'preact/hooks';

// export default async () => {
//   render(<Extension />, document.body);
// };

// function Extension() {
//   // Store name
//   const [isLoading, setIsLoading] = useState(true);
//   const [storeName, setStoreName] = useState('');

//   // Product search
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   // Fetch store name on mount
//   useEffect(() => {
//     async function fetchStoreName() {
//       try {
//         const response = await fetch('shopify:admin/api/graphql.json', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             query: `
//               query {
//                 shop {
//                   name
//                 }
//               }
//             `,
//           }),
//         });

//         const data = await response.json();
//         setStoreName(data.data.shop.name);
//       } catch (error) {
//         console.error('Failed to fetch store name:', error);
//         setStoreName('Unknown');
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchStoreName();
//   }, []);

//   // Product search function
//   // Product search function
//   async function searchProducts() {
//     if (!searchQuery) return;

//     console.log('🔍 Searching for:', searchQuery);

//     setIsSearching(true);
//     try {
//       const response = await fetch('shopify:admin/api/graphql.json', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: `
//           query ($query: String!) {
//             products(first: 10, query: $query) {
//               edges {
//                 node {
//                   id
//                   title
//                   totalVariants
//                   priceRangeV2 {
//                     minVariantPrice {
//                       amount
//                       currencyCode
//                     }
//                   }
//                   featuredImage {
//                     url(transform: { maxWidth: 100, maxHeight: 100 })
//                     altText
//                   }
//                 }
//               }
//             }
//           }
//         `,
//           variables: {
//             query: `title:*${searchQuery}*`,
//           },
//         }),
//       });

//       const data = await response.json();

//       console.log('📦 Raw GraphQL response:', data);
//       console.log('📦 Products edges:', data?.data?.products?.edges);

//       setProducts(data.data.products.edges);
//     } catch (error) {
//       console.error('❌ Product search failed:', error);
//       setProducts([]);
//     } finally {
//       setIsSearching(false);
//     }
//   }

//   return (
//     <s-page heading="Search for required products">
//       <s-scroll-box>
//         <s-box padding="small">
//           <s-text>
//             {isLoading ? 'Fetching store name...' : `You are in ${storeName}`}
//           </s-text>
//         </s-box>

//         {/* Search Input */}
//         {/* Search Input using s-text */}
//         <s-box padding="small">
//           <s-text-field
//             label="Search products"
//             placeholder="Search products by title…"
//             value={searchQuery}
//             onChange={(event) => setSearchQuery(event.target.value)}
//           />
//           <s-button
//             onClick={searchProducts}
//             disabled={isSearching}
//           >
//             {isSearching ? 'Searching…' : 'Search'}
//           </s-button>
//         </s-box>


//         {/* Search Results */}
//         <s-box padding="small">
//           {products.length === 0 && !isSearching && (
//             <s-text appearance="subdued">No products found</s-text>
//           )}

//           {products.map(({ node }) => {
//             console.log('🖼️ Product image URL:', node.featuredImage?.url);

//             return (
//               <s-box
//                 key={node.id}
//                 padding="small"
//                 border
//                 borderRadius="medium"
//               >
//                 <s-inline-stack gap="small" align="center">
//                   {/* Product Image */}
//                   <s-box minWidth="56">
//                     {node.featuredImage ? (
//                       <s-image
//                         source={node.featuredImage.url}
//                         alt={node.featuredImage.altText || node.title}
//                         aspectRatio={1}
//                       />
//                     ) : (
//                       <s-box width="20" height="20" border />
//                     )}
//                   </s-box>

//                   {/* Product Info */}
//                   <s-stack gap="extraSmall">
//                     <s-text weight="bold">{node.title}</s-text>

//                     <s-text appearance="subdued" size="small">
//                       {node.totalVariants} variants · ₹
//                       {node.priceRangeV2.minVariantPrice.amount}
//                     </s-text>
//                   </s-stack>
//                 </s-inline-stack>
//               </s-box>
//             );
//           })}
//         </s-box>
//       </s-scroll-box>
//     </s-page>
//   );
// }




// import {render} from 'preact';
// // Import hooks for state management
// import {useState, useEffect} from 'preact/hooks';
// export default async () => {
//   render(<Extension />, document.body);
// };
// function Extension() {
//   // Set up states to track loading status of storename
//   const [isLoading, setIsLoading] = useState(true);
//   const [storeName, setStoreName] = useState('');
//   // useEffect runs when the component mounts (modal opens)
//   useEffect(() => {
//     async function fetchStoreName() {
//       try {
//         // Define the GraphQL query to fetch the storename
//         const requestBody = {
//           query: `
//             query {
//               shop {
//                 name
//               }
//             }
//           `
//         };
//         // Make a POST request to the GraphQL Admin API
//         const response = await fetch('shopify:admin/api/graphql.json', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestBody)
//         });
//         const data = await response.json();
//         // Extract the storename from the GraphQL response structure
//         setStoreName(data.data.shop.name);
//       } catch (error) {
//         // If the API call fails, log the error and show a fallback message
//         console.error('Failed to fetch store name:', error);
//         setStoreName('Unknown');
//       } finally {
//         // Set loading to false whether the request succeeded or failed
//         setIsLoading(false);
//       }
//     }

//     // Call the function to fetch the store name
//     fetchStoreName();
//   }, []);
//   return (
//     <s-page heading='Where am I?'>
//       <s-scroll-box>
//         <s-box padding="small">
//           <s-text>
//             {isLoading ? 'Fetching store name...' : `You are in ${storeName}`}
//           </s-text>
//         </s-box>
//       </s-scroll-box>
//     </s-page>
//   );
// }



// import { render } from 'preact';
// import { useState, useEffect } from 'preact/hooks';
 
// export default async () => {
//   render(<Extension />, document.body);
// };
 
// function Extension() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [storeName, setStoreName] = useState('');
 
//   // Customer search
//   const [customers, setCustomers] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
 
//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [genderFilter, setGenderFilter] = useState('');
//   const [nationalityFilter, setNationalityFilter] = useState('');
//   const [dobFilter, setDobFilter] = useState('');
//   const [finalQuery, setFinalQuery] = useState("*");
 
 
//   useEffect(() => {
//     async function fetchStoreName() {
//       try {
//         const response = await fetch('shopify:admin/api/graphql.json', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             query: `
//               query {
//                 shop {
//                   name
//                 }
//               }
//             `,
//           }),
//         });
 
//         const data = await response.json();
//         setStoreName(data.data.shop.name);
//       } catch (error) {
//         console.error('Failed to fetch store name:', error);
//         setStoreName('Unknown');
//       } finally {
//         setIsLoading(false);
//       }
//     }
 
//     fetchStoreName();
//   }, []);
// let query = "";
//   // async function search() {
//   //   let query = "";
 
//   //   if (searchQuery.trim()) {
//   //     query += `${searchQuery.trim()}`;
//   //   }
 
//   //   if (genderFilter.trim()) {
//   //     if (query) query += " AND ";
//   //     query += `metafields.custom.gender:"${genderFilter.trim()}"`;
//   //   }
 
//   //   if (nationalityFilter.trim()) {
//   //     if (query) query += " AND ";
//   //     query += `metafields.custom.nationality:"${nationalityFilter.trim()}"`;
//   //   }
 
//   //   if (dobFilter.trim()) {
//   //     if (query) query += " AND ";
//   //     query += `metafields.custom.dob:"${dobFilter.trim()}"`;
//   //   }
 
//   //   if (!query) {
//   //     query = "*";
//   //   }
 
//   //   setFinalQuery(query);
//   // }
// async function searchCustomers() {
//   setIsSearching(true);
 
//   try {
//     let baseQuery = searchQuery.trim() ? searchQuery.trim() : "*";
 
//     const requestBody = {
//       query: `
//         query ($query: String!) {
//           customers(first: 100, query: $query) {
//             edges {
//               node {
//                 id
//                 firstName
//                 lastName
//                 email
//                 phone
//                 gender: metafield(namespace: "custom", key: "gender") {
//                   value
//                 }
//                 nationality: metafield(namespace: "custom", key: "nationality") {
//                   value
//                 }
//                 dob: metafield(namespace: "custom", key: "dob") {
//                   value
//                 }
//               }
//             }
//           }
//         }
//       `,
//       variables: { query: baseQuery },
//     };
 
//     const response = await fetch('shopify:admin/api/graphql.json', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody),
//     });
 
//     const data = await response.json();
//     let fetchedCustomers = data?.data?.customers?.edges || [];
 
//     const filteredCustomers = fetchedCustomers.filter(({ node }) => {
//       const genderValue = node.gender?.value?.toLowerCase() || "";
//       const nationalityValue = node.nationality?.value?.toLowerCase() || "";
//       const dobValue = node.dob?.value || "";
 
//       const genderMatch = genderFilter
//         ? genderValue === genderFilter.toLowerCase()
//         : true;
 
//       const nationalityMatch = nationalityFilter
//         ? nationalityValue === nationalityFilter.toLowerCase()
//         : true;
 
//       const dobMatch = dobFilter
//         ? dobValue === dobFilter
//         : true;
 
//       return genderMatch && nationalityMatch && dobMatch;
//     });
 
//     setCustomers(filteredCustomers);
 
//   } catch (error) {
//     console.error('Error:', error);
//     setCustomers([]);
//   } finally {
//     setIsSearching(false);
//   }
// }
 
//   // Clear all filters
//   function clearFilters() {
//     setSearchQuery('');
//     setGenderFilter('');
//     setNationalityFilter('');
//     setDobFilter('');
//     setCustomers([]);
//   }
 
//   return (
//     <s-page heading="Search Customers">
//       <s-scroll-box>
//         <s-box padding="small">
//           <s-text>
//             {isLoading ? 'Fetching store name...' : `You are in ${storeName}`}
//           </s-text>
//         </s-box>
 
//         <s-box padding="small">
//           <s-text-field
//             label="Search by name or email"
//             placeholder="Enter customer name or email…"
//             value={searchQuery}
//             onInput={(event) => setSearchQuery(event.target.value)}
//           />
//         </s-box>
 
//         <s-box padding="small">
//           <s-text weight="bold">Filters</s-text>
 
//           <s-box padding="extraSmall">
//             <s-text-field
//               label="Gender"
//               placeholder="e.g., Male, Female, Other"
//               value={genderFilter}
//               onInput={(event) => setGenderFilter(event.target.value)}
//             />
//           </s-box>
 
//           <s-box padding="extraSmall">
//             <s-text-field
//               label="Nationality"
//               placeholder="e.g., Indian, American"
//               value={nationalityFilter}
//               onInput={(event) => setNationalityFilter(event.target.value)}
//             />
//           </s-box>
 
//           <s-box padding="extraSmall">
//             <s-text-field
//               label="Date of Birth"
//               placeholder="YYYY-MM-DD"
//               value={dobFilter}
//               onInput={(event) => setDobFilter(event.target.value)}
//             />
//           </s-box>
//         </s-box>
//         <s-text>name: {searchQuery}</s-text>
//         <s-text>Gender: {genderFilter}</s-text>
//         <s-text>Nationality: {nationalityFilter}</s-text>
//         <s-text>DOB: {dobFilter}</s-text> 
 
//         <s-box padding="small">
//           <s-inline-stack gap="small">
//             <s-button
//               onClick={searchCustomers}
//               disabled={isSearching}
//             >
//               {isSearching ? 'Searching…' : 'Search Customers'}
//             </s-button>
//             <s-button
//               onClick={clearFilters}
//               appearance="secondary"
//             >
//               Clear Filters
//             </s-button>
//           </s-inline-stack>
//         </s-box>
 
//         {/* Search Results */}
//         <s-box padding="small">
//           {customers.length === 0 && !isSearching && (
//             <s-text appearance="subdued">No customers found</s-text>
//           )}
 
//           {customers.map(({ node }) => (
//             <s-box
//               key={node.id}
//               padding="small"
//               border
//               borderRadius="medium"
//             >
//               <s-stack gap="extraSmall">
//                 <s-text weight="bold">
//                   {node.firstName} {node.lastName}
//                 </s-text>
 
//                 <s-text appearance="subdued" size="small">
//                   {node.email}
//                 </s-text>
 
//                 {node.phone && (
//                   <s-text appearance="subdued" size="small">
//                     📞 {node.phone}
//                   </s-text>
//                 )}
 
//                 {/* Display Metafields */}
//                 {(node.gender?.value || node.nationality?.value || node.dob?.value) && (
//                   <s-box padding="extraSmall">
//                     {node.gender?.value && (
//                       <s-text size="small">
//                         Gender: {node.gender.value}
//                       </s-text>
//                     )}
//                     {node.nationality?.value && (
//                       <s-text size="small">
//                         Nationality: {node.nationality.value}
//                       </s-text>
//                     )}
//                     {node.dob?.value && (
//                       <s-text size="small">
//                         DOB: {node.dob.value}
//                       </s-text>
//                     )}
//                   </s-box>
//                 )}
//               </s-stack>
//             </s-box>
//           ))}
//         </s-box>
//         <s-text>
//           final query: {query}
//         </s-text>
//       </s-scroll-box>
//     </s-page>
//   );
// }
 


import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useState, useEffect } from "preact/hooks";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [loading, setLoading] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);

const staff =shopify.staffMember?.firstName;
  if (!staff) {
    return (
      <s-page heading="Staff Clock">
        <s-text>Loading staff...</s-text>
      </s-page>
    );
  }

  const handleClockAction = async () => {
    if (!shop) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://staff-management-backend-xaw2.onrender.com/api/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            shop,
            staffId: staff.id,
            staffName:
              staff.firstName + " " + staff.lastName,
            locationId: shopify?.pos?.location?.id,
            action: clockedIn ? "clock_out" : "clock_in"
          })
        }
      );

      const result = await response.json();

      if (result.status === "clocked_in")
        setClockedIn(true);

      if (result.status === "clocked_out")
        setClockedIn(false);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <s-page heading="Staff dClock">
      <s-text>
        {staff.firstName} {staff.lastName}
      </s-text>

      <s-button
        onClick={handleClockAction}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : clockedIn
          ? "Clock Out"
          : "Clock In"}
      </s-button>
    </s-page>
  );
}
 