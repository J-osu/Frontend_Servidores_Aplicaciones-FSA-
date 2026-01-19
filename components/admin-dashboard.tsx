"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, FolderTree, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from "@/components/product-list"
import { CategoryList } from "@/components/category-list"

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: string
  stock: number
  imageUrl?: string | null
  updatedAt?: string
  // El backend devuelve el objeto completo si hay relación
  category?: Category
  categoryId?: string
}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { fetchProducts, fetchCategories, createProduct, createCategory, deleteProduct, deleteCategory } from "@/lib/api"
  // ... imports

  // ... components ...

  export function AdminDashboard() {
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    
    // ... states ...
    
    const [newProduct, setNewProduct] = useState({ 
      name: "", 
      description: "", 
      price: "", 
      stock: "", 
      imageUrl: "", 
      categoryId: "" 
    })
    const [newCategory, setNewCategory] = useState("")
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
        // Opcional: Mostrar error al usuario
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      setIsMounted(true)
      loadData()
    }, [])

    if (!isMounted) {
      return null
    }

    const handleAddProduct = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newProduct.name || !newProduct.price || !newProduct.categoryId) return

      try {
        const productData = {
          name: newProduct.name,
          description: newProduct.description,
          price: Number(newProduct.price), // Enviar como número
          stock: Number(newProduct.stock),
          imageUrl: newProduct.imageUrl || null,
          category: newProduct.categoryId // Cambiado de categoryId a category
        }
        await createProduct(productData)
        await loadData() // Recargar datos
        setNewProduct({ name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" })
      } catch (error) {
        console.error("Error creating product:", error)
        alert("Error al crear producto")
      }
    }

    const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newCategory.trim()) return

      try {
        await createCategory({ name: newCategory.trim() })
        await loadData()
        setNewCategory("")
      } catch (error) {
        console.error("Error creating category:", error)
        alert("Error al crear categoría")
      }
    }

    const handleDeleteProduct = async (id: string, name?: string) => { // name es opcional en la API pero la interfaz actual lo ignora
       if(!confirm("¿Seguro que quieres borrar este producto?")) return;
       try {
         await deleteProduct(id)
         await loadData()
       } catch (error) {
         console.error("Error deleting product:", error)
         alert("Error al borrar producto")
       }
    }

    const handleDeleteCategory = async (id: string, name?: string) => {
       if(!confirm("¿Seguro que quieres borrar esta categoría?")) return;
       try {
         await deleteCategory(id)
         await loadData()
       } catch (error) {
         console.error("Error deleting category:", error)
         alert("Error al borrar categoría")
       }
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Panel de Administración de Productos & Categorias</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus productos y categorías</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
                <Package className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{products.length}</div>
                <p className="text-xs text-muted-foreground mt-1">productos registrados</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Categorías</CardTitle>
                <FolderTree className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{categories.length}</div>
                <p className="text-xs text-muted-foreground mt-1">categorías activas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Products and Categories */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Añadir Nuevo Producto</CardTitle>
                  <CardDescription>Completa los campos para registrar un producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="product-name">Nombre</Label>
                      <Input
                        id="product-name"
                        placeholder="Nombre del producto"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>

                    
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="product-description">Descripción</Label>
                      <Input
                        id="product-description"
                        placeholder="Descripción del producto"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                    <div className="w-full sm:w-32 space-y-2">
                       <Label htmlFor="product-stock">Stock</Label>
                       <Input
                         id="product-stock"
                         type="number"
                         min="0"
                         placeholder="0"
                         value={newProduct.stock}
                         onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                       />
                    </div>
                    <div className="w-full sm:w-48 space-y-2">
                       <Label htmlFor="product-image">Imagen URL</Label>
                       <Input
                         id="product-image"
                         placeholder="https://..."
                         value={newProduct.imageUrl}
                         onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                       />
                    </div>

                    <div className="w-full sm:w-32 space-y-2">
                      <Label htmlFor="product-price">Precio</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </div>
                    <div className="w-full sm:w-48 space-y-2">
                      <Label htmlFor="product-category">Categoría</Label>
                      <Select
                        value={newProduct.categoryId}
                        onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                      >
                        <SelectTrigger id="product-category">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                            (ID: {category.id}) {category.name} 
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Guardando...' : 'Añadir'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <ProductList products={products} categories={categories} onDelete={handleDeleteProduct} />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Añadir Nueva Categoría</CardTitle>
                  <CardDescription>Crea una categoría para organizar tus productos</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategory} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="category-name">Nombre de la categoría</Label>
                      <Input
                        id="category-name"
                        placeholder="Ej: Tecnología, Hogar, Deportes..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Guardando...' : 'Añadir'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <CategoryList categories={categories} products={products} onDelete={handleDeleteCategory} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }
