// import { NextResponse } from "next/server"

// export async function GET() {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 400))

//   // In a real app, this would be calculated from the database
//   const stats = {
//     totalLeads: 49,
//     activeOpportunities: 20,
//     totalDealValue: "21.2",
//     conversionRate: "45%",
//     avgDealSize: "2.5",
//     avgDealClosure: "3 days",
//     TopSector: "Manufacturing",
//   }

//   const weeklyLeadsData = [
//     { name: "Week 1", leads: 8 },
//     { name: "Week 2", leads: 12 },
//     { name: "Week 3", leads: 10 },
//     { name: "Week 4", leads: 15 },
//     { name: "Week 5", leads: 9 },
//   ]

//   // Top 3 most active leads (by activity count)
//   const topActiveLeads = [
//     { name: "Reliance Industries", activities: 24, sector: "Energy" },
//     { name: "Tata Steel", activities: 18, sector: "Manufacturing" },
//     { name: "Adani Logistics", activities: 15, sector: "Logistics" },
//   ]

//   // Top 3 leads with highest probability
//   const topProbabilityLeads = [
//     { name: "Mahindra Automotive", probability: 85, dealValue: 3.2, stage: "Legal" },
//     { name: "Larsen & Toubro", probability: 78, dealValue: 2.4, stage: "Commercial" },
//     { name: "Bharat Petroleum", probability: 72, dealValue: 3.9, stage: "Proposal" },
//   ]

//   return NextResponse.json({
//     stats,
//     weeklyLeads: weeklyLeadsData,
//     topActiveLeads,
//     topProbabilityLeads,
//   })
// }
// app/api/dashboard/route.js
import { getConnection, initializeDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connection = await getConnection();
    // Execute all queries in parallel for better performance
    const [
      totalLeadsResult,
      activeOppsResult,
      totalDealResult,
      wonDealsResult,
      topSectorResult,
      weeklyLeadsResult,
      topActiveLeadsResult,
      topProbabilityLeadsResult
    ] = await Promise.all([
      // Total leads
      connection.execute('SELECT COUNT(*) as total FROM leads'),
      
      // Active opportunities (not won/lost)
      connection.execute("SELECT COUNT(*) as total FROM leads WHERE stage NOT IN ('won', 'lost')"),
      
      // Total deal value
      connection.execute('SELECT SUM(deal_value) as total FROM leads'),
      
      // Won deals for conversion rate
      connection.execute("SELECT COUNT(*) as total FROM leads WHERE stage = 'won'"),
      
      // Top sector
      connection.execute(`
        SELECT sector, COUNT(*) as count 
        FROM leads 
        WHERE sector IS NOT NULL 
        GROUP BY sector 
        ORDER BY count DESC 
        LIMIT 1
      `),
      
      // Weekly leads data (last 5 weeks)
      connection.execute(`
        SELECT 
          WEEK(date_added) as week_num,
          YEAR(date_added) as year,
          COUNT(*) as leads
        FROM leads 
        WHERE date_added >= DATE_SUB(NOW(), INTERVAL 5 WEEK)
        GROUP BY YEAR(date_added), WEEK(date_added)
        ORDER BY year, week_num
      `),
      
      // Top active leads by activity count
      connection.execute(`
        SELECT 
          l.customer_name as name,
          l.sector,
          COUNT(a.id) as activities
        FROM leads l
        LEFT JOIN activities a ON l.id = a.lead_id
        GROUP BY l.id, l.customer_name, l.sector
        ORDER BY activities DESC
        LIMIT 3
      `),
      
      // Top probability leads
      connection.execute(`
        SELECT 
          customer_name as name,
          CAST(REPLACE(probability, '%', '') AS UNSIGNED) as probability_num,
          probability,
          deal_value,
          stage
        FROM leads
        WHERE probability IS NOT NULL AND probability != ''
        ORDER BY probability_num DESC
        LIMIT 3
      `)
    ]);

    // Process stats data
    const totalLeads = (totalLeadsResult as any)[0][0].total;
    const activeOpportunities = (activeOppsResult as any)[0][0].total;
    const totalDealValue = (totalDealResult as any[])[0][0].total || '0';
    const wonDeals = (wonDealsResult as any[])[0][0].total;
    console.log(wonDealsResult);

    
    // Calculate metrics
    const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;
    const avgDealSize = totalLeads > 0 ? (totalDealValue / totalLeads).toFixed(1) : '0';
    console.log(topSectorResult)
    const topSector = (topSectorResult[0] as any).length > 0 ? (topSectorResult as any[])[0][0].sector : 'N/A';

    // Process weekly leads data
    const weeklyLeadsData = (weeklyLeadsResult[0] as any).map((row: any, index: any) => ({
      name: `Week ${index + 1}`,
      leads: row.leads
    }));

    // Fill with zeros if we don't have 5 weeks of data
    while (weeklyLeadsData.length < 5) {
      weeklyLeadsData.unshift({
        name: `Week ${weeklyLeadsData.length + 1}`,
        leads: 0
      });
    }

    // Process top active leads
    const topActiveLeads = (topActiveLeadsResult[0] as any).map((row:any) => ({
      name: row.name,
      activities: row.activities,
      sector: row.sector || 'N/A'
    }));

    // Process top probability leads
    const topProbabilityLeads = (topProbabilityLeadsResult[0] as any).map((row: any) => ({
      name: row.name,
      probability: row.probability_num,
      dealValue: parseFloat(row.deal_value),
      stage: row.stage
    }));

    // Combined dashboard response
    const dashboardData = {
      stats: {
        totalLeads,
        activeOpportunities,
        totalDealValue: totalDealValue,
        conversionRate: `${conversionRate}%`,
        avgDealSize,
        avgDealClosure: "3 days", // Mock value - implement actual calculation if needed
        topSector
      },
      weeklyLeadsData,
      topActiveLeads,
      topProbabilityLeads
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}