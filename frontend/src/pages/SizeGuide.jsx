export default function SizeGuide() {
  const tables = [
    {
      title: 'Men\'s Tops & Compression',
      headers: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)', 'Height (cm)'],
      rows: [
        ['XS', '84–88', '70–74', '90–94', '165–170'],
        ['S',  '88–92', '74–78', '94–98', '170–175'],
        ['M',  '92–96', '78–82', '98–102', '175–180'],
        ['L',  '96–100', '82–86', '102–106', '180–185'],
        ['XL', '100–104', '86–90', '106–110', '185–190'],
        ['XXL','104–110', '90–96', '110–116', '190–195'],
      ]
    },
    {
      title: 'Women\'s Leggings & Bottoms',
      headers: ['Size', 'Waist (cm)', 'Hip (cm)', 'Inseam (cm)', 'Height (cm)'],
      rows: [
        ['XS', '60–64', '86–90', '72', '155–162'],
        ['S',  '64–68', '90–94', '74', '162–167'],
        ['M',  '68–72', '94–98', '76', '167–172'],
        ['L',  '72–76', '98–102', '78', '172–177'],
        ['XL', '76–82', '102–108', '80', '177–182'],
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Sizing</span>
        <h1 className="font-display text-6xl tracking-widest mt-2 mb-4">SIZE GUIDE</h1>
        <p className="text-brand-gray-500 mb-10 text-sm">Measure yourself and compare to our charts below. For compression wear, if between sizes, size up.</p>

        {tables.map(table => (
          <div key={table.title} className="mb-10">
            <h2 className="font-display text-2xl tracking-widest mb-4">{table.title.toUpperCase()}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-brand-gray-200">
                <thead className="bg-brand-black text-white">
                  <tr>{table.headers.map(h => <th key={h} className="px-4 py-3 text-xs font-mono tracking-wider text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-gray-50'}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-bold' : 'text-brand-gray-600'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="bg-brand-accent p-6 mt-6">
          <h3 className="font-display text-2xl tracking-widest mb-2">HOW TO MEASURE</h3>
          <ul className="text-sm space-y-2 text-brand-gray-700">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around the narrowest part of your natural waist.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
            <li><strong>Inseam:</strong> Measure from the crotch to the floor along the inner leg.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
