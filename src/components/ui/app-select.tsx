import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

export function SelectDemo() {
  const items = [
  { label: "Selecione um tipo", value: null },
  { label: "Dureza Total", value: "hardness" },
  { label: "Cloro Residual Livre", value: "frc" },
  { label: "Cloretos", value: "chloride" },
  { label: "Tubidez", value: "turbidity" },
  { label: "pH", value: "ph" },
  { label: "Temperatura", value: "temperature" }
  ]
  
  return (
    <Select items={items}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Medida</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectCity() {
  const [cities, setCities] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
        const data = await res.json()
        setCities(data.map((city: any) => ({
          label: city.nome,
          value: city.id,
        })))
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
        setCities([])
      }
    }

    loadCities()
  }, [])

  return (
    <Select items={cities}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cidades</SelectLabel>
          {cities.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectState() {
  const [states, setStates] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        const data = await res.json()
        setStates(data.map((state: any) => ({
          label: state.nome,
          value: state.sigla,
        })))
      } catch (error) {
        console.error("Erro ao buscar estados:", error)
        setStates([])
      }
    }

    loadStates()
  }, [])

  return (
    <Select items={states}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Estados</SelectLabel>
          {states.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}