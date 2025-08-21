import { RevalidateButton } from "./_components/RevalidateButton";

export const revalidate = 0; // this is the default value for revalidate, it means that the page will not be revalidated

async function getProducts() {
    const res = await fetch("https://dummyjson.com/products?limit=8", { // fetching data from the api
        next: {
            revalidate: 60, tags: ["catalog"] // Revalidate every 60 seconds
        }
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

interface Product {
    id: number;
    title: string;
    price: number;
}

export default async function CatalogPage() {
    const data = await getProducts();
    return (
        <div>
            <h1>Catalog</h1>
            <RevalidateButton />
            <ul>
                {data.products.map((product: Product) => (
                    <li key={product.id}>{product.title} - {product.price}</li>
                ))}
            </ul>
        </div>
    )
}   