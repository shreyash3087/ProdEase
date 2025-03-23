export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const upc = searchParams.get("upc");

  if (!upc) {
      return new Response(JSON.stringify({ error: "UPC code is required" }), { status: 400 });
  }

  try {
      const response = await fetch(`https://api.barcodelookup.com/v3/products?barcode=${upc}&formatted=y&key=${process.env.lookupKey}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          if (response.status === 404) {
              return new Response(JSON.stringify({ message: "Product not found - fill remaining fields manually" }), { status: 200 });
          }
          throw new Error("Failed to fetch product data");
      }

      const data = await response.json();
      if (!data || !data.products || data.products.length === 0) {
          return new Response(JSON.stringify({ message: "Product not found - fill remaining fields manually" }), { status: 200 });
      }

      return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
