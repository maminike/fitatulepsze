import { ProductCatalog } from "@/components/product-catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProduktyPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Produkty</h1>
        <p className="text-sm text-muted-foreground">
          Mockowa baza produktow i filtrowanie lokalnie po nazwie/kategorii.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Katalog produktow</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCatalog />
        </CardContent>
      </Card>
    </section>
  );
}
