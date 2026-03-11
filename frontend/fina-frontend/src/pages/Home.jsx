import { useEffect, useState } from "react"
import { FiPackage, FiAlertCircle, FiBox, FiArchive, FiSearch } from "react-icons/fi"
import styled from "styled-components"
import Sidebar from "../components/Navigation/Sidebar"
import axios from "axios" 

const Container = styled.div`
display: flex;
min-height: 100vh;
background: #f7fafc;
`

const MainContent = styled.main`
flex: 1;
padding: 2rem;
max-width: 1200px;
margin: 0 auto;
`

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 2rem;

h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: #2d3748;
  font-weight: 600;
}
`

const Controls = styled.div`
display: flex;
gap: 1rem;
margin-bottom: 2rem;
`

const SearchBox = styled.div`
display: flex;
align-items: center;
background: white;
padding: 0.5rem 1rem;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
width: 300px;

input {
  border: none;
  outline: none;
  margin-left: 0.5rem;
  flex: 1;
  font-size: 1rem;
}
`

const FilterSelect = styled.select`
padding: 0.5rem 1rem;
border-radius: 8px;
border: 1px solid #e2e8f0;
background: white;
cursor: pointer;
font-size: 1rem;
`

const StatsGrid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
gap: 1.5rem;
margin-bottom: 3rem;
`

const StatCard = styled.div`
background: ${(props) => props.bg};
padding: 1.5rem;
border-radius: 12px;
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
transition: transform 0.2s;

&:hover {
  transform: translateY(-2px);
}
`

const StatTitle = styled.h2`
display: flex;
align-items: center;
gap: 0.75rem;
font-size: 1rem;
color: #4a5568;
margin-bottom: 0.5rem;
`

const StatValue = styled.p`
font-size: 1.75rem;
font-weight: 700;
color: ${(props) => props.color || "#2d3748"};
`

const TableContainer = styled.div`
background: white;
border-radius: 12px;
box-shadow: 0 2px 10px rgba(0,0,0,0.1);
overflow: hidden;
`

const Table = styled.table`
width: 100%;
border-collapse: collapse;
`

const Th = styled.th`
padding: 1rem;
text-align: left;
background-color: #f7fafc;
color: #4a5568;
font-weight: 600;
border-bottom: 2px solid #e2e8f0;
`

const Td = styled.td`
padding: 1rem;
border-bottom: 1px solid #edf2f7;
`

const ExpiredBadge = styled.span`
background: #fff5f5;
color: #e53e3e;
padding: 0.25rem 0.5rem;
border-radius: 4px;
font-size: 0.875rem;
`

const ExpiringSoonBadge = styled.span`
background: #fffbeb; /* Light yellow background */
color: #d69e2e; /* Orange/yellow text */
padding: 0.25rem 0.5rem;
border-radius: 4px;
font-size: 0.875rem;
`

const Home = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

 
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

  
  const isExpiringSoon = (item) => {
    if (!item.expirationDate) return false
    const today = new Date()
    const expirationDate = new Date(item.expirationDate)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

   
    today.setHours(0, 0, 0, 0)
    expirationDate.setHours(0, 0, 0, 0)
    sevenDaysFromNow.setHours(0, 0, 0, 0)

    return expirationDate >= today && expirationDate <= sevenDaysFromNow
  }


  const addExpiredToShoppingList = async (expiredItems) => {
    try {
      const buylistResponse = await axios.get(
        "https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist",
      )
      const currentBuylist = Array.isArray(buylistResponse.data)
        ? buylistResponse.data
        : buylistResponse.data.buylist || []

      const itemsToAdd = expiredItems.filter(
        (expiredItem) => !currentBuylist.some((buyItem) => buyItem.reason === expiredItem.itemName),
      )

      for (const item of itemsToAdd) {
        await axios.post("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/buylist", {
          stockItem: null,
          quantity: 1,
          unit: "un",
          reason: item.itemName,
          purchased: false,
        })
        console.log(`Added expired item "${item.itemName}" to shopping list.`)
      }
    } catch (err) {
      console.error("Erro ao adicionar itens expirados à lista de compras:", err)
    }
  }

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("https://finastorage-c5fncheyeqecf2hp.brazilsouth-01.azurewebsites.net/api/stocks")
        if (!response.ok) throw new Error("Erro na requisição")
        const data = await response.json()
        setStocks(data)


        const expiredItems = data.filter((item) => new Date(item.expirationDate) < new Date())
        addExpiredToShoppingList(expiredItems)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [])

  const filteredStocks = stocks.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    const today = new Date()
    const expirationDate = new Date(item.expirationDate)

    switch (filter) {
      case "low":
        return matchesSearch && isLowStock(item)
      case "expired":
        return matchesSearch && expirationDate < today
      case "ok":
        return matchesSearch && !isLowStock(item) && expirationDate >= today 
      default:
        return matchesSearch
    }
  })

  const totalItems = stocks.length
  const totalQuantity = stocks.reduce((acc, item) => {
    if (item.unit === "kg" || item.unit === "l" || item.unit === "g" || item.unit === "ml") {
      return acc + 1 
    }
    return acc + item.quantity 
  }, 0)
  const lowStockItems = stocks.filter(isLowStock).length 
  const expiredItems = stocks.filter((item) => new Date(item.expirationDate) < new Date()).length


  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <Container>
      <Sidebar />
      <MainContent>
        <Header>
          <h1>
            <FiArchive /> Visão Geral{" "}
          </h1>
          <Controls>
            <SearchBox>
              <FiSearch />
              <input
                type="text"
                placeholder="Buscar item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>
            <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="ok">Em estoque</option>
              <option value="low">Estoque baixo</option>
              <option value="expired">Expirados</option>
            </FilterSelect>
          </Controls>
        </Header>

        <StatsGrid>
          <StatCard bg="#edf2f7">
            <StatTitle>
              <FiPackage size={20} />
              Produtos Cadastrados
            </StatTitle>
            <StatValue>{totalItems}</StatValue>
          </StatCard>

          <StatCard bg="#e6fffa">
            <StatTitle>
              <FiBox size={20} />
              Quantidade Total
            </StatTitle>
            <StatValue>
              {totalQuantity}
              {" unidades"}
            </StatValue>
          </StatCard>

          <StatCard bg="#fff5f5">
            <StatTitle>
              <FiAlertCircle size={20} color="#e53e3e" />
              Estoque Baixo
            </StatTitle>
            <StatValue color="#e53e3e">{lowStockItems}</StatValue>
          </StatCard>

          <StatCard bg="#fefcbf">
            <StatTitle>
              <FiAlertCircle size={20} color="#d69e2e" />
              Itens Expirados
            </StatTitle>
            <StatValue color="#d69e2e">{expiredItems}</StatValue>
          </StatCard>
        </StatsGrid>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Quantidade</Th>
                <Th>Mínimo</Th>
                <Th>Validade</Th>
                <Th>Localização</Th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((item) => {
                const isExpired = new Date(item.expirationDate) < new Date()
                const lowStock = isLowStock(item) 
                const expiringSoon = isExpiringSoon(item) 

                return (
                  <tr key={item.id}>
                    <Td>{item.itemName}</Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {item.quantity}
                        {item.unit}
                        {lowStock && <FiAlertCircle size={16} color="#e53e3e" title="Estoque Baixo" />}
                      </div>
                    </Td>
                    <Td>{item.minimumStock || "N/A"}</Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {item.expirationDate}
                        {isExpired && <ExpiredBadge>Expirado</ExpiredBadge>}
                        {!isExpired && expiringSoon && (
                          <>
                            <FiAlertCircle size={16} color="#d69e2e" title="Expirando em Breve" />
                            <ExpiringSoonBadge>Em Breve</ExpiringSoonBadge>
                          </>
                        )}
                      </div>
                    </Td>
                    <Td>{item.location?.stockName || "-"}</Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </TableContainer>
      </MainContent>
    </Container>
  )
}

export default Home
