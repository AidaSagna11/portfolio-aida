export default function ItemDetail({ item }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-200 transition hover:shadow-2xl">
      
      {/* Image */}
      <div className="w-full h-56 overflow-hidden rounded-xl mb-4">
        <img
          src={item.image || 'https://via.placeholder.com/300x200'}
          alt={item.titre}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Titre */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.titre}</h2>

      {/* Description */}
      <p className="text-gray-600 mb-6">{item.description}</p>

      {/* Voir le projet */}
      {item.lien && item.lien.trim() !== '' && (
        <a
          href={item.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Voir le projet
        </a>
      )}
    </div>
  )
}
