import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          <SelectLabel>Fruits</SelectLabel>
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