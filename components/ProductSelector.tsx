"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Addon, OrderItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSelectorProps {
  onAddToCart: (
    item: Omit<OrderItem, "productId"> & { productId: string }
  ) => void;
}

export default function ProductSelector({ onAddToCart }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchAddons();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsQuery = query(
        collection(db, "products"),
        where("available", "==", true)
      );
      const snapshot = await getDocs(productsQuery);
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAddons = async () => {
    try {
      const addonsQuery = query(
        collection(db, "addons"),
        where("available", "==", true)
      );
      const snapshot = await getDocs(addonsQuery);
      const addonsData: Addon[] = [];
      snapshot.forEach((doc) => {
        addonsData.push({ id: doc.id, ...doc.data() } as Addon);
      });
      setAddons(addonsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching addons:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const item = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantity,
      unitPrice: selectedProduct.basePrice,
      addons: selectedAddons.map((addon) => ({
        name: addon.name,
        price: addon.price,
      })),
    };

    onAddToCart(item);

    // Reset selection
    setSelectedProduct(null);
    setSelectedAddons([]);
    setQuantity(1);
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const calculateItemTotal = () => {
    if (!selectedProduct) return 0;
    const addonTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    return (selectedProduct.basePrice + addonTotal) * quantity;
  };

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Product</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-5 w-20 mt-2" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <span className="font-bold text-foreground">
                      ₱{product.basePrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add-ons Selection */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Add-ons (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddons.find((a) => a.id === addon.id)
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => toggleAddon(addon)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-foreground">
                        {addon.name}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {addon.type}
                      </Badge>
                    </div>
                    <span className="font-bold text-foreground">
                      +₱{addon.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quantity and Add to Cart */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Quantity & Add to Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-foreground">Total:</span>
                  <span className="text-xl font-bold text-foreground">
                    ₱{calculateItemTotal()}
                  </span>
                </div>

                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
