import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req: Request, res:Response):Promise<void> => {
    try {
        res.setHeader("Content-Type", "application/json");
        const popularProducts = await prisma.products.findMany({
            take: 15,
            orderBy: {
                stockQuantity: "desc"
            }
        });
        const salesSummary = await prisma.salesSummary.findMany({
            take: 15,
            orderBy: {
                date: "desc"
            }
        });
        const purchaseSummary = await prisma.purchaseSummary.findMany({
            take: 15,
            orderBy: {
                date: "desc"
            }
        });
        const expenseSummary = await prisma.expenseSummary.findMany({
            take: 15,
            orderBy: {
                date: "desc"
            }
        });
        const expenseByCategoryRaw = await prisma.expenseByCategory.findMany({
            take: 15,
            orderBy: {
                date: "desc"
            }
        });
        const expenseByCategorySummary = expenseByCategoryRaw.map((item: Prisma.ExpenseByCategoryGetPayload<{}>) => (
            {
                ...item,
                amount: String(item.amount)
            }));
        res.status(200).json({
            popularProducts, salesSummary, purchaseSummary, expenseSummary, expenseByCategorySummary
        });
    } catch (error) {
        res.status(500).json({message: "Error retrieving dashboard metrics."});
    }
} 
