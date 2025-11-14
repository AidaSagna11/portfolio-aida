import { useState, useEffect } from "react";

export default function ItemForm({ addItem, updateItem, selectedItem, setSelectedItem }) {
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setTitre(selectedItem.titre);
      setImage(selectedItem.image);
      setDescription(selectedItem.description);
    } else {
      setTitre(''); setImage(''); setDescription('');
    }
  }, [selectedItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre) return alert('Le titre est requis.');

    if (selectedItem) {
      updateItem({ ...selectedItem, titre, image: image || selectedItem.image, description });
      setSelectedItem(null);
    } else {
      addItem({ id: Date.now(), titre, image: image || 'https://via.placeholder.com/150', description });
    }

    setTitre(''); setImage(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6 border p-4 rounded">
      <input className="border p-2 w-full" placeholder="Titre (ex: React, Mon projet...)" value={titre} onChange={e => setTitre(e.target.value)} />
      <input className="border p-2 w-full" placeholder="URL Image (optionnel)" value={image} onChange={e => setImage(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">{selectedItem ? "Modifier" : "Ajouter"}</button>
        {selectedItem && <button type="button" onClick={() => setSelectedItem(null)} className="px-4 py-2 border rounded">Annuler</button>}
      </div>
    </form>
  );
}
