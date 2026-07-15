export async function queryStates() {
    try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        const data = await response.json()
        return data.map((state: any) => ({
          label: state.nome,
          value: state.sigla,
        }))
      } catch (error) {
        console.error("Erro ao buscar estados:", error)
      }
  }

  export async function queryCities(state: string) {
    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
        const data = await response.json() 
        return data.map((city: any) => ({
          label: city.nome,
          value: city.sigla,
        }))
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
      }
  }