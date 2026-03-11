"use client"

import { useState, useEffect } from "react"
import { FiX, FiSearch } from "react-icons/fi"
import axios from "axios"

const RegisterModal = ({ onClose }) => {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState("")
  const [quantities, setQuantities] = useState({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    axios
      .get("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks")
      .then((res) => {
        const productsData = Array.isArray(res.data) ? res.data : []
        setProducts(productsData)
        const initialQuantities = {}
        productsData.forEach((product) => {
          initialQuantities[product.id] = product.quantity
        })
        setQuantities(initialQuantities)
      })
      .catch((err) => console.error("Erro ao carregar produtos", err))
  }, [])

  const handleFilterChange = (e) => setFilter(e.target.value)

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Number(value) || 0),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const toUpdate = products
      .filter((p) => quantities[p.id] !== p.quantity)
      .map((p) => ({
        id: p.id,
        newQuantity: quantities[p.id],
        originalQuantity: p.quantity,
        ...p,
      }))

    if (toUpdate.length === 0) {
      alert("Nenhuma alteração foi feita nas quantidades.")
      return
    }

    try {
      await Promise.all(
        toUpdate.map((item) => {
          const payload = {
            itemName: item.itemName,
            quantity: item.newQuantity,
            unit: item.unit,
            expirationDate: item.expirationDate,
            location: { id: item.location.id },
            category: { id: item.category.id },
          }

          return axios.put(
            `https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks/${item.id}`,
            payload,
          )
        }),
      )
      setSuccess(true)
    } catch (err) {
      console.error("Erro ao atualizar quantidades", err)
      alert("Erro ao atualizar as quantidades. Tente novamente.")
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.itemName.toLowerCase().includes(filter.toLowerCase()) ||
      (p.id && p.id.toString().toLowerCase().includes(filter.toLowerCase())) ||
      (p.category && p.category.name && p.category.name.toLowerCase().includes(filter.toLowerCase())),
  )

  const hasChanges = products.some((p) => quantities[p.id] !== p.quantity)

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-in" style={{ position: "relative" }}>
        {/* Close Button */}
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          <FiX />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="form-register">
            <h2>Registrar Baixa no Estoque</h2>
            <p style={{ color: "#666", marginBottom: "20px", fontSize: "14px" }}>
            </p>

            <div className="search-bar">
              <FiSearch />
              <input
                type="text"
                placeholder="Pesquisar por nome, categoria ou ID..."
                value={filter}
                onChange={handleFilterChange}
              />
            </div>

            <div className="product-list">
              {filteredProducts.map((prod) => {
                const currentQuantity = quantities[prod.id]
                const originalQuantity = prod.quantity
                const hasChanged = currentQuantity !== originalQuantity

                return (
                  <div key={prod.id} className="product-row">
                    <div className="product-info">
                      <strong>
                        <span className="product-name">{prod.itemName}</span>
                      </strong>
                      &nbsp;
                      <span className="product-details">
                        Atual: {originalQuantity} {prod.unit} | Local: {prod.location.stockName}
                        {hasChanged && (
                          <span style={{ color: "#e53e3e", fontWeight: "bold" }}>
                            {" → Nova: "}
                            {currentQuantity} {prod.unit}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="product-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="number"
                        min="0"
                        value={currentQuantity}
                        onChange={(e) => handleQuantityChange(prod.id, e.target.value)}
                        className="quantity-input"
                        style={{
                          border: hasChanged ? "2px solid #e53e3e" : "1px solid #ccc",
                          backgroundColor: hasChanged ? "#fff5f5" : "white",
                        }}
                      />
                      <span style={{ fontSize: "12px", color: "#666" }}>{prod.unit}</span>
                    </div>
                  </div>
                )
              })}
              {filteredProducts.length === 0 && <p className="empty-message">Nenhum produto encontrado.</p>}
            </div>

            {hasChanges && (
              <div style={{ backgroundColor: "#fff5f5", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
                <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>
                  <strong>Alterações detectadas:</strong>{" "}
                  {products.filter((p) => quantities[p.id] !== p.quantity).length} produto(s) serão atualizados.
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={!hasChanges}>
              {hasChanges ? "Confirmar Alterações" : "Nenhuma Alteração"}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>Quantidades atualizadas com sucesso!</h3>
            <p>As alterações já estão refletidas na aba de produtos.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterModal
