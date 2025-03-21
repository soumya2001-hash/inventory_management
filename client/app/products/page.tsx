"use client"
import { useCreateProductsMutation, useGetProductsQuery } from "@/State/api";
import { PlusCircle, SearchIcon } from "lucide-react";
import { useState } from "react"
import Header from "../(components)/Header";
import Rating from "../(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";

type ProductFormData = {
    name: string;
    price: number; 
    stockQuantity: number;
    rating: number;
};


const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModelOpen, setIsModalOpen] = useState(false);

    const {data:products, isLoading, isError} = useGetProductsQuery(searchTerm);

    const [createProduct] = useCreateProductsMutation();
    const handleCreateProduct = async (productData: ProductFormData) => {
        await createProduct(productData);
    }

    if (isLoading) {
        return (
            <div className="py-4">Loading...</div>
        )
    }
    if(isError || !products) {
        return (
            <div className="text-red-500 text-center py-4">Failed to fetch products</div>
        )
    } 
  return (
    <div className="mx-auto pb-5 w-full">
        {/* Search bar */}
        <div className="mb-6">
            <div className="flex items-center border-2 border-gray-200 rounded">
                <SearchIcon className="w-5 h-5 text-gray-500 m-2"/>
                <input className="w-full py-2 px-4 rounded bg-white" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>

        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6">
            <Header name="Products"/>
            <button
                className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
            >
                <PlusCircle className="w-5 h-5 mr-2 text-gray-200"/>
                Create Product
            </button>
        </div>
        {/* Body Products List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
            {isLoading ? (
                <div className="py-4">Loading...</div>
            ) : (
                products?.map((product) => (
                    <div key={product.productId} 
                    className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                    >
                        <div className="flex flex-col items-center">
                            <Image
                                src={`/assets/product${Math.floor(Math.random() * 3) + 1}.png`}
                                alt={product.name}
                                width={150}
                                height={150}
                                className='mb-3 rounded-2xl w-36 h-36'
                            />
                            <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                            <p className="text-gray-900">${product.price.toFixed(2)}</p>
                            <div className="text-sm text-gray-600 mt-1">Stock: {product.stockQuantity}</div>
                            {product.rating && (
                                <div className="flex items-center mt-2">
                                    <Rating rating={product.rating}/>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Modal */}
        <CreateProductModal 
        isOpen={isModelOpen}
        onClose={()=> setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        />
    </div>
  )
}

export default Products