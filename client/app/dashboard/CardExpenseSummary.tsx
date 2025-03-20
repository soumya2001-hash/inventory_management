import { ExpenseByCategorySummary, useGetDashboardMetricsQuery } from '@/State/api';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type ExpenseSums = {
    [category: string] : number;
}

const colors = ['#00c49f', '#0088fe', 'ffbb28']

const CardExpenseSummary = () => {

    const [chartSize, setChartSize] = useState({chartHeight: 140, innerRadius:50, outerRadius:60});
    
        useEffect(() => {
            const updateSize = () => {
                if(window.innerWidth >= 1280){
                    setChartSize({chartHeight:100, innerRadius:40, outerRadius:50})
                }else{
                    setChartSize({chartHeight:140, innerRadius:50, outerRadius:60})
                }
                
            };
            
            window.addEventListener("resize", updateSize);
            updateSize(); // Set initial height
    
            return () => window.removeEventListener("resize", updateSize);
        }, []);
    

     const {data:dashbordMetrics, isLoading} = useGetDashboardMetricsQuery();
     const expenseSummary = dashbordMetrics?.expenseSummary[0];
     const expenseByCategorySummary = dashbordMetrics?.expenseByCategorySummary || [];
     const expenseSums = expenseByCategorySummary.reduce((acc:ExpenseSums, item: ExpenseByCategorySummary) => {
        const category = item.category + " Expenses";
        const amount = parseInt(item.amount, 10);
        if (!acc[category]) acc[category] = 0;
        acc[category] += amount;
        return acc;
     }, {});

    const expenseCategories = Object.entries(expenseSums).map(([name, value]) => ({
        name,
        value
    }));

    const totalExpenses = expenseCategories.reduce((acc, category:{value: number}) => acc + category.value, 0);
    const formattedTotalExpenses = totalExpenses.toFixed(2);
     
    return (
    <div className='row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between'>
        {isLoading ? (
            <div className='m-5'>Loading...</div>
        ) : (
            <>
                {/* Header */}
                <div>
                    <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                        Expense Summary
                    </h2>
                    <hr />
                </div>
                {/* Body */}
                <div className='xl:flex justify-between pr-7'>
                    {/* Chart */}
                    <div className='relative basis-3/5'>
                        <ResponsiveContainer width="100%" height={chartSize.chartHeight}>
                            <PieChart>
                                <Pie data={expenseCategories} innerRadius={chartSize.innerRadius} outerRadius={chartSize.outerRadius} fill='#8884d8' dataKey="value" nameKey="name" cx="50%" cy="50%">
                                    {expenseCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer> 
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5'>
                            <span className='font-bold text-xl'>${formattedTotalExpenses}</span>
                        </div>
                    </div>
                    {/* Labels */}
                    <ul className='flex flex-col justify-around items-center py-5 gap-3'>
                        {expenseCategories.map((entry, index) => (
                            <li key={`legend-${index}`} className='flex items-center text-xs'>
                                <span className='mr-2 w-3 h-3 rounded-full' style={{backgroundColor: colors[index % colors.length]}}></span>
                                {entry.name}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Footer */}
                <div>
                    <hr />
                    {expenseSummary && (
                        <div className='mt-3 flex justify-between items-center px-7 mb-4'>
                            <div className='pt-2'>
                                <p className='text-xs'>Average: {" "} <span className='font-semibold'>${expenseSummary.totalExpenses.toFixed(2)}</span></p>
                            </div>
                            <span className='flex items-center mt-2'><TrendingUp className='mr-2 text-green-500'/>30%</span>
                        </div>
                    )}
                </div>
            </>
        )}
    </div>
  )
}

export default CardExpenseSummary


