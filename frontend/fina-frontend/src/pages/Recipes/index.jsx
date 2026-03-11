import { FiPlus, FiSearch, FiClock, FiBook, FiEdit, FiTrash } from 'react-icons/fi';
import { useState } from 'react';
import Sidebar from '../../components/Navigation/Sidebar';

const Recipes = () => {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Risoto de Cogumelos',
      description: 'Um clássico italiano cremoso e saboroso',
      ingredients: [
        { name: 'Arroz Arbóreo', quantity: 300, unit: 'g' },
        { name: 'Cogumelos Paris', quantity: 200, unit: 'g' },
        { name: 'Caldo de Legumes', quantity: 1, unit: 'l' }
      ],
      instructions: ['Passo 1...', 'Passo 2...'],
      preparationTime: 45,
      difficulty: 'Média',
      category: 'Italiana',
      favorite: true
    },
    //
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleAddRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
    setShowAddModal(false);
  };

  const handleEditRecipe = (updatedRecipe) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    ));
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <div className="recipes-header">
          <h1><FiBook /> Receitas</h1>
          <div className="recipes-controls">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar receita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Nova Receita
            </button>
          </div>
        </div>

        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="card-header">
                <h3>{recipe.name}</h3>
                {recipe.favorite && <span className="favorite-badge">★</span>}
              </div>
              <div className="card-body">
                <div className="recipe-meta">
                  <span><FiClock /> {recipe.preparationTime} min</span>
                  <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
                    {recipe.difficulty}
                  </span>
                </div>
                <p className="recipe-description">{recipe.description}</p>
                <div className="ingredients-preview">
                  {recipe.ingredients.slice(0, 3).map((ing, index) => (
                    <span key={index} className="ingredient-tag">
                      {ing.name}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <span className="more-ingredients">
                      +{recipe.ingredients.length - 3} ingredientes
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <RecipeModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddRecipe}
          />
        )}

        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={() => {
              setShowAddModal(true);
              setSelectedRecipe(null);
            }}
            onDelete={handleDeleteRecipe}
          />
        )}
      </main>
    </div>
  );
};

const RecipeModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [],
    instructions: [],
    preparationTime: 30,
    difficulty: 'Fácil',
    category: '',
    favorite: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now()
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nova Receita</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome da Receita</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tempo de Preparo (min)</label>
              <input
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Dificuldade</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) => setFormData({...formData, favorite: e.target.checked})}
              />
              Favorita
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar Receita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Modal de Detalhes da Receita
const RecipeDetailModal = ({ recipe, onClose, onEdit, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="recipe-detail-header">
          <h2>{recipe.name}</h2>
          {recipe.favorite && <span className="favorite-badge">★</span>}
        </div>

        <div className="recipe-meta">
          <span><FiClock /> {recipe.preparationTime} minutos</span>
          <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="recipe-content">
          <h3>Ingredientes</h3>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {ing.quantity} {ing.unit} de {ing.name}
              </li>
            ))}
          </ul>

          <h3>Modo de Preparo</h3>
          <ol className="instructions-list">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="recipe-actions">
          <button className="btn btn-primary" onClick={onEdit}>
            <FiEdit /> Editar
          </button>
          <button className="btn btn-danger" onClick={() => {
            if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
              onDelete(recipe.id);
              onClose();
            }
          }}>
            <FiTrash /> Excluir
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipes;