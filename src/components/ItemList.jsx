export default function ItemList({ items, selectItem, deleteItem, role }) {
  if (items.length === 0) return <p className="text-center text-gray-500">Aucun élément. Ajoute ta première compétence ou projet.</p>;

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="border p-3 rounded flex items-center justify-between">
          <div className="cursor-pointer flex items-center gap-3" onClick={() => selectItem(item)}>
            <img src={item.image} alt="" className="w-14 h-14 object-cover rounded" />
            <div>
              <p className="font-semibold">{item.titre}</p>
            </div>
          </div>

          {role === "admin" && (
            <div className="flex gap-2">
              <button onClick={() => selectItem(item)} className="bg-yellow-400 px-2 py-1 rounded">Modifier</button>
              <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
