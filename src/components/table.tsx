
function GenerateColumn({column}: {column: number})
{
  const arr = new Array(column).fill(1, 0, 10);

  return (<div>
    {arr.map((d: number, ind: number) => {
        return <GenerateRow ind={ind} row={17} key={`table_${ind}`}/>
    })}
  </div>);
}

function GenerateRow({children, row, ind}: {children?: React.ReactNode, row: number, ind: number})
{
  const arr = new Array(row).fill(1, 0, row);

  return (<div className="flex">
    {arr.map((_, index: number) => (
        <div className="w-8 h-8">
            <span>{index + row * ind}</span>
        </div>))
    }
  </div>);
}

export default function Table()
{
  return <div>
    <GenerateColumn column={10}/>
  </div>
}