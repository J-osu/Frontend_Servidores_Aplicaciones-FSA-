"use client"

import { Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Product, Category } from "@/components/admin-dashboard"

interface CategoryListProps {
  categories: Category[]
  products: Product[]
  onDelete: (id: string) => void
}

export function CategoryList({ categories, products, onDelete }: CategoryListProps) {
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Lista de Categorías</CardTitle>
        <CardDescription>{categories.length} categorías activas</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay categorías registradas. Añade una para comenzar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center">Productos</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{getProductCount(category.id)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar categoría</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
