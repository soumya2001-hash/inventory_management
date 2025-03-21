import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpensesByCategory = async (req: Request, res:Response): Promise<void> =>{
    try {
        const expenseByCategoryRaw = await prisma.expenseByCategory.findMany({
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategoryRaw.map((item: Prisma.ExpenseByCategoryGetPayload<{ select: { amount: true; category: true } }>) => (
            {
                ...item,
                amount: String(item.amount)
            }
        ));
        res.status(200).json(expenseByCategorySummary);
    } catch (error) {
        res.status(500).json({message: "Error fetching expenses."})
    }
}