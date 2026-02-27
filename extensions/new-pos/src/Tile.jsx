// import {render} from 'preact';

// export default async () => {
//   render(<Extension />, document.body);
// }

// function Extension() {
//   return (
//     <s-tile
//       heading="POS smart grid"
//       subheading="preact Extension"
//       onClick={() => shopify.action.presentModal()}
//     />
//   );
// }




// import {render} from 'preact';
// export default async () => {
//   render(<Extension />, document.body);
// }
// function Extension() {
//   return (
//       <s-tile
//       heading="Where am I?"
//       subheading="Find your Shopify store"
//       onClick={() => shopify.action.presentModal()}
//     />
//   );
// }



// import { extend, render, Tile, useExtensionApi } from '@shopify/retail-ui-extensions-react';

// extend('pos.home.tile.render', (root, api) => {
//   render(<TileExtension api={api} />, root);
// });

// function TileExtension({ api }) {
//   const tiles = [
//     {
//       title: 'Product Search',
//       subtitle: 'Search for products',
//       onPress: () => api.smartGrid.presentModal('product-search'),
//     },
//     {
//       title: 'Customer Search',
//       subtitle: 'Search customers with filters',
//       onPress: () => api.smartGrid.presentModal('customer-search'),
//     },
//   ];

//   return (
//     <>
//       {tiles.map((tile, index) => (
//         <Tile
//           key={index}
//           title={tile.title}
//           subtitle={tile.subtitle}
//           onPress={tile.onPress}
//           enabled
//         />
//       ))}
//     </>
//   );
// }


import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useState, useEffect } from "preact/hooks";

export default function () {
  render(<Extension />, document.body);
}

function Extension() {
  const [clock, setClock] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval;

    if (clock) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [clock]);

useEffect(() => {
  async function checkActiveShift() {
    const { currentSession } = shopify.session;
    const { staffMemberId, shopId } = currentSession;

    const response = await fetch(
      "https://your-cloudflare-url/checkShift",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffMemberId, shopId }),
      }
    );

    const data = await response.json();

    if (data.active) {
      setClock(true);
    } else {
      setClock(false);
    }
  }

  checkActiveShift();
}, []);

  const formatTime = () => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs}h ${mins}m ${secs}s`;
  };

  async function handleClockIn() {
    const { currentSession } = shopify.session;
    const { userId, staffMemberId, shopId, locationId } = currentSession;

    const response = await fetch(
      "https://chargers-arranged-glance-asks.trycloudflare.com/clockin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          staffMemberId,
          shopId,
          locationId,
          action: "clock_in",
        }),
      }
    );

    if (response.ok) {
      setSeconds(0);
      setClock(true);
      shopify.toast.show("Clock In saved");
    }
  }

  async function handleClockOut() {
    const { currentSession } = shopify.session;
    const { userId, staffMemberId, shopId, locationId } = currentSession;

    const response = await fetch(
      "https://chargers-arranged-glance-asks.trycloudflare.com/clockin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          staffMemberId,
          shopId,
          locationId,
          action: "clock_out",
        }),
      }
    );

    if (response.ok) {
      setClock(false);
      shopify.toast.show("Clock Out saved");
    }
  }

  return (
    <>
      <s-tile
        heading={clock ? "Clock Out" : "Clock In"}
        subheading={
          clock ? `Working: ${formatTime()}` : "Tap to Clock In"
        }
        onClick={clock ? handleClockOut : handleClockIn}
      />
    </>
  );
}