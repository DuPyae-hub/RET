import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const clients = [
      // Contract Clients (Registered Vendors)
      // Telecom
      { name: 'Atom Myanmar', category: 'Contract Client', logoUrl: '/images/logos/atom-myanmar.png' },
      { name: 'MPT', category: 'Contract Client', logoUrl: '/images/logos/mpt.png' },
      { name: 'Ooredoo Myanmar', category: 'Contract Client', logoUrl: '/images/logos/ooredoo-myanmar.png' },
      
      // FMCG & Beverages
      { name: 'Nestle Myanmar', category: 'Contract Client', logoUrl: '/images/logos/nestle-myanmar.png' },
      { name: 'Heineken Myanmar', category: 'Contract Client', logoUrl: '/images/logos/heineken-myanmar.png' },
      { name: 'Coca-Cola', category: 'Contract Client', logoUrl: '/images/logos/coca-cola.png' },
      { name: 'Osotspa Myanmar (M-150)', category: 'Contract Client', logoUrl: '/images/logos/osotspa-myanmar.png' },
      { name: 'Carlsberg Myanmar', category: 'Contract Client', logoUrl: '/images/logos/carlsberg-myanmar.png' },
      { name: 'Dutch Mill', category: 'Contract Client', logoUrl: '/images/logos/dutch-mill.png' },
      { name: 'CP Myanmar', category: 'Contract Client', logoUrl: '/images/logos/cp-myanmar.png' },
      { name: 'Indomie', category: 'Contract Client', logoUrl: '/images/logos/indomie.png' },
      
      // Finance & Fintech
      { name: 'Wave Money', category: 'Contract Client', logoUrl: '/images/logos/wave-money.png' },
      { name: 'Yoma Bank', category: 'Contract Client', logoUrl: '/images/logos/yoma-bank.png' },
      { name: 'True Money', category: 'Contract Client', logoUrl: '/images/logos/true-money.png' },
      { name: 'CB Bank', category: 'Contract Client', logoUrl: '/images/logos/cb-bank.png' },
      { name: 'Trusty Pay', category: 'Contract Client', logoUrl: '/images/logos/trusty-pay.png' },
      
      // Logistics & Retail
      { name: 'Food Panda', category: 'Contract Client', logoUrl: '/images/logos/food-panda.png' },
      { name: 'Karzo Logistics', category: 'Contract Client', logoUrl: '/images/logos/karzo-logistics.png' },
      { name: 'ABC Logistics', category: 'Contract Client', logoUrl: '/images/logos/abc-logistics.png' },
      { name: 'ABC Convenience Store', category: 'Contract Client', logoUrl: '/images/logos/abc-convenience.png' },
      { name: 'DKSH', category: 'Contract Client', logoUrl: '/images/logos/dksh.png' },
      { name: 'FMI Decaux', category: 'Contract Client', logoUrl: '/images/logos/fmi-decaux.png' },
      { name: 'Yangon Bus Media (YBM)', category: 'Contract Client', logoUrl: '/images/logos/ybm.png' },
      
      // Insurance & Others
      { name: 'AIA', category: 'Contract Client', logoUrl: '/images/logos/aia.png' },
      { name: 'Prudential', category: 'Contract Client', logoUrl: '/images/logos/prudential.png' },
      { name: 'Sun Pharma', category: 'Contract Client', logoUrl: '/images/logos/sun-pharma.png' },
      { name: '81 The Best Quality', category: 'Contract Client', logoUrl: '/images/logos/81-best-quality.png' },
      
      // Campaign & Sector-Specific Clients
      // Automotive
      { name: 'Nissan', category: 'Campaign Client', logoUrl: '/images/logos/nissan.png' },
      { name: 'Mitsubishi Motors', category: 'Campaign Client', logoUrl: '/images/logos/mitsubishi.png' },
      { name: 'Hyundai', category: 'Campaign Client', logoUrl: '/images/logos/hyundai.png' },
      { name: 'Mercedes-Benz', category: 'Campaign Client', logoUrl: '/images/logos/mercedes-benz.png' },
      
      // Industrial
      { name: 'Jotun (Paint)', category: 'Campaign Client', logoUrl: '/images/logos/jotun.png' },
      { name: 'Double Rhinos Cement', category: 'Campaign Client', logoUrl: '/images/logos/double-rhinos.png' },
      { name: 'KSH (Industrial/Tools)', category: 'Campaign Client', logoUrl: '/images/logos/ksh.png' },
      
      // Beverages/Food
      { name: 'Premier Coffee', category: 'Campaign Client', logoUrl: '/images/logos/premier-coffee.png' },
      { name: 'Calsome (Nutritious Drink)', category: 'Campaign Client', logoUrl: '/images/logos/calsome.png' },
      { name: 'VeVe', category: 'Campaign Client', logoUrl: '/images/logos/veve.png' },
      { name: 'Myanmar Beer (MBL)', category: 'Campaign Client', logoUrl: '/images/logos/myanmar-beer.png' },
      
      // Others
      { name: 'Moe Yan Lottery', category: 'Campaign Client', logoUrl: '/images/logos/moe-yan-lottery.png' },
      { name: 'FAME', category: 'Campaign Client', logoUrl: '/images/logos/fame.png' },
      
      // Other Client Companies
      // Global/Large Corporates
      { name: 'Unilever', category: 'Other Client', logoUrl: '/images/logos/unilever.png' },
      { name: 'JTI (Japan Tobacco International)', category: 'Other Client', logoUrl: '/images/logos/jti.png' },
      { name: 'Suletech Solutions', category: 'Other Client', logoUrl: '/images/logos/suletech.png' },
      
      // Domestic Groups
      { name: 'Shwe Taung Group', category: 'Other Client', logoUrl: '/images/logos/shwe-taung.png' },
      { name: 'MIB Group', category: 'Other Client', logoUrl: '/images/logos/mib-group.png' },
      { name: 'Pahtama Group', category: 'Other Client', logoUrl: '/images/logos/pahtama-group.png' },
      { name: 'MDG', category: 'Other Client', logoUrl: '/images/logos/mdg.png' },
      
      // Specialized Sectors
      { name: 'Pro-1 Global Home Center', category: 'Other Client', logoUrl: '/images/logos/pro-1.png' },
      { name: 'Myanma Awba', category: 'Other Client', logoUrl: '/images/logos/myanma-awba.png' },
      { name: 'Pacific Group', category: 'Other Client', logoUrl: '/images/logos/pacific-group.png' },
      { name: 'Yukioh Myanmar', category: 'Other Client', logoUrl: '/images/logos/yukioh-myanmar.png' },
      { name: 'Mahar Ya Da Nar', category: 'Other Client', logoUrl: '/images/logos/mahar-ya-da-nar.png' },
      { name: 'GWE', category: 'Other Client', logoUrl: '/images/logos/gwe.png' },
    ]

    let insertedCount = 0
    let skippedCount = 0

    for (const client of clients) {
      try {
        // Check if client already exists
        const existing = await query(
          'SELECT id FROM Client WHERE name = :name LIMIT 1',
          { name: client.name }
        )

        if (existing.length === 0) {
          const id = randomUUID()
          await query(
            `INSERT INTO Client (id, name, logoUrl, category, subsidiary, createdAt, updatedAt)
             VALUES (:id, :name, :logoUrl, :category, NULL, NOW(3), NOW(3))`,
            {
              id,
              name: client.name,
              logoUrl: client.logoUrl,
              category: client.category,
            }
          )
          insertedCount++
        } else {
          skippedCount++
        }
      } catch (error) {
        console.error(`Error inserting client ${client.name}:`, error)
      }
    }

    return NextResponse.json({
      message: `Client seeding complete. Inserted: ${insertedCount}, Skipped: ${skippedCount} (already exist)`,
      inserted: insertedCount,
      skipped: skippedCount,
    })
  } catch (error) {
    console.error('Error seeding clients:', error)
    const message =
      process.env.NODE_ENV !== 'production' && error instanceof Error
        ? error.message
        : 'Failed to seed clients'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
