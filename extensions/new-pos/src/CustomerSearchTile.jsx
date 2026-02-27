import { render } from 'preact';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  return (
    <s-tile
      heading="Search Customers"
      subheading="Find customers with filters"
      onClick={() => shopify.action.presentModal()}
    />
  );
}