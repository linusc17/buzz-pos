"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, Addon, OrderItem, DrinkSize, UPSIZE_PRICE } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [selectedSize, setSelectedSize] = useState<DrinkSize>("regular");
  const [quantity, setQuantity] = useState(1);
  const [drinkNames, setDrinkNames] = useState<string[]>([""]);

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

    for (let i = 0; i < quantity; i++) {
      const item: Partial<OrderItem> = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: 1,
        unitPrice: selectedProduct.basePrice,
        size: selectedSize,
        addons: selectedAddons.map((addon) => ({
          name: addon.name,
          price: addon.price,
        })),
      };

      const drinkName = drinkNames[i]?.trim();
      if (drinkName) {
        item.drinkName = drinkName;
      }

      onAddToCart(item as OrderItem);
    }

    setSelectedProduct(null);
    setSelectedAddons([]);
    setSelectedSize("regular");
    setQuantity(1);
    setDrinkNames([""]);
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
    const sizePrice = selectedSize === "large" ? UPSIZE_PRICE : 0;
    return (selectedProduct.basePrice + sizePrice + addonTotal) * quantity;
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
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, categoryIndex) => (
                <div key={categoryIndex}>
                  <Skeleton className="h-6 w-32 mb-3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(
                products.reduce((acc, product) => {
                  const category = product.category;
                  if (!acc[category]) {
                    acc[category] = [];
                  }
                  acc[category].push(product);
                  return acc;
                }, {} as Record<string, typeof products>)
              ).map(([category, categoryProducts]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-foreground mb-3 capitalize">
                    {category.replace("-", " ")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedProduct?.id === product.id
                            ? "border-buzz-orange bg-buzz-cream/20 dark:bg-buzz-brown/20"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <span className="font-bold text-foreground ml-2">
                            ₱{product.basePrice}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant={selectedSize === "regular" ? "default" : "outline"}
                className={`flex-1 ${selectedSize === "regular" ? "" : ""}`}
                onClick={() => setSelectedSize("regular")}
              >
                Regular
              </Button>
              <Button
                variant={selectedSize === "large" ? "default" : "outline"}
                className={`flex-1 ${selectedSize === "large" ? "" : ""}`}
                onClick={() => setSelectedSize("large")}
              >
                Large (+₱{UPSIZE_PRICE})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Add-ons (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddons.find((a) => a.id === addon.id)
                      ? "border-buzz-gold bg-buzz-cream/20 dark:bg-buzz-brown/20"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => toggleAddon(addon)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {addon.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
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

      {selectedProduct && (
        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newQty = Math.max(1, quantity - 1);
                      setQuantity(newQty);
                      setDrinkNames((prev) => prev.slice(0, newQty));
                    }}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newQty = quantity + 1;
                      setQuantity(newQty);
                      setDrinkNames((prev) => [...prev, ""]);
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>

              {quantity > 0 && (
                <div className="space-y-4">
                  <span className="text-foreground font-medium">
                    Drink Names (Optional):
                  </span>
                  <div className="space-y-3 pt-1">
                    {Array.from({ length: quantity }, (_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Label className="text-sm w-16">
                          Drink {index + 1}:
                        </Label>
                        <Input
                          value={drinkNames[index] || ""}
                          onChange={(e) => {
                            const newNames = [...drinkNames];
                            newNames[index] = e.target.value;
                            setDrinkNames(newNames);
                          }}
                          placeholder="e.g., John, Mary"
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
