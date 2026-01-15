"use client"

import { useState, useEffect } from "react"
import { Package, FolderTree } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { CategoryList } from "@/components/category-list"
// Importamos las funciones de borrado de la API
import { fetchProducts, fetchCategories, deleteProduct, deleteCategory } from "@/lib/api"

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  price: number
  category?: Category
  categoryId?: string
}

export function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    loadData()
  }, [])

  // Función para eliminar productos
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return
    try {
      await deleteProduct(id)
      await loadData() // Recarga la lista tras borrar
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al borrar producto")
    }
  }

  // Función para eliminar categorías
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar esta categoría?")) return
    try {
      await deleteCategory(id)
      await loadData() // Recarga la lista tras borrar
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Error al borrar categoría")
    }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Gestión de Inventario</h1>
          <p className="text-sm text-muted-foreground">Visualiza y elimina productos o categorías</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{products.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Categorías</CardTitle>
              <FolderTree className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductList 
              products={products} 
              categories={categories} 
              onDelete={handleDeleteProduct} // Pasamos la función real
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryList 
              categories={categories} 
              products={products} 
              onDelete={handleDeleteCategory} // Pasamos la función real
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}