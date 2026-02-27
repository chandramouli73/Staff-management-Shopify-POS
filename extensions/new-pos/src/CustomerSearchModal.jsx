import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState('');

  // Customer search
  const [customers, setCustomers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [dobFilter, setDobFilter] = useState('');

  // Fetch store name on mount
  useEffect(() => {
    async function fetchStoreName() {
      try {
        const response = await fetch('shopify:admin/api/graphql.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                shop {
                  name
                }
              }
            `,
          }),
        });

        const data = await response.json();
        setStoreName(data.data.shop.name);
      } catch (error) {
        console.error('Failed to fetch store name:', error);
        setStoreName('Unknown');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStoreName();
  }, []);

  // Customer search function with metafield filters
  async function searchCustomers() {
    console.log('🔍 Searching customers with filters:', {
      searchQuery,
      genderFilter,
      nationalityFilter,
      dobFilter
    });

    setIsSearching(true);
    try {
      const response = await fetch('shopify:admin/api/graphql.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query ($query: String!) {
              customers(first: 50, query: $query) {
                edges {
                  node {
                    id
                    firstName
                    lastName
                    email
                    phone
                    gender: metafield(namespace: "custom", key: "gender") {
                      value
                    }
                    nationality: metafield(namespace: "custom", key: "nationality") {
                      value
                    }
                    dob: metafield(namespace: "custom", key: "dob") {
                      value
                    }
                  }
                }
              }
            }
          `,
          variables: {
            query: searchQuery || '*',
          },
        }),
      });

      const data = await response.json();
      console.log('📦 Raw GraphQL response:', data);

      // Filter results based on metafield values
      let filteredCustomers = data.data.customers.edges;

      if (genderFilter) {
        filteredCustomers = filteredCustomers.filter(({ node }) => 
          node.gender?.value?.toLowerCase() === genderFilter.toLowerCase()
        );
      }

      if (nationalityFilter) {
        filteredCustomers = filteredCustomers.filter(({ node }) => 
          node.nationality?.value?.toLowerCase().includes(nationalityFilter.toLowerCase())
        );
      }

      if (dobFilter) {
        filteredCustomers = filteredCustomers.filter(({ node }) => 
          node.dob?.value === dobFilter
        );
      }

      console.log('✅ Filtered customers:', filteredCustomers);
      setCustomers(filteredCustomers);
    } catch (error) {
      console.error('❌ Customer search failed:', error);
      setCustomers([]);
    } finally {
      setIsSearching(false);
    }
  }

  // Clear all filters
  function clearFilters() {
    setSearchQuery('');
    setGenderFilter('');
    setNationalityFilter('');
    setDobFilter('');
    setCustomers([]);
  }

  return (
    <s-page heading="Search Customers">
      <s-scroll-box>
        <s-box padding="small">
          <s-text>
            {isLoading ? 'Fetching store name...' : `You are in ${storeName}`}
          </s-text>
        </s-box>

        {/* Search Input */}
        <s-box padding="small">
          <s-text-field
            label="Search by name or email"
            placeholder="Enter customer name or email…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </s-box>

        {/* Filters */}
        <s-box padding="small">
          <s-text weight="bold">Filters</s-text>
          
          {/* Gender Filter */}
          <s-box padding="extraSmall">
            <s-text-field
              label="Gender"
              placeholder="e.g., Male, Female, Other"
              value={genderFilter}
              onChange={(event) => setGenderFilter(event.target.value)}
            />
          </s-box>

          {/* Nationality Filter */}
          <s-box padding="extraSmall">
            <s-text-field
              label="Nationality"
              placeholder="e.g., Indian, American"
              value={nationalityFilter}
              onChange={(event) => setNationalityFilter(event.target.value)}
            />
          </s-box>

          {/* DOB Filter */}
          <s-box padding="extraSmall">
            <s-text-field
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={dobFilter}
              onChange={(event) => setDobFilter(event.target.value)}
            />
          </s-box>
        </s-box>

        {/* Action Buttons */}
        <s-box padding="small">
          <s-inline-stack gap="small">
            <s-button
              onClick={searchCustomers}
              disabled={isSearching}
            >
              {isSearching ? 'Searching…' : 'Search Customers'}
            </s-button>
            <s-button
              onClick={clearFilters}
              appearance="secondary"
            >
              Clear Filters
            </s-button>
          </s-inline-stack>
        </s-box>

        {/* Search Results */}
        <s-box padding="small">
          {customers.length === 0 && !isSearching && (
            <s-text appearance="subdued">No customers found. Try adjusting your filters.</s-text>
          )}

          {customers.map(({ node }) => (
            <s-box
              key={node.id}
              padding="small"
              border
              borderRadius="medium"
            >
              <s-stack gap="extraSmall">
                <s-text weight="bold">
                  {node.firstName} {node.lastName}
                </s-text>
                
                <s-text appearance="subdued" size="small">
                  📧 {node.email}
                </s-text>
                
                {node.phone && (
                  <s-text appearance="subdued" size="small">
                    📞 {node.phone}
                  </s-text>
                )}

                {/* Display Metafields */}
                {(node.gender?.value || node.nationality?.value || node.dob?.value) && (
                  <s-box padding="extraSmall" border borderRadius="small">
                    {node.gender?.value && (
                      <s-text size="small">
                        👤 Gender: {node.gender.value}
                      </s-text>
                    )}
                    {node.nationality?.value && (
                      <s-text size="small">
                        🌍 Nationality: {node.nationality.value}
                      </s-text>
                    )}
                    {node.dob?.value && (
                      <s-text size="small">
                        🎂 DOB: {node.dob.value}
                      </s-text>
                    )}
                  </s-box>
                )}
              </s-stack>
            </s-box>
          ))}
        </s-box>
      </s-scroll-box>
    </s-page>
  );
}
