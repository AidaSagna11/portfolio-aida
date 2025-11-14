export default function ItemDetail({ item }) {
  return (
    <div className="mt-4 border p-4 rounded">
      <h2 className="text-lg font-bold">{item.titre}</h2>
      <img src={item.image} alt="" className="w-32 h-32 object-cover mt-2" />
      <p className="mt-2">{item.description}</p>
    </div>
  );
}
