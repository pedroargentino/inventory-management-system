import { FiPlus, FiSearch, FiEdit, FiTrash, FiArchive } from "react-icons/fi"
import { useState, useEffect } from "react"
import Sidebar from "../../components/Navigation/Sidebar"
import axios from "axios"

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [inventory, setInventory] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [allInventoryItems, setAllInventoryItems] = useState([]) 


  const isLowStock = (item) => {
    const quantity = item.quantity
    const unit = item.unit

    if (unit === "un" && quantity < 5) {
      return true
    }
    if ((unit === "g" || unit === "ml") && quantity < 500) {
      return true
    }

    if (unit === "kg" || unit === "l") {
      return false
    }

    if (item.minimumStock && quantity < item.minimumStock) {
      return true
    }
    return false
  }


  const isExpired = (item) => {
    if (!item.expirationDate) return false 
    const today = new Date()
    const expirationDate = new Date(item.expirationDate)
    
    today.setHours(0, 0, 0, 0)
    expirationDate.setHours(0, 0, 0, 0)
    return expirationDate < today
  }


  useEffect(() => {
    const fetchAllInventory = async () => {
      try {
        const response = await axios.get(
          "https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks",
        )
        const stocksWithCalculatedStatus = response.data.map((item) => {
          const expired = isExpired(item)
          const low = isLowStock(item)
          let status = "ok"
          if (expired) {
            status = "expired"
          } else if (low) {
            status = "low"
          }
          return { ...item, calculatedStatus: status }
        })
        setAllInventoryItems(stocksWithCalculatedStatus) 
        setInventory(stocksWithCalculatedStatus) 
      } catch (error) {
        console.error("Erro ao carregar o estoque", error)
        setAllInventoryItems([])
        setInventory([])
      }
    }
    fetchAllInventory()
  }, []) 

  useEffect(() => {
    const filtered = allInventoryItems.filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filter === "all" || item.calculatedStatus === filter
      return matchesSearch && matchesFilter
    })
    setInventory(filtered)
  }, [searchQuery, filter, allInventoryItems]) 

  const handleAddItem = async (formData) => {
    try {
      const payload = {
        itemName: formData.itemName,
        quantity: Number.parseInt(formData.quantity, 10),
        unit: formData.unit,
        expirationDate: formData.expirationDate,
        location: { id: formData.locationId },
        category: { id: formData.categoryId },
        minimumStock: formData.minimumStock ? Number.parseInt(formData.minimumStock, 10) : null,
      }
      const response = await axios.post(
        "https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks",
        payload,
      )
      const newItemWithStatus = {
        ...response.data,
        calculatedStatus: isExpired(response.data) ? "expired" : isLowStock(response.data) ? "low" : "ok",
      }
     
      setAllInventoryItems((prev) => [...prev, newItemWithStatus])
      setShowAddModal(false)
    } catch (error) {
      console.error("Erro ao adicionar item", error)
    }
  }

  const handleEditItem = (item) => {
    setCurrentItem(item)
    setShowEditModal(true)
  }

  const handleUpdateItem = async (updatedItem) => {
    try {
      const payload = {
        itemName: updatedItem.itemName,
        quantity: updatedItem.quantity,
        unit: updatedItem.unit,
        expirationDate: updatedItem.expirationDate,
        location: { id: updatedItem.locationId || updatedItem.location.id },
        category: { id: updatedItem.categoryId || updatedItem.category.id },
        minimumStock: updatedItem.minimumStock ? Number.parseInt(updatedItem.minimumStock, 10) : null,
      }
      const response = await axios.put(
        `https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks/${updatedItem.id}`,
        payload,
      )
      const updatedItemWithStatus = {
        ...response.data,
        calculatedStatus: isExpired(response.data) ? "expired" : isLowStock(response.data) ? "low" : "ok",
      }

      setAllInventoryItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItemWithStatus : i)))
      setShowEditModal(false)
    } catch (error) {
      console.error("Erro ao editar item", error)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks/${id}`)
    
      setAllInventoryItems((prev) => prev.filter((i) => i.id !== id))
    } catch (error) {
      console.error("Erro ao excluir item", error)
    }
  }

  return (
    <div className="page-container">
      <Sidebar />
      <main className="content">
        <div className="inventory-header">
          <h1>
            <FiArchive /> Produtos
          </h1>
          <div className="inventory-controls">
            <div className="search-filter">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                <option value="all">Todos</option>
                <option value="ok">Em estoque</option>
                <option value="low">Estoque baixo</option>
                <option value="expired">Expirados</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <FiPlus /> Adicionar Item
            </button>
          </div>
        </div>

        <div className="inventory-grid">
          <div className="inventory-table-header">
            <div className="header-cell">Nome</div>
            <div className="header-cell">Quantidade</div>
            <div className="header-cell">Localização</div>
            <div className="header-cell">Validade</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Ações</div>
          </div>
          {inventory.map((item) => (
            <div key={item.id} className="inventory-item">
              <div className="item-cell">{item.itemName}</div>
              <div className="item-cell">
                {item.quantity} {item.unit}
              </div>
              <div className="item-cell">{item.location?.stockName || "-"}</div>
              <div className="item-cell">{item.expirationDate}</div>
              <div className="item-cell">
                <span className={`status-badge ${item.calculatedStatus}`}>
                  {item.calculatedStatus === "ok" ? "OK" : item.calculatedStatus === "low" ? "Baixo" : "Expirado"}
                </span>
              </div>
              <div className="item-cell actions">
                <button className="btn-icon" onClick={() => handleEditItem(item)}>
                  <FiEdit />
                </button>
                <button className="btn-icon danger" onClick={() => handleDeleteItem(item.id)}>
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onSave={handleAddItem} />}
        {showEditModal && currentItem && (
          <EditItemModal item={currentItem} onClose={() => setShowEditModal(false)} onSave={handleUpdateItem} />
        )}
      </main>
    </div>
  )
}

const AddItemModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    unit: "un",
    locationId: "",
    expirationDate: "",
    categoryId: "",
    minimumStock: "",
  })
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations")
      .then((res) => setLocations(res.data))
    axios
      .get("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/categories")
      .then((res) => setCategories(res.data))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Item ao Estoque</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Item</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="g">Grama</option>
                <option value="l">Litro</option>
                <option value="ml">Mililitro</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Mínimo em Estoque</label>
            <input
              type="number"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
              placeholder="Opcional"
            />
          </div>
          <div className="form-group">
            <label>Localização</label>
            <select
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.stockName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Validade</label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: item.id,
    itemName: item.itemName,
    quantity: item.quantity,
    unit: item.unit,
    locationId: item.location.id,
    expirationDate: item.expirationDate,
    categoryId: item.category.id,
    minimumStock: item.minimumStock || "",
  })
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/locations")
      .then((res) => setLocations(res.data))
    axios
      .get("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/categories")
      .then((res) => setCategories(res.data))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Item do Estoque</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Item</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Unidade</label>
              <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="g">Grama</option>
                <option value="l">Litro</option>
                <option value="ml">Mililitro</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Mínimo em Estoque</label>
            <input
              type="number"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
              placeholder="Opcional"
            />
          </div>
          <div className="form-group">
            <label>Localização</label>
            <select
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.stockName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Validade</label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Inventory
